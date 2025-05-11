import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

interface Product {
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

export const getAllProductsService = async () => {
  return await prisma.product.findMany({ where: { deletedAt: null } });
};

export const addProductService = async (product: Product) => {
  const addUser = prisma.product.create({ data: product });
  return addUser;
};

export const updateProductService = async ({
  id,
  product,
}: {
  id: number;
  product: Product;
}) => {
  const existUser = prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!existUser) {
    throw new Error("Пользователь не найден");
  }

  const updateProduct = await prisma.product.update({
    where: { id: id },
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      image: product.image,
    },
  });

  return updateProduct;
};

export const deleteProductService = async (id: number) => {
  return await prisma.product.update({
    where: {
      id: id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};

export const getProductsBySortingService = async ({
  searchString,
  sortBy,
  minPrice,
  maxPrice,
}: {
  searchString?: string;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  try {
    let orderByClause: { createdAt: "asc" | "desc" } = { createdAt: "asc" };
    if (sortBy === "new") orderByClause = { createdAt: "desc" };

    const whereClause: any = {};

    whereClause.deletedAt = null;

    if (typeof minPrice === "number" && typeof maxPrice === "number") {
      whereClause.price = {
        gte: minPrice,
        lte: maxPrice,
      };
    }

    if (searchString && searchString.trim() !== "") {
      whereClause.name = {
        contains: searchString,
        // mode: 'insensitive',
      };
    }

    whereClause.quantity = {
      gt: 0,
    };

    whereClause.deletedAt = null;
    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause,
    });

    return products;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при фильтрации");
  }
};
