import express from "express";
import cors from "cors";
import morgran from "morgan";
import dotenv from "dotenv";
import router from "./upload.js";
import { authSequelize } from "./config/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgran("dev"));
app.use(cors());

authSequelize();

app.use(router);

app.listen(port, () => {
  console.log(`server started of port ${port}`);
});