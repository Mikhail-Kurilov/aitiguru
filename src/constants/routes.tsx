import FortyFour from "../features/fortyfour/FortyFour";
import Login from "../features/login/Login";
import PrivateRoute from "../features/login/auth/PrivateRoute";
import { lazy } from "react";

const Products = lazy(() => import("../features/products/Products"));

const routes = [
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Products />
      </PrivateRoute>
    ),
    name: "Content",
  },
  {
    path: "/login",
    element: <Login />,
    name: "Login",
  },
  {
    path: "*",
    element: <FortyFour />,
  },
];

export default routes;
