// import './App.css'
import {Route, Routes} from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/authentication/LoginPage'
import RecipeFormPage from './pages/recipe-form/RecipeFormPage';
import {useUserStore} from './context/AuthContext';
import {useEffect} from 'react';
import {TestEditor} from './pages/test/TestEditor';
import {bootstrapRecipes} from "./services/recipeService.js";
import RecipeDetail from './pages/recipe-details/RecipeDetails.jsx'
import RecipeList from './pages/recipes-list/RecipeList.jsx';
import MealPlanner from './pages/meal-planner/MealPlanner.jsx';
import './assets/styles/animation.css';
import ForgotPasswordPage from "./pages/authentication/ForgotPasswordPage.jsx";
import ProfileEditForm from "./pages/ProfilePages/ProfileEditForm.jsx";
import ProfilePage from "./pages/ProfilePages/ProfilePage.jsx";
import FavoriteRecipes from './pages/FavoriteRecipes/FavoriteRecipes.jsx';
function Dashboard() {
    return (
        <div className='w-full'>
            <h2 className="text-xl font-semibold mb-3">📊 Dashboard</h2>
            <p>Welcome to the GitHub-like layout demo!</p>
        </div>
    );
}

function App() {
    const {bootstrap} = useUserStore();

    useEffect(() => {
        bootstrap();
        bootstrapRecipes();
    }, []);

    return (
        <Routes>
            <Route path='/' element={<MainLayout/>}>
                <Route path="" element={<Dashboard/>}/>
                <Route path="recipe/form" element={<RecipeFormPage/>}/>
                <Route path="recipe/form/:id" element={<RecipeFormPage/>}/>
                <Route path="/userEdit" element={<ProfileEditForm/>}/>
                <Route path="/userProfile" element={<ProfilePage/>}/>
                <Route path="/favorite-recipes" element={<FavoriteRecipes/>}/>
                <Route path="/recipes" element={<RecipeList/>}/>
                <Route path="/recipe/:slug" element={<RecipeDetail/>}/>
                <Route path="/meal-planner" element={<MealPlanner/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
            </Route>

            <Route path="/sign-in" element={<LoginPage/>}/>
            <Route path="/sign-up" element={<LoginPage/>}/>
            <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>

            <Route path="/test-recipe/:id" element={<TestEditor/>}/>
        </Routes>
    )
}

export default App;
