import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation, } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import { FaRegUser } from 'react-icons/fa';
import { TbMail } from 'react-icons/tb';
import { FiLock } from 'react-icons/fi';

type Variant = 'LOGIN' | 'REGISTER';

interface LoginFormData {
  username: string;
  email?: string;
  password: string;
  remember: boolean;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}


const saveTokens = (accessToken: string, refreshToken: string, remember: boolean) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem('userToken', accessToken);
  storage.setItem('refreshToken', refreshToken);
};

const fetchMe = async (token: string) => {
  const res = await fetch('https://dummyjson.com/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};



const useAuthMutations = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = async (data: LoginResponse, message: string, remember: boolean) => {
    const { accessToken, refreshToken } = data;
    saveTokens(accessToken, refreshToken, remember);
    try {
      const user = await fetchMe(accessToken);
      console.log('Logged in user:', user);
      toast.success(message);
      navigate('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      toast.error('Ошибка загрузки данных пользователя');
    }
  };

  const loginMutation = useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: async (data: LoginFormData) => {
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          expiresInMins: 30,
        }),
      });
      console.log('Login response:', res);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }
      return res.json();
    },
    onSuccess: (data,variables) => handleAuthSuccess(data, 'Вы залогировались! 😊', variables.remember),
    onError: (error) => toast.error(error.message || 'Ошибка. Попробуйте снова!'),
  });

  const registerMutation = useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: async (data: LoginFormData) => {
      const res = await fetch('https://dummyjson.com/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Registration failed');
      return res.json();
    },
    onSuccess: async (_, variables) => {
      toast.success('Аккаунт создан! Вы залогировались...');
      loginMutation.mutate({
        username: variables.username,
        password: variables.password,
        remember: variables.remember,
      });
    },
    onError: (error) => toast.error(error.message || 'Ошибка регистрации'),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // потом заменить на нормальный запрос
    },
    onSuccess: () => toast.success('Проверьте ваши email для сброса пароля! 😊'),
    onError: () => toast.error('Не удалось отправить письмо.'),
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    isLoading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      resetPasswordMutation.isPending,
  };
};


const LoginForm: React.FC = () => {
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const { login, register, resetPassword, isLoading } = useAuthMutations();

  const { control, handleSubmit, formState: { errors }, watch } = useForm<LoginFormData>({
    defaultValues: { username: '', email: '', password: '', remember: false },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const usernameValue = watch('username');

  const toggleVariant = useCallback(() => {
    setVariant((current) => (current === 'LOGIN' ? 'REGISTER' : 'LOGIN'));
  }, []);

  const onSubmit = (data: LoginFormData) => {
    if (variant === 'LOGIN') {
      login(data);
    } else {
      register(data);
    }
  };

  const handleResetPassword = () => {
    if (!usernameValue) {
      toast.error('Сначала введите имя пользователя 😊');
      return;
    }
    resetPassword(usernameValue);
  };


  const inputClasses = "w-full pl-8 pr-2 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400";
  const labelClasses = "block text-md font-medium text-gray-800 mb-1 text-left";
  const errorClasses = "text-red-500 text-xs mt-1";

  return (
    <div className="max-w-md w-full mx-auto mt-2 bg-white rounded-lg shadow-lg p-6">
      <Toaster position="top-center" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mb-3">
          <div>
            <label htmlFor="username" className={labelClasses}>Имя пользователя</label>
            <div className="relative">
              <FaRegUser className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2" />
              <Controller
                control={control}
                name="username"
                rules={{ required: 'Введите имя пользователя!' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    id="username"
                    type="text"
                    disabled={isLoading}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    className={`${inputClasses} ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                  />
                )}
              />
            </div>
            {errors.username && <span className={errorClasses}>{errors.username.message}</span>}
          </div>

        {variant === 'REGISTER' && (
        <div>
          <label htmlFor="email" className={labelClasses}>Email</label>
          <div className="relative">
            <TbMail className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2" />
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Введите email!',
                pattern: { value: /^\S+@\S+$/i, message: 'Пожалуйста введите валидный email! 😊' }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <input
                  id="email"
                  type="email"
                  disabled={isLoading}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  className={`${inputClasses} ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
              )}
            />
          </div>
          {errors.email && <span className={errorClasses}>{errors.email.message}</span>}
        </div>
          )}

        <div>
          <label htmlFor="password" className={labelClasses}>Пароль</label>
          <div className="relative">
            <FiLock className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2" />
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Введите пароль!',
                minLength: { value: 6, message: 'Пароль должен содержать минимум 6 символов! 😊' },
                maxLength: { value: 20, message: 'Пароль должен содержать максимум 20 символов! 😊'},
                // pattern: {
                //   value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/,
                //   message: 'Пароль должен содержать буквы и цифры',
                // }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <input
                  id="password"
                  type="password"
                  disabled={isLoading}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  className={`${inputClasses} ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
              )}
            />
          </div>
          {errors.password && <span className={errorClasses}>{errors.password.message}</span>}
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <Controller
            name="remember"
            control={control}
            render={({field}) => (
              <input
                type="checkbox"
                id="remember"
                className="h-5 w-5"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
          <label htmlFor="remember">Запомнить данные</label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300 cursor-pointer"
        >
          {isLoading ? 'Loading...' : (variant === 'LOGIN' ? 'Войти' : 'Зарегистрироваться')}
        </button>

        {variant === 'LOGIN' && (
          <div className="text-right">
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={isLoading}
              className="text-blue-600 text-sm hover:underline cursor-pointer"
            >
              Забыли пароль?
            </button>
          </div>
        )}
      </form>

      <div className="flex items-center justify-center mt-3 mb-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="mx-2 text-gray-500 text-xs">или</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="flex justify-center items-center text-sm">
        <span className="text-gray-600">
          {variant === 'LOGIN' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
        </span>
        <button
          type="button"
          onClick={toggleVariant}
          disabled={isLoading}
          className="ml-2 text-blue-600 font-semibold hover:underline cursor-pointer"
        >
          {variant === 'LOGIN' ? 'Создать' : 'Залогироваться'}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;