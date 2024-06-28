import express from "express";
import { router } from "../route/auth.js";
import { error } from "../middleware/middleware-error.js";
import { appRoute } from "../route/app.js";
import cors from "cors";

export const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(router);
app.use(appRoute);

app.use(error);

export const port = process.env.PORT || 3000;
