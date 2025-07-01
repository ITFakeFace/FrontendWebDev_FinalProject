import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Chart} from 'primereact/chart';
import {Rating} from 'primereact/rating';
import {Fieldset} from 'primereact/fieldset';
import '../pages/RecipeDetails.css'; // Assuming you have a CSS file for styling
import recipes from '../services/data/recipes.json';
import SpaghettiImg from '../assets/food/images/spaghetti-bolognese.jpg';
import ChickenImg from '../assets/food/images/chicken-curry.jpg';
import VegetableSFryImg from '../assets/food/images/vegetable-stir-fry.png';
import GrillSalmonImg from '../assets/food/images/grilled-salmon.jpg';
import ChocoCake from '../assets/food/images/chocolate-cake.jpg';
import BeefTacos from '../assets/food/images/beef-tacos.jpg';

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

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: ['Protein', 'Carbohydrates', 'Fats'],
            datasets: [
                {
                    data: [
                        recipe.nutritions.protein,
                        recipe.nutritions.fat,
                        recipe.nutritions.carbs
                    ],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--green-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--green-400')
                    ]
                }
            ]
        };
        const options = {
            cutout: '60%'
        };

        setChartData(data);
        setChartOptions(options);
    }, []);


    if (!recipe) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Recipe not found</h2>
                <button
                    onClick={() => navigate('/')}
                    className="text-blue-600 hover:underline"
                >
                    Go back to recipes
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="text-blue-500 hover:underline mb-4 block"
                style={{cursor: 'pointer'}}
            >
                <i className="pi pi-angle-left" style={{fontSize: '1.075rem'}}>Back</i>
            </button>
            <img
                src={imageMap[slug]}
                alt={recipe.title}
                className="w-full h-60 object-cover rounded-md mb-4"
            />
            <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
            <div className="flex items-center gap-2 mb-4">
                <Rating
                    value={recipe.rating}
                    readOnly
                    cancel={false}
                    stars={5}
                    pt={{onIcon: {className: 'text-yellow-500'}}}
                />
                <span className="text-sm text-gray-600">({recipe.rating.toFixed(1)})</span>
            </div>
            <div className="card">
                <Fieldset legend="Description" className="mb-6">
                    <p className="m-0">
                        {recipe.description}
                    </p>
                </Fieldset>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-6">
                <div><strong>Category:</strong> {recipe.category}</div>
                <div><strong>Level:</strong> {recipe.level}</div>
                <div><strong>Time:</strong> {recipe.cookingTime} min</div>
                <div><strong>Servings:</strong> {recipe.servings}</div>
            </div>

            <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
            <ul className="list-disc list-inside mb-4 text-gray-700 text-sm">
                {recipe.ingredients.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>

            <h2 className="text-xl font-semibold mb-2">Instructions</h2>
            <p className="text-gray-700 text-sm mb-6">{recipe.instructions}</p>

            <h2 className="text-xl font-semibold mb-2">Nutritional Information</h2>
            <div className="w-full md:w-1/2 mx-auto">
                <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full md:w-30rem"/>
                <p className="text-center text-sm text-gray-600 mt-2">
                    Total Calories: <strong>{recipe.nutritionalInfo.calories} kcal</strong>
                </p>
            </div>
            <h2 className="text-xl font-semibold mb-4 mt-10">Comments</h2>
            <div className="space-y-4">
                {recipe.comments.length === 0 ? (
                    <p className="text-sm text-gray-500">No comments yet.</p>
                ) : (
                    recipe.comments.map((comment, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{comment.username}</p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(comment.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                {typeof comment.rating === 'number' && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <Rating
                                            value={comment.rating}
                                            readOnly
                                            cancel={false}
                                            stars={5}
                                            icon="pi pi-star-fill"
                                            onIconProps={{className: 'text-yellow-500 text-base'}}
                                            className="text-sm"
                                        />
                                        <span className="text-sm text-gray-600">({comment.rating})</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-700 text-sm">{comment.text}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecipeDetail;
