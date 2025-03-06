import jwt from "jsonwebtoken";

const generateAccessToken = async (user) => {
  return jwt.sign(user, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRY,
  });
};

export { generateAccessToken };
