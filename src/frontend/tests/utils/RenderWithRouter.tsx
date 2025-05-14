import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { createMemoryRouter } from "react-router-dom";
import { routes } from "../../app/router/";
import { RadixThemeProvider } from "../../app/theme";

export const renderWithRouter = (initialPath: string = "/") => {
  const queryClient = new QueryClient();

  const router = createMemoryRouter(routes, {
    initialEntries: [initialPath],
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RadixThemeProvider>
        <RouterProvider router={router} />
      </RadixThemeProvider>
    </QueryClientProvider>
  );
};
