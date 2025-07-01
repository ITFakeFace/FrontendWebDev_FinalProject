import './App.css'
import {Route, Routes} from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/authentication/LoginPage'
import RecipeFormPage from './pages/recipe-form/RecipeFormPage';
import {useUserStore} from './context/AuthContext';
import {useEffect} from 'react';
import {TestEditor} from './pages/test/TestEditor';
import {bootstrapRecipes} from "./services/recipeService.js";
import ProfilePage from './ProfilePages/ProfilePage'
import ProfileEditForm from './ProfilePages/ProfileEditForm'

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
                <Route path="recipe" element={<RecipeFormPage/>}/>
                <Route path="recipe/:id" element={<RecipeFormPage/>}/>
        <Route path="/userEdit" element={<ProfileEditForm />} />
        <Route path="/userProfile" element={<ProfilePage />} />
            </Route>

            <Route path="/sign-in" element={<LoginPage/>}/>
            <Route path="/sign-up" element={<LoginPage/>}/>

            <Route path="/test/editor/:content" element={<TestEditor/>}/>
        </Routes>
    )
}

export default App
