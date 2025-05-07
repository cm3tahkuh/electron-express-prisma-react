import { getAllSalesService } from "../services/saleService";
import { Request, Response } from "express";
import { authorize } from "../utils/authorize";

export const getAllSales = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const decoded = authorize(req, res, ["admin", "manager"]);
    if (!decoded) {
      return;
    }

    const sales = await getAllSalesService();
    res.status(200).json(sales);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ошибка при получении списка продаж" });
  }
};
