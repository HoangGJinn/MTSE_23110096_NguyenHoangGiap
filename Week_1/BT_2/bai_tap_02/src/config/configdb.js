"use strict";

const mongoose = require("mongoose");

const connectMongo = async () => {
  const uri = process.env.MONGO_URI || "mongodb+srv://hoanggiap:hoanggiap1597@cluster0.vbrnico.mongodb.net/?appName=Cluster0";
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected:", uri);
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};

module.exports = connectMongo;
