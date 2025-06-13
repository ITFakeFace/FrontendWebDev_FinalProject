import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom"

const SideBarItemClick = ({ icon, label, onClick }) => {
  const navigate = useNavigate();
  return (
    <div>
      <Button className="w-full flex flex-row" onClick={onClick()}>
        <span className="text-xl">{icon}</span>
        <span className="ml-5">{label}</span>
      </Button>
    </div>
  );
}

export default SideBarItemClick;