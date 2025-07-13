import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat, Utensils, GripVertical, Edit3, Check, ChevronUp, ChevronDown } from 'lucide-react';
import {Chart} from 'primereact/chart';
import recipes from '../../services/datas/recipies.json';
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
    "flan-cake": SpaghettiImg,
    "fried-rice": ChickenImg,
    "vietnamese-spring-rolls": VegetableSFryImg,
    "pho-bo": GrillSalmonImg,
    "grilled-pork-with-broken-rice": ChocoCake,
    "beef-tacos": BeefTacos,
};

const RecipeDetail = () => {
    const user = JSON.parse(localStorage.getItem('loggedUser'));
    const isAuthenticated = !!user;

    const {slug} = useParams();
    const navigate = useNavigate();

    // Fix: Add null check for recipe.name before calling toLowerCase()
    const recipe = recipes.find(
        (r) => {
            if (!r || !r.name || typeof r.name !== 'string') {
                return false;
            }
            return r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === slug;
        }
    );

    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState('ingredients');
    const [isEditing, setIsEditing] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);

    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(0);

    const [currentRecipe, setCurrentRecipe] = useState(recipe || null);
    const [savedChanges, setSavedChanges] = useState({});

    useEffect(() => {
        if (recipe) {
            try {
                const storageKey = `recipe_${recipe.id}_instructions`;
                const savedInstructions = localStorage.getItem(storageKey);
                if (savedInstructions) {
                    const parsedInstructions = JSON.parse(savedInstructions);
                    setCurrentRecipe({
                        ...recipe,
                        instructions: parsedInstructions
                    });
                } else {
                    setCurrentRecipe(recipe);
                }
            } catch (error) {
                console.error('Failed to load from localStorage:', error);
                setCurrentRecipe(recipe);
            }
        }
    }, [recipe]);

    const displayRecipe = currentRecipe || recipe;

    if (!displayRecipe) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="flex items-center justify-center min-h-screen">
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
            </div>
        );
    }

    // Fix: Add null check for displayRecipe.name
    const recipeSlug = displayRecipe.name && typeof displayRecipe.name === 'string'
        ? displayRecipe.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        : 'unknown-recipe';

    const imageUrl = imageMap[recipeSlug] || displayRecipe.image || 'https://via.placeholder.com/600x400?text=No+Image';

    // Calculate average rating from ratings array
    const averageRating = displayRecipe.ratings && displayRecipe.ratings.length > 0
        ? displayRecipe.ratings.reduce((sum, r) => sum + r.rating, 0) / displayRecipe.ratings.length
        : 0;

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

    const handleSubmitReview = () => {
        if (!displayRecipe || !newComment.trim() || newRating === 0) return;

        const newReview = {
            id: Date.now(),
            userId: user.id,
            username: user.username,
            comment: newComment.trim(),
            rating: newRating,
            timestamp: new Date().toISOString()
        };

        const updatedRecipe = {
            ...displayRecipe,
            ratings: [...(displayRecipe.ratings || []), newReview],
            comments: [...(displayRecipe.comments || []), newReview]
        };

        setCurrentRecipe(updatedRecipe);

        try {
            const storageKey = `recipe_${displayRecipe.id}_instructions`;
            localStorage.setItem(storageKey, JSON.stringify(updatedRecipe.instructions || []));
            localStorage.setItem(`recipe_${displayRecipe.id}_comments`, JSON.stringify(updatedRecipe.comments));
            localStorage.setItem(`recipe_${displayRecipe.id}_ratings`, JSON.stringify(updatedRecipe.ratings));
        } catch (error) {
            console.error('Failed to save review to localStorage:', error);
        }

        setNewRating(0);
        setNewComment('');
        setShowReviewForm(false);
    };

    useEffect(() => {
        if (recipe) {
            try {
                const instructionsKey = `recipe_${recipe.id}_instructions`;
                const commentsKey = `recipe_${recipe.id}_comments`;

                const savedInstructions = localStorage.getItem(instructionsKey);
                const savedComments = localStorage.getItem(commentsKey);

                const parsedInstructions = savedInstructions ? JSON.parse(savedInstructions) : recipe.instructions;
                const parsedComments = savedComments ? JSON.parse(savedComments) : recipe.comments || [];

                setCurrentRecipe({
                    ...recipe,
                    instructions: parsedInstructions,
                    comments: parsedComments,
                });
            } catch (error) {
                console.error('Failed to load from localStorage:', error);
                setCurrentRecipe(recipe);
            }
        }
    }, [recipe]);

    // Transform ingredients to display format
    const formattedIngredients = displayRecipe.ingredients?.map(ingredient => 
        `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`
    ) || [];

    // Transform instructions to string array for reordering
    const instructionTexts = displayRecipe.instructions?.map(instruction => 
        instruction.description.replace(/<[^>]*>/g, '') // Remove HTML tags
    ) || [];

    const moveInstruction = (fromIndex, toIndex) => {
        if (!instructionTexts) return;

        const newInstructions = [...instructionTexts];
        const [movedInstruction] = newInstructions.splice(fromIndex, 1);
        newInstructions.splice(toIndex, 0, movedInstruction);

        const updatedRecipe = {
            ...displayRecipe,
            instructions: newInstructions.map((text, index) => ({
                id: index + 1,
                name: null,
                description: `<p>${text}</p>`
            }))
        };

        setCurrentRecipe(updatedRecipe);

        // Save to localStorage
        try {
            const storageKey = `recipe_${displayRecipe.id}_instructions`;
            localStorage.setItem(storageKey, JSON.stringify(updatedRecipe.instructions));
            console.log('Instructions saved to localStorage');
        } catch (error) {
            console.error('Failed to save instructions to localStorage:', error);
        }

        setSavedChanges(prev => ({
            ...prev,
            [displayRecipe.id]: updatedRecipe
        }));
    };

    const moveUp = (index) => {
        if (index > 0) {
            moveInstruction(index, index - 1);
        }
    };

    const moveDown = (index) => {
        if (index < instructionTexts.length - 1) {
            moveInstruction(index, index + 1);
        }
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== dropIndex) {
            moveInstruction(draggedIndex, dropIndex);
        }
        setDraggedIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    // Get difficulty level text
    const getDifficultyText = (difficulty) => {
        switch(difficulty) {
            case 1: return 'Easy';
            case 2: return 'Medium';
            case 3: return 'Hard';
            default: return 'N/A';
        }
    };

    // Format cooking time
    const formatCookingTime = (cookingTime) => {
        if (!cookingTime) return 'N/A';
        // If it's a date string, extract time info or use a default
        // For now, using a placeholder since the format isn't clear
        return '45'; // Default cooking time in minutes
    };

    useEffect(() => {
        // Chart setup with nutrition data
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: ['Protein', 'Carbohydrates', 'Fat'],
            datasets: [
                {
                    data: [
                        displayRecipe.nutrition?.protein || 0,
                        displayRecipe.nutrition?.carbohydrates || 0,
                        displayRecipe.nutrition?.fat || 0
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

    // Format comments with usernames (you might need to map userId to username)
    const formattedComments = displayRecipe.comments?.map(comment => ({
        ...comment,
        username: `User ${comment.userId}`, // Placeholder - you might want to fetch actual usernames
        text: comment.comment,
        timestamp: comment.timestamp
    })) || [];

    const instructionsTabContent = (
        <div className="space-y-6">
            {/* Add edit button */}
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Cooking Instructions</h3>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                    {isEditing ? 'Done Editing' : 'Edit Order'}
                </button>
            </div>

            {isEditing && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 text-sm">
                        💡 <strong>Editing Mode:</strong> Use the arrow buttons or drag the grip handle to reorder steps
                    </p>
                </div>
            )}

            <ol className="space-y-4">
                {instructionTexts.map((step, idx) => (
                    <li
                        key={idx}
                        className={`flex items-start gap-4 p-5 bg-gradient-to-r from-orange-50 to-white border-l-4 border-orange-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${
                            draggedIndex === idx ? 'opacity-50' : ''
                        }`}
                        draggable={isEditing}
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, idx)}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-full font-bold shadow">
                                {idx + 1}
                            </div>
                        </div>
                        <div className="flex-1 text-gray-700 leading-relaxed text-base">
                            {step}
                        </div>
                        {isEditing && (
                            <div className="flex flex-col gap-2 ml-4">
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => moveUp(idx)}
                                        disabled={idx === 0}
                                        className="p-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        title="Move up"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => moveDown(idx)}
                                        disabled={idx === instructionTexts.length - 1}
                                        className="p-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        title="Move down"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                                <div 
                                    className="p-1 rounded bg-gray-200 hover:bg-gray-300 cursor-move transition-colors"
                                    title="Drag to reorder"
                                >
                                    <GripVertical className="w-4 h-4" />
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ol>

            {isEditing && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="text-green-800 font-semibold mb-2">Current Order:</h3>
                    <ol className="text-green-700 text-sm space-y-1">
                        {instructionTexts.map((step, idx) => (
                            <li key={idx}>
                                <span className="font-medium">{idx + 1}.</span> {step.substring(0, 50)}...
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Hero Section */}
            <div className="relative h-[35vh] min-h-[300px] max-h-[450px] overflow-hidden max-w-4xl mx-auto rounded-2xl">
                <img 
                    src={imageUrl}
                    alt={displayRecipe.name || 'Recipe'}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
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
                        <h1 className="text-4xl font-bold mb-3 drop-shadow-lg">{displayRecipe.name || 'Unknown Recipe'}</h1>
                        <div className="flex items-center gap-4">
                            <StarRating rating={Math.round(safeAverageRating)} size="w-5 h-5" />
                            <span className="text-lg font-semibold">
                                {safeAverageRating > 0 ? `(${safeAverageRating.toFixed(1)})` : 'No ratings yet'}
                            </span>
                        </div>
                        {displayRecipe.ratings && displayRecipe.ratings.length > 0 && (
                            <div className="flex flex-col gap-2 mt-4 max-w-md">
                                {ratingBreakdown.map((count, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        <div className="w-12 text-xs">{5 - idx} ★</div>
                                        <div className="flex-1 bg-gray-200/30 h-2 rounded-full overflow-hidden min-w-[60px]">
                                            <div
                                                className="bg-yellow-400 h-full transition-all duration-500"
                                                style={{ width: `${displayRecipe.ratings.length > 0 ? (count / displayRecipe.ratings.length) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs w-6 text-right">{count}</div>
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
                    <InfoCard 
                        icon={ChefHat} 
                        label="Category" 
                        value={displayRecipe.categories?.[0] || 'N/A'} 
                        delay={100} 
                        isLoaded={isLoaded} 
                    />
                    <InfoCard 
                        icon={Utensils} 
                        label="Level" 
                        value={getDifficultyText(displayRecipe.difficulty)} 
                        delay={200} 
                        isLoaded={isLoaded} 
                    />
                    <InfoCard 
                        icon={Clock} 
                        label="Time" 
                        value={`${recipe.cookingDuration} min`} 
                        delay={300} 
                        isLoaded={isLoaded} 
                    />
                    <InfoCard 
                        icon={Users} 
                        label="Servings" 
                        value={displayRecipe.servings || 'N/A'} 
                        delay={400} 
                        isLoaded={isLoaded} 
                    />
                </div>

                {/* Description Card */}
                <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8 transform transition-all duration-700 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`} style={{ transitionDelay: '500ms' }}>
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        About This Recipe
                    </h2>
                    <div 
                        className="text-gray-700 leading-relaxed text-lg"
                        dangerouslySetInnerHTML={{ __html: displayRecipe.description || 'No description available.' }}
                    />
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
                                {formattedIngredients.map((ingredient, idx) => (
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

                        {activeTab === 'instructions' && instructionsTabContent}

                        {activeTab === 'nutrition' && (
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                        <span className="font-semibold text-gray-700">Calories</span>
                                        <span className="text-2xl font-bold text-gray-800">{displayRecipe.nutrition?.calories || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                        <span className="font-semibold text-gray-700">Protein</span>
                                        <span className="text-xl font-bold text-blue-600">{displayRecipe.nutrition?.protein || 0}g</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                                        <span className="font-semibold text-gray-700">Carbs</span>
                                        <span className="text-xl font-bold text-yellow-600">{displayRecipe.nutrition?.carbohydrates || 0}g</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                                        <span className="font-semibold text-gray-700">Fat</span>
                                        <span className="text-xl font-bold text-green-600">{displayRecipe.nutrition?.fat || 0}g</span>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="relative w-64 h-64">
                                        {chartData.datasets && chartOptions && (
                                            <div className="w-full h-full">
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
                                                        {displayRecipe.nutrition?.calories || 'N/A'} Calories
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
                                    rating={Math.round(safeAverageRating)}
                                    size="w-6 h-6"
                                />
                                <p className="text-lg font-bold text-gray-800">
                                    {safeAverageRating.toFixed(1)} out of 5
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
                        {formattedComments.map((comment, idx) => {
                            const userRating = getRatingByUserId(comment.userId);
                            
                            return (
                                <div 
                                    key={comment.id || idx}
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
                    {(!formattedComments || formattedComments.length === 0) && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">💬</div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No reviews yet</h3>
                            <p className="text-gray-500">Be the first to share your experience with this recipe!</p>
                        </div>
                    )}
                    <div className="mt-8 text-center">
                        {!isAuthenticated ? (
                            <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-6 rounded-lg max-w-xl mx-auto">
                                <p className="text-lg font-semibold mb-2">You must be signed in to leave a review.</p>
                                <button
                                    onClick={() => navigate('/sign-in')}
                                    className="mt-2 px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-all"
                                >
                                    Sign In
                                </button>
                            </div>
                        ) : showReviewForm ? (
                            <div className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto space-y-4">
                                <h3 className="text-xl font-bold text-gray-800">Write a Review</h3>

                                <div className="flex justify-center items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setNewRating(star)}
                                            className={`text-2xl ${
                                                newRating >= star ? 'text-yellow-500' : 'text-gray-300'
                                            } hover:scale-110 transition-transform`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    rows="4"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Share your thoughts..."
                                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-400"
                                ></textarea>

                                <button
                                    onClick={handleSubmitReview}
                                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-red-600 transition-all font-semibold"
                                    disabled={newRating === 0 || !newComment.trim()}
                                >
                                    Submit Review
                                </button>
                            </div>
                        ) : (
                            <button
                                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                onClick={() => setShowReviewForm(true)}
                            >
                                Write a Review
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;