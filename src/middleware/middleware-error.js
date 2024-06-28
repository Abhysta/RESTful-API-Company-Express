import { MulterError } from "multer";
import { ResponseError } from "../error/responseError.js";

export const error = (err, req, res, next) => {
  if (!err) {
    next();
  }

  if (err instanceof MulterError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err instanceof ResponseError) {
    res.status(err.status).json({
      message: err.message,
    });
  } else {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
