// src/server.ts
import "reflect-metadata"; // must be first
import express from "express";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
import webRoutes from "./routes/web";
import { connectDB } from "./config/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// static files
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", webRoutes);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server", err);
});
