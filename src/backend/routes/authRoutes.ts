import { Router } from "express";
import {
  loginCustomer,
  logoutCustomer,
  registerCustomer,
} from "../controllers/authController";

const router = Router();

router.post("/register", registerCustomer);

router.post("/login", loginCustomer);

router.post("/logout", logoutCustomer);

export default router;
