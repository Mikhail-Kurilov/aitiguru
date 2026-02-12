import LoginForm from "../../components/Login/LoginForm";

const Login = () => {
  return (
    <div className="flex flex-col w-[850px] bg-white items-center py-4 my-2 rounded-lg mt-40">
      <h2 className="text-xl font-bold">Выберете имя пользователя и введите пароль</h2>
      <LoginForm />
    </div>
  );
};

export default Login;
