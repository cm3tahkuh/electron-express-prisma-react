import { RadixThemeProvider } from "./theme";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { TanStackProvider } from "./queryProvider";
import useUserStore from "@store/userStore";
import { useEffect } from "react";

const App: React.FC = () => {
  const store = useUserStore();

  useEffect(() => {
    store.checkAuth();
  }, []);
  return (
    <RadixThemeProvider>
      <TanStackProvider>
        <RouterProvider router={router} />
      </TanStackProvider>
    </RadixThemeProvider>
  );
};

export default App;
