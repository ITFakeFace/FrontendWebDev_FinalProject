import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ReciassistLogoFitNoText from '../assets/logo/Reciassist_Logo_Fit_NoText.png';
import ReciassistLogoFit from '../assets/logo/Reciassist_Logo_Fit.png';
import Anonymous from '../assets/user/avatars/Anonymous.png';
import Ava1 from '../assets/user/avatars/ava1.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignIn, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { useUserStore } from "../context/AuthContext";
import SideBarItemUrl from "./components/SideBarItemUrl";
import SideBarItemClick from "./components/SideBarItemClick";
import ThemeModeButton from "./components/ThemeModeButton";
import './MainLayout.scss';

const MainLayout = () => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, setUser, logout } = useUserStore();

  // Kiểm tra đăng nhập
  const checkLogged = () => {
    const session = localStorage.getItem("loggedUser");
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
        setUser(parsed.user);
      } else {
        logout();
      }
    }
  };

  // Áp dụng dark mode cho toàn app (html tag)
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    checkLogged();
  }, []);

  const leftSidebarHeaderTemplate = () => (
    <div className="flex flex-row items-center gap-3 justify-between w-full">
      <img className="w-15" src={ReciassistLogoFit} alt="Reciassist Logo" />
      <Button onClick={() => setShowLeftSidebar(false)} className="border-2 p-2 rounded-xl">
        <i className="pi pi-times text-xl text-gray-900 dark:text-gray-300" />
      </Button>
    </div>
  );

  const rightSidebarHeaderTemplate = () => (
    <div className="flex flex-row items-center gap-3 justify-between w-full">
      <div className="text-2xl font-semibold text-gray-900 dark:text-gray-300">{user ? user.username : "Anonymous"}</div>
      <Button onClick={() => setShowRightSidebar(false)} className="border-2 p-2 rounded-xl">
        <i className="pi pi-times text-xl text-gray-900 dark:text-gray-300" />
      </Button>
    </div>
  );

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* Left Sidebar */}
      <Sidebar visible={showLeftSidebar} onHide={() => setShowLeftSidebar(false)} position="left"
        className="rounded-r-2xl border-t-2 border-r-2 border-b-2 p-5 dark:bg-gray-800 dark:border-gray-600"
        header={leftSidebarHeaderTemplate}
        showCloseIcon={false}
      >
        <div className="mt-10 flex flex-col gap-y-10">]
          <SideBarItemUrl icon={<FontAwesomeIcon icon={faHome} />} label="Homepage" url="/" />
        </div>
      </Sidebar>

      {/* Right Sidebar */}
      <Sidebar visible={showRightSidebar} onHide={() => setShowRightSidebar(false)} position="right"
        className="rounded-l-2xl border-t-2 border-l-2 border-b-2 p-5 dark:bg-gray-800 dark:border-gray-600"
        header={rightSidebarHeaderTemplate}
        showCloseIcon={false}
      >
        <div className="mt-10">
          {user ? (
            <div className="flex flex-col gap-y-10">
              <SideBarItemUrl icon={<FontAwesomeIcon icon={faUser} />} label="Profile" url="/profile" />
              <SideBarItemClick icon={<FontAwesomeIcon icon={faSignOut} />} label="Sign Out" onClick={logout} />
            </div>
          ) : (
            <div className="flex flex-col gap-y-5">
              <SideBarItemUrl icon={<FontAwesomeIcon icon={faSignIn} />} label="Sign In" url="/sign-in" />
            </div>
          )}
        </div>
      </Sidebar>

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-300 dark:border-gray-700 p-3 flex flex-row justify-between items-center">
          <div className="left-box flex flex-row items-center gap-5">
            <Button onClick={() => setShowLeftSidebar(true)} className="pt-unstyled border-2 p-2 rounded-xl">
              <i className="pi pi-bars text-xl" />
            </Button>
            <Button className="flex flex-row items-center gap-3 pt-unstyled">
              <img className="h-10" src={ReciassistLogoFitNoText} alt="Reciassist Logo" />
              <span className="text-2xl font-semibold">Reciassist</span>
            </Button>
          </div>

          <div className="right-box flex flex-row items-center gap-3">
            <ThemeModeButton mode={isDarkMode} onClick={() => setIsDarkMode(!isDarkMode)} />
            <Button
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className="pt-unstyled w-12 h-12 border-2 p-0 rounded-full overflow-hidden flex items-center justify-center
                dark:border-gray-300 border-gray-900"
            >
              <img src={user ? Ava1 : Anonymous} className="bg-white w-full h-full object-cover rounded-full" alt="Avatar" />
            </Button>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 mx-15 my-5">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white p-4 dark:bg-gray-900 dark:text-gray-300">
          Footer
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
