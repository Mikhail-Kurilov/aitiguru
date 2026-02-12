import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation, } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';


type Variant = 'LOGIN' | 'REGISTER';

interface LoginFormData {
  username?: string;
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}


const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('userToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const fetchMe = async (token: string) => {
  const res = await fetch('https://dummyjson.com/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to fetch user');

  return res.json();
};



const useAuthMutations = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = async (data: LoginResponse, message: string) => {
    const { accessToken, refreshToken } = data;
    saveTokens(accessToken, refreshToken);

    try {
      const user = await fetchMe(accessToken);
      console.log('Logged in user:', user);
      toast.success(message);
      navigate('/');
    } catch (error) {
      toast.error('Failed to fetch user info');
    }
  };

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: data.email,
          password: data.password,
          expiresInMins: 30,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }

      return res.json();
    },
    onSuccess: (data) => handleAuthSuccess(data, 'You’re signed in! 😊'),
    onError: (error: any) => toast.error(error.response?.data?.message || 'Login failed. Try again!'),
  });

  const registerMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const res = await fetch('https://dummyjson.com/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Registration failed');

      return res.json();
    },
    onSuccess: async () => {
      toast.success('Account created! Logging you in...');

      // Auto-login after registration
      loginMutation.mutate({
        email: data.email,
        password: data.password,
      });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Registration failed.'),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // потом заменить на нормальный запрос
    },
    onSuccess: () => toast.success('Check your email for a reset link! 😊'),
    onError: () => toast.error('Couldn’t send reset email.'),
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
    defaultValues: { username: '', email: '', password: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const emailValue = watch('email');

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
    if (!emailValue) {
      toast.error('Enter your email first 😊');
      return;
    }
    resetPassword(emailValue);
  };


  const inputClasses = "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const errorClasses = "text-red-500 text-xs mt-1";

  return (
    <div className="max-w-md w-full mx-auto mt-10 bg-white rounded-lg shadow-lg p-6">
      <Toaster position="top-center" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mb-6">
        {variant === 'REGISTER' && (
          <div>
            <label htmlFor="username" className={labelClasses}>Username</label>
            <Controller
              control={control}
              name="username"
              rules={{ required: 'Username is required' }}
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
            {errors.username && <span className={errorClasses}>{errors.username.message}</span>}
          </div>
        )}

        <div>
          <label htmlFor="email" className={labelClasses}>Email</label>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email! 😊' }
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
          {errors.email && <span className={errorClasses}>{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="password" className={labelClasses}>Password</label>
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters! 😊' }
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
          {errors.password && <span className={errorClasses}>{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
        >
          {isLoading ? 'Loading...' : (variant === 'LOGIN' ? 'Sign in' : 'Register')}
        </button>

        {variant === 'LOGIN' && (
          <div className="text-right">
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={isLoading}
              className="text-blue-600 text-sm hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}
      </form>

      <div className="flex items-center justify-center my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="mx-2 text-gray-500 text-xs">Or continue with</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="flex justify-center items-center text-sm">
        <span className="text-gray-600">
          {variant === 'LOGIN' ? 'New Here?' : 'Already have an account?'}
        </span>
        <button
          type="button"
          onClick={toggleVariant}
          disabled={isLoading}
          className="ml-2 text-blue-600 font-semibold hover:underline"
        >
          {variant === 'LOGIN' ? 'Create an account' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;