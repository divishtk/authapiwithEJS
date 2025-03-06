import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.Token 
  if (!token || req.cookies.Token === "")
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized Token" });
  try {
    const decoedePayload = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.user = decoedePayload;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, error: "Something went wrong   " });
  }
};

export { authMiddleware };
