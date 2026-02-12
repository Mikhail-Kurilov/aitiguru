import { Login, Content, FortyFour } from "../pages";
import PrivateRoute from "../components/Auth/PrivateRoute.tsx";

const routes = [
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Content />
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
