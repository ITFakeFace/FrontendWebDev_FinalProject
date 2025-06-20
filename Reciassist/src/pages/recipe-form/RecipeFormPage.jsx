import { useParams } from "react-router-dom";
import { useUserStore } from "../../context/AuthContext";

const RecipeFormPage = () => {
  const { id } = useParams();
  const { user } = useUserStore();
  return (
    <></>
  )
}

export default RecipeFormPage;