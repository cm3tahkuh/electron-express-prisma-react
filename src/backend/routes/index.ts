import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import productRoutes from "./productRoutes";
import cartRoutes from "./cartRoutes";
import saleRoutes from "./saleRoutes";

const router = Router();

router.use("/users", userRoutes);

router.use("/auth", authRoutes);

router.use("/products", productRoutes);

router.use("/carts", cartRoutes)

router.use("/sales", saleRoutes)

export default router;
