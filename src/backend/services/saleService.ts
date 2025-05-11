import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const getAllSalesService = async () => {
  return await prisma.sale.findMany({
    orderBy: { soldAt: "desc" },
    select: {
      soldAt: true,
      user: { select: { id: true, login: true, password: false, role: false } },
      SaleItem: { include: { product: true } },
    },
  });
};
