import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const init = async () => {
  const roles = ["admin", "manager", "customer"];

  for (const roleName of roles) {
    const existingRole = await prisma.role.findUnique({
      where: { roleName: roleName },
    });

    if (!existingRole) {
      await prisma.role.create({
        data: {
          roleName: roleName,
        },
      });
      console.log(`Роль "${roleName}" создана.`);
    }
  }

  const adminLogin = "admin";
  const adminPassword = "admin";
  const adminRole = await prisma.role.findUnique({
    where: { roleName: "admin" },
  });

  const existingAdmin = await prisma.user.findUnique({
    where: { login: adminLogin },
  });

  if (!existingAdmin && adminRole) {
    await prisma.user.create({
      data: {
        login: adminLogin,
        password: adminPassword,
        roleId: adminRole.id,
      },
    });
    console.log("Админ создан.");
  }
};

export default init;
