import { Router } from "express";
import { getAllSales } from "../controllers/saleController";

const router = Router();

router.get("/", getAllSales);

export default router;
