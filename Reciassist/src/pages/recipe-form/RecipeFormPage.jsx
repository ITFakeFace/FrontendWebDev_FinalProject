import { useParams } from "react-router-dom";
import { useUserStore } from "../../context/AuthContext";
import { Panel } from "primereact/panel";
const RecipeFormPage = () => {
  const { id } = useParams();
  const { user } = useUserStore();

  return (
    <div className="container">
      <div className="flex w-full border-0">
        <Panel header="Recipe Form" toggleable className="w-full border-2 p-5 ">
          <div>This is Panel</div>
        </Panel>
      </div>
    </div>
  )
}

export default RecipeFormPage;