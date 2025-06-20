import './App.css'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/authentication/LoginPage'
import RecipeFormPage from './pages/recipe-form/RecipeFormPage';
import { useUserStore } from './context/AuthContext';
import { useEffect } from 'react';

function Dashboard() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">📊 Dashboard</h2>
      <p>Welcome to the GitHub-like layout demo!</p>
    </div>
  );
}

function App() {
  const { bootstrap } = useUserStore();

  useEffect(() => {
    bootstrap();
  }, []);

  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route path="" element={<Dashboard />} />
        <Route path="recipe/:id" element={<RecipeFormPage />} />
      </Route>

      <Route path="/sign-in" element={<LoginPage />} />

    </Routes>
  )
}

export default App
