import express from "express";
import bodyParser from "body-parser"; // For parsing JSON bodies
import cookieParser from "cookie-parser";
import { User } from "./models/users.models.js";
import { Post } from "./models/posts.models.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "./utils/jwt.utils.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
const app = express();
app.use(express.static("./assets"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

//app.use('/v1',userRouter)

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/register", async (req, resp) => {
  const { email, password, username, name, age } = req.body;

  if (
    [email, password, username, name, age].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    return resp.status(500).json({
      success: false,
      error: "Please provide all fields!!",
    });
  }

  const user = await User.findOne({ email });
  if (user) {
    return resp.status(501).json({
      success: false,
      error: "User already exists!!",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const createAcc = await User.create({
    email,
    username,
    name,
    age,
    password: hashedPass,
  });
  await createAcc.save();

  const token = await generateAccessToken({
    email,
    userid: createAcc._id,
  });
  resp.cookie("Token", token);
  resp.send("Registered");
});

app.get("/login", async (req, resp) => {
  resp.render("login");
});

app.get("/profile", authMiddleware, async (req, resp) => {
  const user = await User.findOne({ email: req.user.email }).populate("posts");
  resp.render("profile", { user });
});

app.get("/like/:id", authMiddleware, async (req, resp) => {
  const post = await Post.findOne({ _id: req.params.id }).populate("user");

  if (post.likes.indexOf(req.user.userid) === -1) {
    post.likes.push(req.user.userid);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.userid), 1);
  }

  await post.save();
  resp.redirect("/profile");
});

app.get("/edit/:id", authMiddleware, async (req, resp) => {
  const post = await Post.findOne({ _id: req.params.id }).populate("user");
  resp.render("edit", { post });
});

app.post("/update/:id", authMiddleware, async (req, resp) => {
  const newPost = req.body.newPost;
  const postId = req.params.id;
  const updatePost = await Post.findByIdAndUpdate(
    postId,
    {
      content: newPost,
    },
    {
      new: true,
    }
  );
  await updatePost.save();
  resp.redirect("/profile");
});

app.get("/delete/:id", authMiddleware, async (req, resp) => {
  const postid = req.params.id;
  await Post.findByIdAndDelete(postid);
  resp.redirect("/profile");
});

app.post("/post", authMiddleware, async (req, res) => {
  const loggedInUser = req.user;

  const us = await User.findOne({ email: loggedInUser.email });
  const { post } = req.body;
  const postCreation = await Post.create({
    user: us._id,
    content: post,
  });

  //await postCreation.save();
  us.posts.push(postCreation._id);
  await us.save();

  res.redirect("/profile");
});

app.post("/login", async (req, resp) => {
  const { email, password } = req.body;

  if ([email, password].some((fields) => fields?.trim() === "")) {
    return resp.status(401).json({
      success: false,
      error: "Please provide all fields!!",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return resp.status(501).json({
      success: false,
      error: "Please create account!!",
    });
  }

  const checkPassword = await user.isMatchPassword(password);
  if (!checkPassword) {
    return resp.status(401).json({
      success: false,
      message: "Please provide the correct password",
    });
  }

  const token = await generateAccessToken({
    email,
    userid: user._id,
  });
  resp.cookie("Token", token);
  resp.redirect("/profile");

  // return resp.status(201).json({
  //   success: true,
  //   data: user,
  //   message: "Logged in",
  // });
});

app.get("/logout", async (req, resp) => {
  resp.clearCookie("Token");
  resp.redirect("/login");
});

export { app };
