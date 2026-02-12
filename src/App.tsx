import './App.css'
import {Route, Routes} from "react-router-dom";
import routes from "./constants/routes.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useEffect} from "react";

function App() {
const queryClient = new QueryClient();

  const saveTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('userToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const refreshAccessToken = async (refreshToken: string) => {
    const res = await fetch('https://dummyjson.com/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        refreshToken,
        expiresInMins: 30,
      }),
    });

    if (!res.ok) throw new Error('Refresh failed');

    return res.json();
  };

  useEffect(() => {
    const tryRefresh = async () => {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) return;

      try {
        const data = await refreshAccessToken(storedRefreshToken);
        saveTokens(data.accessToken, data.refreshToken);
      } catch {
        console.log('Пользователь не авторизован');
      }
    };

    tryRefresh().then(() =>console.log("Обновлено"));
  }, []);

  return (
    <main className="flex-grow pt-2 px-4 bg-gray-50 text-gray-800 rounded shadow-md mx-auto">
      <QueryClientProvider client={queryClient}>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}/>
          ))}
        </Routes>
      </QueryClientProvider>
    </main>
  )
}

export default App
