import { createMemoryRouter, RouteObject } from "react-router-dom";
import { Main } from "@pages/main";
import { Layout } from "@shared/layout";
import { Catalog } from "@pages/catalog";
import { Authorization } from "@pages/authorization";
import { AdminPanel } from "@pages/adminpanel";
import { CartPage } from "@pages/cartpage";



export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: "catalog",
        element: <Catalog />,
      },
      {
        path: "auth",
        element: <Authorization />,
      },
      {
        path: "cart",
        element: <CartPage/>,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminPanel />,
  },
];

export const router = createMemoryRouter(routes);
