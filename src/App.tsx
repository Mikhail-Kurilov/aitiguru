import './App.css'
import {Route, Routes} from "react-router-dom";
import routes from "./constants/routes.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useEffect} from "react";
import {refreshAccessToken, saveTokens} from "./components/Auth/auth.ts";

function App() {
const queryClient = new QueryClient();

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const data = await refreshAccessToken();
        saveTokens(data.accessToken, data.refreshToken);
        console.log('Session restored');
      } catch {
        console.log('User not authenticated');
      }
    };

    tryRefresh();
  }, []);

  return (
    <main className=" flex flex-grow pt-2 px-4 text-gray-800 rounded shadow-md mx-auto">
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
