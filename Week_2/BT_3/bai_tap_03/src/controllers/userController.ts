// src/controllers/userController.ts
import { Request, Response } from "express";
import { CRUDService } from "../services/CRUDService";
import { User } from "../models/User";

const userService = new CRUDService(User);

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.findAll();
    res.render("users/findAllUser", { users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const renderCreate = (req: Request, res: Response) => {
  res.render("crud"); // hoặc form tạo user
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email } = req.body;
    await userService.create({ firstName, lastName, email });
    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Create user failed");
  }
};

export const renderUpdate = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await userService.findOne(id);
  if (!user) return res.status(404).send("Not found");
  res.render("users/updateUser", { user });
};

export const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { firstName, lastName, email } = req.body;
  await userService.update(id, { firstName, lastName, email });
  res.redirect("/users");
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await userService.delete(id);
  res.redirect("/users");
};
