import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom"

const SideBarItemUrl = ({ icon, label, url }) => {
  const navigate = useNavigate();
  return (
    <div>
      <Button className="w-full flex flex-row" onClick={() => navigate(url)}>
        <span className="text-xl">{icon}</span>
        <span className="ml-5">{label}</span>
      </Button>
    </div>
  );
}

export default SideBarItemUrl;