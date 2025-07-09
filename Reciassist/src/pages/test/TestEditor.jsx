import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getFormattedRecipeId} from "../../services/recipeService.js";

export const TestEditor = () => {
    const {id} = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!id) return;
            const raw = await getFormattedRecipeId(id);
            setRecipe(raw);
        };
        fetchRecipe();
    }, [id]);

    if (!recipe) return <div>Loading...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans space-y-6">
            <h1 className="text-3xl font-bold">{recipe.name}</h1>

            {recipe.image && (
                <img src={recipe.image} alt={recipe.name} className="rounded-xl w-full max-h-[400px] object-cover"/>
            )}

            <div className="text-gray-700" dangerouslySetInnerHTML={{__html: recipe.description}}/>

            <section>
                <h2 className="text-xl font-semibold mt-6">Ingredients</h2>
                <ul className="list-disc ml-5 mt-2">
                    {recipe.ingredients.map((item) => (
                        <li key={item.id}>
                            {item.quantity} {item.unit} {item.name}
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold mt-6">Instructions</h2>
                <ol className="list-decimal ml-5 mt-2 space-y-2">
                    {recipe.instructions.map((step) => (
                        <li key={step.id} dangerouslySetInnerHTML={{__html: step.description}}/>
                    ))}
                </ol>
            </section>

            <section>
                <h2 className="text-xl font-semibold mt-6">Nutrition Facts</h2>
                <ul className="list-disc ml-5 mt-2">
                    <li>Calories: {recipe.nutrition.calories} kcal</li>
                    <li>Fat: {recipe.nutrition.fat} g</li>
                    <li>Carbohydrates: {recipe.nutrition.carbohydrates} g</li>
                    <li>Protein: {recipe.nutrition.protein} g</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold mt-6">Categories</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                    {recipe.categories.map((cat, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {cat}
                        </span>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mt-6">Meta</h2>
                <ul className="list-disc ml-5 mt-2">
                    <li>Servings: {recipe.servings}</li>
                    <li>Difficulty: {recipe.difficulty}</li>
                    <li>Cooking Time: {new Date(recipe.cookingTime).toLocaleString()}</li>
                    <li>Access Count: {recipe.accessTime}</li>
                    <li>Created By: User #{recipe.createBy}</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold mt-6">Ratings ({recipe.ratings.length})</h2>
                <ul className="list-disc ml-5 mt-2">
                    {recipe.ratings.map((r, idx) => (
                        <li key={idx}>User #{r.userId}: {r.rating}⭐</li>
                    ))}
                </ul>
                <p className="mt-2">Average Rating Score: {recipe.ratingScore}</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mt-6">Comments</h2>
                <ul className="space-y-4 mt-2">
                    {recipe.comments.map((c) => (
                        <li key={c.id} className="border-l-4 pl-4 border-gray-300">
                            <p><strong>User #{c.userId}</strong> ({new Date(c.timestamp).toLocaleString()})</p>
                            <p>{c.comment}</p>
                            {c.replyTo && <p className="text-sm text-gray-500">↳ Reply to comment #{c.replyTo}</p>}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};
