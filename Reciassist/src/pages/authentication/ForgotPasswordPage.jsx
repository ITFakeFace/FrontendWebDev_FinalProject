import {useEffect, useState} from "react";
import './ForgotPasswordPage.scss';
import {Steps} from "primereact/steps";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {InputOtp} from "primereact/inputotp";
import {AnimatePresence, motion} from "framer-motion";
import {Password} from "primereact/password";
import {classNames} from "primereact/utils";

const ForgotPasswordPage = () => {
    let emptyResetUser = {
        email: "",
        password: "",
        confirmPassword: "",
        otp: "",
    };
    const maskEmail = (email) => {
        const [username, domain] = email.split('@');
        if (username.length <= 6) {
            // Nếu quá ngắn, chỉ giữ ký tự đầu và cuối
            return username[0] + '*'.repeat(username.length - 2) + username.slice(-1) + '@' + domain;
        }

        const start = username.slice(0, 3);
        const end = username.slice(-3);
        const masked = '*'.repeat(username.length - 6);
        return `${start}${masked}${end}@${domain}`;
    }

    const TRANSITIONS = {
        overlay: {
            enterFromClass: 'opacity-0 scale-75',
            enterActiveClass: 'transition-transform transition-opacity duration-150 ease-in',
            leaveActiveClass: 'transition-opacity duration-150 ease-linear',
            leaveToClass: 'opacity-0'
        }
    };

    const PasswordTailwind = {
        password: {
            root: ({props}) => ({
                className: classNames('inline-flex relative w-full', {
                    'opacity-60 select-none pointer-events-none cursor-default': props.disabled
                })
            }),
            panel: 'p-5 bg-white dark:bg-gray-900 text-gray-700 dark:text-white/80 shadow-md rounded-md',
            meter: 'mb-2 bg-gray-300 dark:bg-gray-700 h-3',
            meterlabel: ({state, props}) => ({
                className: classNames(
                    'transition-width duration-1000 ease-in-out h-full',
                    {
                        'bg-red-500': state.meter?.strength == 'weak',
                        'bg-orange-500': state.meter?.strength == 'medium',
                        'bg-green-500': state.meter?.strength == 'strong'
                    },
                    {'pr-[2.5rem] ': props.toggleMask}
                )
            }),
            showicon: {
                className: classNames('absolute top-1/2 -mt-2', 'right-3 text-gray-600 dark:text-white/70')
            },
            hideicon: {
                className: classNames('absolute top-1/2 -mt-2', 'right-3 text-gray-600 dark:text-white/70')
            },
            inputIcon: {
                root: 'mt-0'
            },
            input: {
                className: classNames('w-full')
            },
            transition: TRANSITIONS.overlay
        }
    }

    const [resetUser, setResetUser] = useState(emptyResetUser);
    const [activeIndex, setActiveIndex] = useState(0);
    const itemRenderer = (item, itemIndex) => {
        const isActiveItem = activeIndex === itemIndex;
        const backgroundColor = isActiveItem ? 'var(--gray-500)' : 'var(--surface-b)';
        const textColor = isActiveItem ? 'var(--surface-b)' : 'var(--text-color-secondary)';

        return (
            <Button
                style={{backgroundColor: backgroundColor, color: textColor}}
                className="p-3 border-1 border-gary-900 rounded-full mb-2"
            >
                <i className={`${item.icon} text-xl`}/>
            </Button>
        );
    };

    const onResetUserChange = (value, field) => {
        setResetUser(prev => ({
            ...prev,
            [field]: value
        }));
    }

    const EmailForm = () => {
        return (
            <div className="w-3/5 flex flex-col mb-5 justify-center items-center justify-self-center">
                <div className={"w-full flex justify-center items-center"}>
                    <span className="w-fit text-3xl font-semibold mb-3">Password Recovery</span>
                </div>
                <div className="w-full flex justify-center items-center">
                    <span className="text-gray-500 block mb-5">Please enter email to process.</span>
                </div>
                <div className="w-3/5 flex text-lg mb-10">
                    <div className="w-full p-inputgroup flex-1 border-2 border-gray-600 rounded-xl overflow-hidden">
                        <InputText value={resetUser.email}
                                   onChange={(e) => onResetUserChange(e.target.value, "email")}
                                   className="pl-3 py-2" placeholder="Enter email..."/>
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-envelope text-2xl"/>
                        </span>
                    </div>
                </div>
                <div className="w-full flex flex-row justify-end">
                    <Button
                        className="border-2 border-gray-600 rounded-xl px-5 py-2 hover:text-white hover:bg-gray-600"
                        onClick={() => setActiveIndex(1)}
                    >
                        Go to next step
                    </Button>
                </div>
            </div>
        )
    }

    const OTPForm = () => {
        return (
            <div className="w-3/5 flex flex-col mb-5 items-center justify-self-center">
                <div className={"w-fit flex items-center"}>
                    <span className="w-fit text-3xl font-semibold mb-3">Authenticate Your Account</span>
                </div>
                <div className="w-fit flex items-center">
                    <span className="text-color-secondary block mb-5">Please enter the code sent to your email.</span>
                </div>
                <div className="w-full flex justify-center items-center mb-10">
                    <InputOtp
                        value={resetUser.otp} onChange={(e) => onResetUserChange(e.value, "otp")} length={6}
                        className="text-3xl "
                        pt={{
                            input: {
                                root: {
                                    className: "p-1 border-2 border-gray-600 rounded-xl text-4xl"
                                }
                            }
                        }}
                    />
                </div>
                <div className="w-full flex flex-row justify-between">
                    <Button
                        className="border-2 border-gray-600 rounded-xl px-5 py-2 hover:text-white hover:bg-gray-600"
                        onClick={() => setActiveIndex(0)}
                    >
                        Try another email
                    </Button>
                    <Button
                        className="border-2 border-gray-600 rounded-xl px-5 py-2 hover:text-white hover:bg-gray-600"
                        onClick={() => setActiveIndex(2)}
                    >
                        Go to next step
                    </Button>
                </div>
            </div>
        )
    }

    const NewPasswordForm = () => {
        return (
            <div className="w-3/5 flex flex-col mb-5 items-center justify-self-center">
                <div className={"w-fit flex items-center"}>
                    <span className="w-fit text-3xl font-semibold mb-3">Authenticate Your Account</span>
                </div>
                <div className="w-fit flex items-center">
                    <span className="text-color-secondary block mb-5">Please enter the code sent to your email.</span>
                </div>
                <div className="w-3/5 flex text-lg mb-10">
                    <div className="w-full p-inputgroup flex-1 border-2 border-gray-600 rounded-xl overflow-hidden">
                        <Password value={resetUser.password}
                                  onChange={(e) => onResetUserChange(e.target.value, "password")}
                                  className="pl-3 py-2 " placeholder="Enter new password..."
                                  pt={PasswordTailwind.password}
                                  toggleMask={true}
                        />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-lock text-2xl"/>
                        </span>
                    </div>
                </div>
                <div className="w-3/5 flex text-lg mb-10">
                    <Password value={resetUser.confirmPassword}
                              onChange={(e) => onResetUserChange(e.target.value, "confirmPassword")}
                              className="pl-3 py-2 !w-full" placeholder="Confirm new password..."
                              pt={{
                                  root: {
                                      className: "w-full"
                                  },
                                  input: {
                                      className: "w-full"
                                  },
                                  iconField: {
                                      className: "w-full"
                                  }
                              }}
                              toggleMask={true}
                              feedback={false}
                    />
                </div>
                <div className="w-full flex flex-row justify-between">
                    <Button
                        className="border-2 border-gray-600 rounded-xl px-5 py-2 hover:text-white hover:bg-gray-600"
                        onClick={() => setActiveIndex(0)}
                    >
                        Try another email
                    </Button>
                    <Button
                        className="border-2 border-gray-600 rounded-xl px-5 py-2 hover:text-white hover:bg-gray-600"
                        onClick={() => changePassword()}
                    >
                        Recovery Password
                    </Button>
                </div>
            </div>
        )
    }

    const items = [
        {
            icon: 'pi pi-user',
            template: (item) => itemRenderer(item, 0),
            content: EmailForm(),
        },
        {
            icon: 'pi pi-calendar',
            template: (item) => itemRenderer(item, 1),
            content: OTPForm(),
        },
        {
            icon: 'pi pi-check',
            template: (item) => itemRenderer(item, 2),
            content: NewPasswordForm(),
        }
    ];

    const changePassword = () => {

    }

    useEffect(() => {
        document.body.classList.add('forgot-password-body');
        return () => {
            document.body.classList.remove('forgot-password-body');
        };
    }, []);

    return (
        <div className="container">
            <div className='w-full h-fit'>
                <Steps
                    model={items}
                    activeIndex={activeIndex}
                    readOnly={false}
                    className="m-2"
                    style={{
                        borderBottom: "solid var(--gray-900) 1px"
                    }}
                />
            </div>
            <div className="w-full p-5 grow flex justify-center items-center gap-2 mt-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        className="w-full"
                        key={activeIndex}
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.3}}
                    >
                        {items[activeIndex].content}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ForgotPasswordPage;