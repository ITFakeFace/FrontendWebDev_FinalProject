import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ReciassistLogoFitNoText from '../assets/logo/Reciassist_Logo_Fit_NoText.png';
import ReciassistLogoFit from '../assets/logo/Reciassist_Logo_Fit.png';
import Anonymous from '../assets/user/avatars/Anonymous.png';
import Ava1 from '../assets/user/avatars/ava1.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignIn, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useUserStore } from "../context/AuthContext";
import SideBarItemUrl from "./components/SideBarItemUrl";
import SideBarItemClick from "./components/SideBarItemClick";

const MainLayout = () => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [logged, setLogged] = useState(false);
  const { user, setUser, logout } = useUserStore();

  const checkLogged = () => {
    const isLogged = localStorage.getItem('logged');
    if (isLogged) {
      setLogged(true);
    }
  }

  useEffect(() => {
    checkLogged();
  }, [])
  const leftSidebarHeaderTemplate = () => {
    return (
      <div className="flex flex-row items-center gap-3 justify-between w-full">
        <img className="w-15" src={ReciassistLogoFit} alt="Reciassist Logo" />
        <Button onClick={() => setShowLeftSidebar(!showLeftSidebar)} className="border-2 p-2 rounded-xl"><i className="pi pi-times text-xl"></i></Button>
      </div>
    )
  }

  const rightSidebarHeaderTemplate = () => {
    return (
      <div className="text-2xl font-semibold">{logged == true && user ? user.username : "Anonymous"}</div>
    )
  }

  return (
    <div>
      {/* Left SideBar: Navbar */}
      <Sidebar visible={showLeftSidebar} onHide={() => setShowLeftSidebar(false)} position="left" className="rounded-r-2xl border-t-2 border-r-2 border-b-2 p-5"
        header={leftSidebarHeaderTemplate}
        showCloseIcon={false}
      >
        <div className="mt-10 flex flex-col gap-y-10">
          <SideBarItemUrl
            icon={<FontAwesomeIcon icon={faHome} />}
            label={"Homepage"}
            url={"/"}
          />
        </div>
      </Sidebar>
      {/* Right SideBar: User Bar */}
      <Sidebar visible={showRightSidebar} onHide={() => setShowRightSidebar(false)} position="right" className="rounded-l-2xl border-t-2 border-l-2 border-b-2 p-5"
        header={rightSidebarHeaderTemplate}
      >
        <div className="mt-10">
          {logged == true ?
            <div className="flex flex-col gap-y-10">
              <Button>Profile</Button>
              <SideBarItemClick
                icon={<FontAwesomeIcon icon={faSignOut} />}
                label={"Sign Out"}
                onClick={logout}
              />
            </div> :
            <div className="flex flex-col gap-y-5">
              <SideBarItemUrl
                icon={<FontAwesomeIcon icon={faSignIn} />}
                label={"Sign In"}
                url={"/sign-in"}
              />
            </div>
          }
        </div>
      </Sidebar>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-black p-3 border-b-1 flex flex-row justify-between items-center">
          <div className="left-box flex flex-row items-center gap-5">
            <Button onClick={() => setShowLeftSidebar(!showLeftSidebar)} className="border-2 p-2 rounded-xl"><i className="pi pi-bars text-xl"></i></Button>
            <Button className="flex flex-row items-center gap-3">
              <img className="h-10" src={ReciassistLogoFitNoText} alt="Reciassist Logo" />
              <span className="text-2xl font-semibold">Reciassist</span>
            </Button>
          </div>
          <div className="right-box flex flex-row items-center gap-5">
            <Button onClick={() => setShowRightSidebar(!showLeftSidebar)} className="overflow-hidden border-2 p-2 rounded-full">
              <img src={logged == true ? Ava1 : Anonymous} className="w-7"></img>
            </Button>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 mx-15 my-5">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white p-4">
          Footer
        </footer>
      </div>
    </div>
  )
}

export default MainLayout;