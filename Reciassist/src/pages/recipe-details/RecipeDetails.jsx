import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { ArrowLeft, Clock, Users, Star, ChefHat, Utensils } from 'lucide-react';
import {Chart} from 'primereact/chart';
import {Rating} from 'primereact/rating';
import {Fieldset} from 'primereact/fieldset';
import recipes from '../../services/data/recipes.json';
import SpaghettiImg from '../../assets/food/images/spaghetti-bolognese.jpg';
import ChickenImg from '../../assets/food/images/chicken-curry.jpg';
import VegetableSFryImg from '../../assets/food/images/vegetable-stir-fry.png';
import GrillSalmonImg from '../../assets/food/images/grilled-salmon.jpg';
import ChocoCake from '../../assets/food/images/chocolate-cake.jpg';
import BeefTacos from '../../assets/food/images/beef-tacos.jpg';
import StarRating from './components/StarRating';
import InfoCard from './components/InfoCard';
import TabButton from './components/TabButton';


const imageMap = {
    "spaghetti-bolognese": SpaghettiImg,
    "chicken-curry": ChickenImg,
    "vegetable-stir-fry": VegetableSFryImg,
    "grilled-salmon": GrillSalmonImg,
    "chocolate-cake": ChocoCake,
    "beef-tacos": BeefTacos,
};

const RecipeDetail = () => {
    const {slug} = useParams();
    const navigate = useNavigate();

    const recipe = recipes.find(
        (r) =>
            r.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === slug
    );

    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState('ingredients');

    const displayRecipe = recipe || fallbackRecipe;

    const recipeSlug = displayRecipe.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const imageUrl = imageMap[recipeSlug] || 'https://via.placeholder.com/600x400?text=No+Image';

    const averageRating = displayRecipe.ratings && displayRecipe.ratings.length > 0
    ? displayRecipe.ratings.reduce((sum, r) => sum + r.rating, 0) / displayRecipe.ratings.length
    : 0;

    // Ensure averageRating is always a number
    const safeAverageRating = Number(averageRating) || 0;

    const ratingBreakdown = [0, 0, 0, 0, 0]; // [5-star, 4-star, 3-star, 2-star, 1-star]
    if (displayRecipe.ratings && displayRecipe.ratings.length > 0) {
        displayRecipe.ratings.forEach(rating => {
        if (rating.rating >= 1 && rating.rating <= 5) {
            ratingBreakdown[5 - rating.rating]++; // Index 0 = 5 stars, Index 4 = 1 star
        }
        });
    }

    const getRatingByUserId = (userId) => {
        const userRating = displayRecipe.ratings?.find(rating => rating.userId === userId);
        return userRating ? userRating.rating : null;
    };

    useEffect(() => {
        // Your existing chart setup logic with modern styling
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: ['Protein', 'Carbohydrates', 'Fats'],
            datasets: [
                {
                    data: [
                        displayRecipe.nutritionalInfo.protein,
                        displayRecipe.nutritionalInfo.fat,
                        displayRecipe.nutritionalInfo.carbs
                    ],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500') || '#3B82F6',
                        documentStyle.getPropertyValue('--yellow-500') || '#EAB308',
                        documentStyle.getPropertyValue('--green-500') || '#10B981'
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400') || '#60A5FA',
                        documentStyle.getPropertyValue('--yellow-400') || '#FDE047',
                        documentStyle.getPropertyValue('--green-400') || '#34D399'
                    ],
                    borderWidth: 0
                }
            ]
        };
        
        const options = {
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                }
            },
            maintainAspectRatio: false,
            responsive: true
        };

        setChartData(data);
        setChartOptions(options);
        
        setTimeout(() => {
            setIsLoaded(true);
        }, 300);
    }, [displayRecipe, slug]);

    // Handle recipe not found
    if (!recipe && !fallbackRecipe) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Recipe not found</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                        Go back to recipes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Hero Section */}
            <div className="relative h-96 overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-1000"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 z-10 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all duration-300 group"
                >
                    <ArrowLeft className="w-5 h-5 text-white group-hover:transform group-hover:-translate-x-1 transition-transform" />
                </button>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className={`transform transition-all duration-1000 ${
                        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                        <h1 className="text-4xl font-bold mb-3 drop-shadow-lg">{displayRecipe.title}</h1>
                        <div className="flex items-center gap-4">
                            <StarRating rating={Math.round(safeAverageRating)} size="w-5 h-5" />
                            <span className="text-lg font-semibold">
                                {safeAverageRating > 0 ? `(${safeAverageRating.toFixed(1)})` : 'No ratings yet'}
                            </span>
                        </div>
                        {displayRecipe.ratings && displayRecipe.ratings.length > 0 && (
                            <div className="space-y-2 mt-4">
                                {ratingBreakdown.map((count, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="text-sm w-14">{5 - idx} ★</div>
                                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-yellow-400 h-full transition-all duration-500"
                                        style={{ width: `${displayRecipe.ratings.length > 0 ? (count / displayRecipe.ratings.length) * 100 : 0}%` }}
                                    ></div>
                                    </div>
                                    <div className="text-sm w-6 text-right">{count}</div>
                                </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 -mt-7 relative z-10">
                {/* Info Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <InfoCard icon={ChefHat} label="Category" value={displayRecipe.category || 'N/A'} delay={100} isLoaded={isLoaded} />
                    <InfoCard icon={Utensils} label="Level" value={displayRecipe.level || 'N/A'} delay={200} isLoaded={isLoaded} />
                    <InfoCard icon={Clock} label="Time" value={`${displayRecipe.cookingTime ?? '??'} min`} delay={300} isLoaded={isLoaded} />
                    <InfoCard icon={Users} label="Servings" value={displayRecipe.servings || 'N/A'} delay={400} isLoaded={isLoaded} />
                </div>
                {/* Description Card */}
                <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8 transform transition-all duration-700 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`} style={{ transitionDelay: '500ms' }}>
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        About This Recipe
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg">{displayRecipe.description}</p>
                </div>

                {/* Tabbed Content */}
                <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transform transition-all duration-700 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`} style={{ transitionDelay: '600ms' }}>
                    {/* Tab Navigation */}
                    <div className="flex flex-wrap gap-2 p-6 border-b border-gray-200">
                        <TabButton 
                            id="ingredients" 
                            label="Ingredients" 
                            isActive={activeTab === 'ingredients'} 
                            onClick={setActiveTab} 
                        />
                        <TabButton 
                            id="instructions" 
                            label="Instructions" 
                            isActive={activeTab === 'instructions'} 
                            onClick={setActiveTab} 
                        />
                        <TabButton 
                            id="nutrition" 
                            label="Nutrition" 
                            isActive={activeTab === 'nutrition'} 
                            onClick={setActiveTab} 
                        />
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 'ingredients' && (
                            <div className="space-y-3">
                                {displayRecipe.ingredients.map((ingredient, idx) => (
                                    <div 
                                        key={idx}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 transform hover:translate-x-2"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
                                        <span className="text-gray-700">{ingredient}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'instructions' && (
                            <div className="space-y-6">
                                {Array.isArray(displayRecipe.instructions) ? (
                                    <ol className="space-y-4">
                                        {displayRecipe.instructions.map((step, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-start gap-4 p-5 bg-gradient-to-r from-orange-50 to-white border-l-4 border-orange-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                                            >
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-full font-bold shadow">
                                                        {idx + 1}
                                                    </div>
                                                </div>
                                                <div className="text-gray-700 leading-relaxed text-base">
                                                    {step}
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                ) : (
                                    <div className="p-6 bg-gradient-to-r from-orange-50 to-white rounded-xl shadow">
                                        <p className="text-gray-700 leading-relaxed text-lg">{displayRecipe.instructions}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'nutrition' && (
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                        <span className="font-semibold text-gray-700">Calories</span>
                                        <span className="text-2xl font-bold text-gray-800">{displayRecipe.nutritionalInfo.calories}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                        <span className="font-semibold text-gray-700">Protein</span>
                                        <span className="text-xl font-bold text-blue-600">{displayRecipe.nutritionalInfo.protein}g</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                                        <span className="font-semibold text-gray-700">Carbs</span>
                                        <span className="text-xl font-bold text-yellow-600">{displayRecipe.nutritionalInfo.carbs}g</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                                        <span className="font-semibold text-gray-700">Fat</span>
                                        <span className="text-xl font-bold text-green-600">{displayRecipe.nutritionalInfo.fat}g</span>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    {/* Your Chart Component Integration */}
                                    <div className="relative w-64 h-64">
                                        {chartData.datasets && chartOptions && (
                                            <div className="w-full h-full">
                                                {/* Replace this div with your Chart component */}
                                                {/* <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full h-full"/> */}
                                                <div className="relative w-64 h-64">
                                                    {chartData.datasets && (
                                                        <Chart
                                                        type="doughnut"
                                                        data={chartData}
                                                        options={chartOptions}
                                                        className="w-full h-full"
                                                        />
                                                    )}
                                                </div>
                                                <div className="text-center mt-4">
                                                    <div className="text-2xl font-bold text-gray-800">
                                                        {displayRecipe.nutritionalInfo.calories} Calories
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Comments Section */}
                <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl mt-8 transform transition-all duration-700 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`} style={{ transitionDelay: '700ms' }}>
                    {displayRecipe.ratings?.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center gap-3">
                            <StarRating
                                rating={
                                displayRecipe.ratings.reduce((sum, r) => sum + r.rating, 0) /
                                displayRecipe.ratings.length
                                }
                                size="w-6 h-6"
                            />
                            <p className="text-lg font-bold text-gray-800">
                                {(
                                displayRecipe.ratings.reduce((sum, r) => sum + r.rating, 0) /
                                displayRecipe.ratings.length
                                ).toFixed(1)}{' '}
                                out of 5
                            </p>
                            <p className="text-sm text-gray-500">
                                ({displayRecipe.ratings.length} ratings)
                            </p>
                            </div>
                        </div>
                        )}
                    <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Reviews & Comments
                    </h2>
                    <div className="space-y-6">
                        {displayRecipe.comments.map((comment, idx) => {
                            const userRating = getRatingByUserId(comment.userId);
                            
                            return (
                                <div 
                                    key={idx}
                                    className="bg-gradient-to-r from-white to-blue-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="font-semibold text-gray-800 text-lg">{comment.username}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(comment.timestamp).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {userRating && (
                                            <div className="flex items-center gap-2">
                                                <StarRating rating={userRating} />
                                                <span className="text-sm font-medium text-gray-600">({userRating})</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                                </div>
                            );
                        })}
                    </div>
                    {(!displayRecipe.comments || displayRecipe.comments.length === 0) && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">💬</div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No reviews yet</h3>
                            <p className="text-gray-500">Be the first to share your experience with this recipe!</p>
                        </div>
                    )}
                    <div className="mt-8 text-center">
                        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Write a Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
