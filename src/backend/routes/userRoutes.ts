import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../controllers/userController";

const router = Router();

router.get("/", getAllUsers);

router.post("/createUser", createUser);

router.put("/updateUserById", updateUser);

router.delete("/deleteUserById", deleteUser);

export default router;
