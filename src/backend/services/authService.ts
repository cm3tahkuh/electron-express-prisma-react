import { PrismaClient } from "../generated/prisma";
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient();

interface User {
  login: string;
  password: string;
}

export const registerCustomerService = async ({ login, password }: User) => {
  const existUser = await prisma.user.findUnique({ where: { login: login } });

  if (existUser) {
    throw new Error("Пользователь с таким именем существует");
  }

  const roleCustomer = await prisma.role.findUnique({
    where: {
      roleName: "customer",
    },
  });

  if (!roleCustomer) {
    throw new Error("Роль не найдена!!!");
  }

  const addUser = await prisma.user.create({
    data: {
      login,
      password,
      roleId: roleCustomer.id,
    },
  });

  const createCart = await prisma.cart.create({
    data: {
      userId: addUser.id,
    },
  });
};

export const loginCustomerService = async ({ login, password }: User) => {
  const userExist = await prisma.user.findUnique({
    select: {
      id: true,
      login: true,
      password: false,
      role: {
        select: {
          roleName: true,
        },
      },
    },
    where: {
      login: login,
      password: password,
      deletedAt: null,
    },
  });

  if (!userExist) {
    throw new Error("Неправильный логин или пароль");
  }

  const token = generateToken(userExist);

  return { userExist, token };
};

export const logoutCustomerService = () => {
  return { message: "Вы успешно вышли из системы!" };
};
