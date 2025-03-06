import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.Token;
    if (!token) {
      return res.redirect("/login");
    }
    const decoedePayload = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.user = decoedePayload;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, error: "Something went wrong" });
  }
};

export { authMiddleware };
