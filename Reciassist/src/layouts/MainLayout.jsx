import {Button} from "primereact/button";
import {Sidebar} from "primereact/sidebar";
import {useEffect, useRef, useState} from "react";
import {Outlet} from "react-router-dom";
import ReciassistLogoFitNoText from '../assets/logo/Reciassist_Logo_Fit_NoText.png';
import ReciassistLogoFit from '../assets/logo/Reciassist_Logo_Fit.png';
import Anonymous from '../assets/user/avatars/Anonymous.png';
import Ava1 from '../assets/user/avatars/ava1.png';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBowlFood, faHome, faSignIn, faSignOut, faUser, faUtensils} from "@fortawesome/free-solid-svg-icons";
import {useUserStore} from "../context/AuthContext";
import SideBarItemUrl from "./components/SideBarItemUrl";
import SideBarItemClick from "./components/SideBarItemClick";
import ThemeModeButton from "./components/ThemeModeButton";
import './MainLayout.scss';
import {Toast} from "primereact/toast";
import {useToast} from "../context/ToastStore.js";
import {classNames} from 'primereact/utils'; // nếu chưa có, cần import

const MainLayout = () => {
    const [showLeftSidebar, setShowLeftSidebar] = useState(false);
    const [showRightSidebar, setShowRightSidebar] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const {user, logout} = useUserStore();
    const toastRef = useRef(null);
    const setToastRef = useToast((s) => s.setToastRef);

    useEffect(() => {
        setToastRef(toastRef);
    }, [setToastRef]);
    // Áp dụng dark mode cho toàn app (html tag)
    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [isDarkMode]);

    const leftSidebarHeaderTemplate = () => (
        <div className="flex flex-row items-center gap-3 justify-between w-full">
            <img className="w-15" src={ReciassistLogoFit} alt="Reciassist Logo"/>
            <Button onClick={() => setShowLeftSidebar(false)}
                    className="size-10 border-2 dark;border-white p-2 rounded-xl"
                    unstyled={true}
            >
                <i className="pi pi-times text-xl text-gray-900 dark:text-gray-300"/>
            </Button>
        </div>
    );

    const rightSidebarHeaderTemplate = () => (
        <div className="flex flex-row items-center gap-3 justify-between w-full">
            <div
                className="text-2xl font-semibold text-gray-900 dark:text-gray-300">{user ? user.username : "Anonymous"}</div>
            <Button onClick={() => setShowRightSidebar(false)}
                    className="size-10 border-2 dark;border-white p-2 rounded-xl"
                    unstyled={true}>
                <i className="pi pi-times text-xl text-gray-900 dark:text-gray-300"/>
            </Button>
        </div>
    );

    const TailwindToast = {
        toast: {
            root: {
                className: classNames('w-96', 'opacity-90')
            },
            message: ({state, index}) => ({
                className: classNames('my-4 rounded-md w-full', {
                    'bg-blue-100 border-solid border-0 border-l-4 border-blue-500 text-blue-700': state.messages[index] && state.messages[index].message.severity == 'info',
                    'bg-green-100 border-solid border-0 border-l-4 border-green-500 text-green-700': state.messages[index] && state.messages[index].message.severity == 'success',
                    'bg-orange-100 border-solid border-0 border-l-4 border-orange-500 text-orange-700': state.messages[index] && state.messages[index].message.severity == 'warn',
                    'bg-red-100 border-solid border-0 border-l-4 border-red-500 text-red-700': state.messages[index] && state.messages[index].message.severity == 'error'
                })
            }),
            content: 'flex items-center py-5 px-7',
            icon: {
                className: classNames('w-6 h-6', 'text-lg mr-2')
            },
            text: 'text-base font-normal flex flex-col flex-1 grow shrink ml-4',
            summary: 'font-bold block',
            detail: 'mt-1 block',
            closebutton: {
                className: classNames('w-8 h-8 rounded-full bg-transparent transition duration-200 ease-in-out', 'ml-auto overflow-hidden relative', 'flex items-center justify-center', 'hover:bg-white/30')
            },
            transition: {
                enterFromClass: 'opacity-0 translate-x-0 translate-y-2/4 translate-z-0',
                enterActiveClass: 'transition-transform transition-opacity duration-300',
                leaveFromClass: 'max-h-40',
                leaveActiveClass: 'transition-all duration-500 ease-in',
                leaveToClass: 'max-h-0 opacity-0 mb-0 overflow-hidden'
            }
        }
    }

    return (
        <div className="bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
            {/* Left Sidebar */}
            <Sidebar visible={showLeftSidebar} onHide={() => setShowLeftSidebar(false)} position="left"
                     className="rounded-r-2xl border-t-2 border-r-2 border-b-2 p-5 bg-white dark:bg-gray-900 dark:border-gray-600"
                     header={leftSidebarHeaderTemplate}
                     showCloseIcon={false}

            >
                <div className="mt-10 flex flex-col gap-y-10">
                    <SideBarItemUrl icon={<FontAwesomeIcon icon={faHome}/>} label="Homepage" url="/"/>
                    <SideBarItemUrl icon={<FontAwesomeIcon icon={faBowlFood}/>} label="Create Recipe"
                                    url="/recipe/form"/>
                    <SideBarItemUrl icon={<FontAwesomeIcon icon={faBowlFood}/>} label="Recipes" url="/recipes"/>
                    <SideBarItemUrl icon={<FontAwesomeIcon icon={faUtensils}/>} label="Meal Planner" url="/meal-planner"/>
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
                            <SideBarItemUrl icon={<FontAwesomeIcon icon={faUser}/>} label="Profile" url="/userProfile"/>
                            <SideBarItemClick icon={<FontAwesomeIcon icon={faSignOut}/>} label="Sign Out"
                                              onClick={logout}/>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-y-5">
                            <SideBarItemUrl icon={<FontAwesomeIcon icon={faSignIn}/>} label="Sign In" url="/sign-in"/>
                        </div>
                    )}
                </div>
            </Sidebar>

            <div className="min-h-screen flex flex-col">
                {/* Header */}
                <header
                    className="border-b border-gray-300 dark:border-gray-700 p-3 flex flex-row justify-between items-center">
                    <div className="left-box flex flex-row items-center gap-5">
                        <Button onClick={() => setShowLeftSidebar(true)}
                                className="size-12 border-2 p-2 rounded-xl text-center flex items-center justify-center"
                                unstyled={true}
                        >
                            <i className="pi pi-bars text-xl"/>
                        </Button>
                        <Button
                            className="flex flex-row items-center gap-3 pt-unstyled flex items-center justify-center"
                            style={{
                                padding: 0,
                                background: "transparent",
                                border: "none",
                                fontFamily: "poppins",
                            }}
                        >
                            <img className="h-10" src={ReciassistLogoFitNoText} alt="Reciassist Logo"/>
                            <span className="text-2xl font-semibold dark:text-white text-black">Reciassist</span>
                        </Button>
                    </div>

                    <div className="right-box flex flex-row items-center gap-3 mr-3">
                        <ThemeModeButton mode={isDarkMode} onClick={() => setIsDarkMode(!isDarkMode)}/>
                        <Button
                            onClick={() => setShowRightSidebar(!showRightSidebar)}
                            className="w-12 h-12 border-2 p-0 rounded-full overflow-hidden flex items-center justify-center
                dark:border-gray-300 border-gray-900 flex items-center justify-center"
                            style={{
                                padding: 0,
                                background: "transparent",
                                color: "black",
                                border: isDarkMode ? "solid white 2px" : "solid black 2px",
                                borderRadius: "50%",
                                fontFamily: "poppins",
                            }}
                        >
                            <img src={user ? Ava1 : Anonymous}
                                 className="bg-white w-full h-full object-cover rounded-full" alt="Avatar"/>
                        </Button>
                    </div>
                </header>

                {/* Body */}
                <main className="flex flex-1 mx-15 my-5 justify-center">
                    <Toast
                        ref={toastRef} pt={TailwindToast.toast}
                    />
                    <Outlet/>
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
