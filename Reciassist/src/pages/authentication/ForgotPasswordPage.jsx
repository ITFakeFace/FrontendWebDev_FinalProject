import {useEffect, useRef, useState} from "react";
import './ForgotPasswordPage.scss';
import {Steps} from "primereact/steps";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {InputOtp} from "primereact/inputotp";
import {AnimatePresence, motion} from "framer-motion";
import {Password} from "primereact/password";
import {classNames} from "primereact/utils";
import {Toast} from "primereact/toast";
import {useNavigate} from "react-router-dom";

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

    const PrimeReactTailwind = {
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
        },
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

    const [resetUser, setResetUser] = useState(emptyResetUser);
    const [activeIndex, setActiveIndex] = useState(0);
    const toast = useRef();
    const navigate = useNavigate();
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

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function setInvalid(elementOrRef, isInvalid = true) {
        const el = elementOrRef?.current || elementOrRef;
        if (!el) return;

        if (isInvalid) {
            el.classList.add('p-invalid');
        } else {
            el.classList.remove('p-invalid');
        }
    }

    const Step1Click = () => {
        if (isValidEmail(resetUser.email)) {
            showToast(`Validation Code has been sent to email ${maskEmail(resetUser.email)}`, "success");
            setActiveIndex(1);
            setResetUser(prev => ({...prev, otp: ""}));
        } else {
            setInvalid(document.querySelector("#input-email"), true);
        }
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
                        <InputText
                            id={'input-email'}
                            value={resetUser.email}
                            onChange={(e) => onResetUserChange(e.target.value, "email")}
                            className="pl-3 py-2" placeholder="Enter email..."/>
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-envelope text-2xl"/>
                        </span>
                    </div>
                </div>
                <div className="w-full flex flex-row justify-between">
                    <Button
                        className="border-2 border-gray-600 rounded-xl px-5 py-2 hover:text-white hover:bg-gray-600"
                        onClick={() => navigate("/sign-in")}
                    >
                        <i className="pi pi-arrow-left text-lg mr-2"/>
                        Back to Login
                    </Button>
                    <Button
                        className="border-2 border-gray-600 rounded-xl px-5 py-2 hover:text-white hover:bg-gray-600"
                        onClick={Step1Click}
                        disabled={resetUser.email == ""}
                    >
                        Go to next step
                    </Button>
                </div>
            </div>
        )
    }

    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleResendClick = () => {
        // Fake resend email action
        console.log(`Resending code to ${resetUser.email}`);
        setResendCooldown(60);
    };

    const Step2Click = () => {
        if (resetUser.otp == "123456" || resetUser.otp == "") {
            const otpInputs = document.querySelectorAll(".p-inputotp-input");
            otpInputs.forEach(input => {
                setInvalid(input, true); // setInvalid giống như hàm bạn đã dùng
            });
        } else {
            showToast("Success", "success");
            setActiveIndex(2); // Đi tiếp nếu code hợp lệ
        }
    };

    const OTPForm = () => {
        return (
            <div className="w-3/5 flex flex-col mb-5 items-center justify-self-center">
                <div className={"w-fit flex items-center"}>
                    <span className="w-fit text-3xl font-semibold mb-3">Authenticate Your Account</span>
                </div>
                <div className="w-fit flex items-center">
                    <span className="text-color-secondary block mb-5">Please enter the code sent to your email.</span>
                </div>
                <div className="w-full flex justify-center items-center mb-5">
                    <InputOtp
                        id="input-otp"
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
                {/* Resend Code Section */}
                <div className="mb-10">
                    <Button
                        disabled={resendCooldown > 0}
                        onClick={handleResendClick}
                        className={`border-2 rounded-xl px-4 py-2 transition ${
                            resendCooldown > 0
                                ? "border-gray-400 text-gray-400 cursor-not-allowed"
                                : "border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600"
                        }`}
                    >
                        {resendCooldown > 0
                            ? `Resend code (${resendCooldown}s)`
                            : `Resend code to ${resetUser.email}`}
                    </Button>
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
                        onClick={Step2Click}
                    >
                        Go to next step
                    </Button>
                </div>
            </div>
        )
    }

    const [passwordMismatch, setPasswordMismatch] = useState(false);

    const Step3Click = () => {
        const passwordInput = document.querySelector("#new-password");
        const confirmInput = document.querySelector("#confirm-password");

        let isValid = true;

        if (!resetUser.password || resetUser.password.length < 6) {
            setInvalid(passwordInput, true);
            isValid = false;
        } else {
            setInvalid(passwordInput, false);
        }

        if (resetUser.password !== resetUser.confirmPassword) {
            setInvalid(confirmInput, true);
            setPasswordMismatch(true); // Hiển thị lỗi
            isValid = false;
        } else {
            setInvalid(confirmInput, false);
            setPasswordMismatch(false);
        }

        if (isValid) {
            changePassword(); // Gọi API đổi mật khẩu
            showToast("Password changed successfully", "success");

            // Chờ toast hiển thị xong (3s), sau đó chuyển trang
            setTimeout(() => {
                navigate("/sign-in");
            }, 1500); // 3000ms là thời gian Toast tồn tại
        } else {
            showToast("Invalid password or mismatch", "error");
        }
    };


    const NewPasswordForm = () => {
        return (
            <div className="w-3/5 flex flex-col mb-5 items-center justify-self-center">
                <div className={"w-fit flex items-center"}>
                    <span className="w-fit text-3xl font-semibold mb-3">Making New Password</span>
                </div>
                <div className="w-fit flex items-center">
                    <span className="text-color-secondary block mb-5">Enter below to complete process.</span>
                </div>
                <div className="w-3/5 flex text-lg mb-10">
                    <div className="w-full p-inputgroup flex-1 border-2 border-gray-600 rounded-xl overflow-hidden">
                        <Password
                            id="new-password"
                            value={resetUser.password}
                            onChange={(e) => onResetUserChange(e.target.value, "password")}
                            className="pl-3 py-2 w-full" placeholder="Enter new password..."
                            pt={PrimeReactTailwind.password}
                            toggleMask={true}
                        />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-lock text-2xl"/>
                        </span>
                    </div>
                </div>
                <div className="w-3/5 flex flex-col text-lg mb-10 gap-5">
                    <div
                        className="w-full p-inputgroup flex-1 border-2 border-gray-600 rounded-xl overflow-hidden">
                        <Password
                            id="confirm-password"
                            value={resetUser.confirmPassword}
                            onChange={(e) => onResetUserChange(e.target.value, "confirmPassword")}
                            className="pl-3 py-2 w-full" placeholder="Confirm password..."
                            pt={PrimeReactTailwind.password}
                            toggleMask={true}
                            feedback={false}
                        />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-lock text-2xl"/>
                        </span>
                    </div>
                    <div>
                        {passwordMismatch && (
                            <span className="text-red-500 text-sm ml-3">
                                Password and Confirm Password do not match.
                            </span>
                        )}
                    </div>
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
                        onClick={Step3Click}
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

    const showToast = (info, severity = 'info') => {
        toast.current?.show({
            severity,
            summary: severity.charAt(0).toUpperCase() + severity.slice(1),
            detail: info,
            life: 3000,
            position: 'top-right',
        });
    };

    useEffect(() => {
        document.body.classList.add('forgot-password-body');
        return () => {
            document.body.classList.remove('forgot-password-body');
        };
    }, []);

    return (
        <div className="container">
            <Toast ref={toast} pt={PrimeReactTailwind.toast}/>
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