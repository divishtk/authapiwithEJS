import { User } from "../models/users.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateAccessToken = async (user) => {
  //const userPayload = {};
  return jwt.sign(user, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRY,
  });
};

const home = async (req, resp) => {
  resp.render("index");
};

const signup = async (req, resp) => {
  const { email, password, username, name, age } = req.body;

  if (
    [email, password, username, name, age].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    return resp.status(401).json({
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

  const token = await generateAccessToken({
    email,
    userid: createAcc._id,
  });
  resp.cookie("Token", token);
  await createAcc.save();

  resp.send("Registered");
};

export { home, signup };
