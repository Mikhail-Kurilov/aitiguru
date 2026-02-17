import LoginForm from "./components/LoginForm";
import svgUrl from "../../assets/logo.svg";

const Login = () => {
  return (
    <div className="flex flex-col w-full bg-white items-center py-4 my-2 rounded-lg mt-10 gap-4">
      <img src={svgUrl} alt="Logo" />
      <h2 className="text-3xl font-bold">Добро пожаловать!</h2>
      <p className="text-gray-400">Пожалуйста, авторизируйтесь</p>
      <LoginForm />
    </div>
  );
};

export default Login;
