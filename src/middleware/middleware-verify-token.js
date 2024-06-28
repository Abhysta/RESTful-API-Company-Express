import jwt from "jsonwebtoken";

export const verify = async (req, res, next) => {
  const token = await req.headers["authorization"];
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  } else {
    const bearer = token.split(" ")[1];
    jwt.verify(bearer, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
      req.user = user;
      next();
    });
  }
};
