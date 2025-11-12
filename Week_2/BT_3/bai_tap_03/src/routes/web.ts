// src/routes/web.ts
import { Router } from "express";
import * as userController from "../controllers/userController";

const router = Router();

router.get("/", (req, res) => res.redirect("/users"));
router.get("/users", userController.getAllUsers);
router.get("/users/create", userController.renderCreate);
router.post("/users/create", userController.createUser);
router.get("/users/edit/:id", userController.renderUpdate);
router.post("/users/edit/:id", userController.updateUser);
router.get("/users/delete/:id", userController.deleteUser);

export default router;
