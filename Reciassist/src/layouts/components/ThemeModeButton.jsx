import { Button } from "primereact/button"

const ThemeModeButton = ({ mode, onClick }) => {
  if (mode === true)
    return <Button className="bg-gray-900 border-2 border-gray-300 text-gray-300 p-2 rounded-xl w-9 h-9 flex items-center justify-center" onClick={onClick}><i className="pi pi-moon text-xl"></i></Button>
  else
    return <Button className="border-2 border-gray-900 text-gray-900 p-2 rounded-xl w-9 h-9 flex items-center justify-center" onClick={onClick}><i className="pi pi-sun text-xl"></i></Button>
}

export default ThemeModeButton;