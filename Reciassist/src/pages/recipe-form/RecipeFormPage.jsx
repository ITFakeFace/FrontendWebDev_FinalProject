import { useParams } from "react-router-dom";
import { useUserStore } from "../../context/AuthContext";
import { Panel } from "primereact/panel";
import { InputText } from "primereact/inputtext";
import { useRef } from "react";
import { Button } from "primereact/button";
const RecipeFormPage = () => {
  const { user } = useUserStore();

  let emptyRecipe = {
    id: null,
    name: "",
    description: "",
    image: null,
    ingredients: [],
    cookingTime: null,
    categories: [],
    servings: null,
    difficulty: null,
    status: 1,
    createBy: null,
    instructions: [],
    nutrition: {
      calories: null,
      fat: null,
      carbohydrates: null,
      protein: null,
    },
    ratings: [],
    comments: [],
  };

  let emptyIngredient = {
    name: "",
    quantity: null,
    unit: "",
  };

  let emptyInstruction = {
    step: null,
    description: "",
  };

  let categories = [
    // meal time
    "Breakfast", "Brunch", "Lunch", "Dinner", "Supper", "Snack",
    // food type
    "Savory", "Sweet", "Soup", "Drink", "Dessert", "Fried", "Grilled", "Steamed", "Raw", "Baked", "Vegetarian", "Vegan", "Spicy", "Cold", "Hot",
  ];

  const { id } = useParams();
  const [recipe, setRecipe] = useState(emptyRecipe);
  const basicInfoPanelRef = useRef(null);

  const basicInfoPanelHeader = (option) => {
    console.log("BasicInfor: " + basicInfoPanelRef.current?.collapsed);
    return (
      <div className="bg-gray-600 flex flex-row justify-between rounded-full">
        <div className="left-box py-3 px-5 flex flex-row gap-5">
          <span className="text-white text-xl font-semibold">Basic Information</span>
        </div>
        <div className="right-box py-3 px-5 flex flex-row gap-5">
          <span className="text-white flex items-center">
            {option.togglerElement}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex w-full border-0">
        <Panel ref={basicInfoPanelRef} headerTemplate={basicInfoPanelHeader} toggleable className="w-full p-5 border-2">
          <div className="border-2 border-gray-600 mx-6 px-5 py-3 rounded-b-2xl">
            <div className="flex">
              <div className="flex-grow-3">Name:</div>
              <div className="flex-grow-7">
                <InputText value={recipe.name} />
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}

export default RecipeFormPage;