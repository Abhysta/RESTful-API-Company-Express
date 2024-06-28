import express from "express";
import { verify } from "../middleware/middleware-verify-token.js";
import appController from "../controller/appController.js";
import multer from "multer";
import { ResponseError } from "../error/responseError.js";

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/webp"
    ) {
      cb(null, true);
    } else {
      cb(new ResponseError("Only image allowed and less than 1mb", 400), false);
    }
  },
});

const appRoute = express.Router();
appRoute.use(verify);
appRoute.get("/app/:pages", appController.getData);
appRoute.post("/app/addCompany", upload.single("image"), appController.addData);
appRoute.get("/app/:idCompany", appController.getDataById);
appRoute.delete("/app/:idCompany", appController.deleteData);
appRoute.patch(
  "/app/:idCompany",
  upload.single("image"),
  appController.editData
);
appRoute.get("/app/search/searchData", appController.searchData);

export { appRoute };
