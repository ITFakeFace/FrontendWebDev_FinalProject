import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom"

const SideBarItemUrl = ({ icon, label, url }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <Button
        onClick={() => navigate(url)}
        className="pt-unstyled w-full flex items-center gap-4 px-4 py-2 rounded-lg transition-all"
      >
        <span className="text-xl text-gray-900 dark:text-gray-300">{icon}</span>
        <span className="text-base font-medium text-gray-900 dark:text-gray-300">{label}</span>
      </Button>
    </div>
  );
}

export default SideBarItemUrl;