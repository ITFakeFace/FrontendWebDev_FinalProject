import {Button} from "primereact/button";
import {useNavigate} from "react-router-dom"

const SideBarItemUrl = ({icon, label, url}) => {
    const navigate = useNavigate();
    return (
        <div className="w-full">
            <Button
                onClick={() => navigate(url)}
                className="w-full flex items-center gap-4 px-4 py-2 rounded-lg
                            transition-all transition-400 ease-in-out text-gray-900 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-800"
                unstyled={true}
            >
                <span className="text-xl">{icon}</span>
                <span className="text-base font-medium">{label}</span>
            </Button>
        </div>
    );
}

export default SideBarItemUrl;