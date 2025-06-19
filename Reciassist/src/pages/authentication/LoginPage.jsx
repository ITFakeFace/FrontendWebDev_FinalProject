import { useEffect, useRef, useState } from "react";
import "./LoginPage.scss";
import { login, register } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  let emptyLogin = {
    username: '',
    password: '',
  }

  let emptyRegister = {
    username: "",
    email: "",
    password: "",
    avatar: null,
    dob: null,
    gender: null,
    phone: null,
  }

  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [registerForm, setRegisterForm] = useState(emptyRegister);
  const containerRef = useRef(null);
  const navigate = useNavigate();


  const loginClick = (e) => {
    try {
      e.preventDefault();
      login({
        username: loginForm.username,
        password: loginForm.password
      });
      navigate('/');
    } catch (ex) {
      console.log(ex);
    }
  }

  const registerClick = () => {
    register({
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password
    });
  }

  const onLoginChangeProps = (value, field) => {
    setLoginForm(prev => ({
      ...prev,
      [field]: value
    }));
  }

  const onRegisterChangeProps = (value, field) => {
    setRegisterForm(prev => ({
      ...prev,
      [field]: value
    }));
  }

  const loginBtnClick = () => {
    containerRef.current?.classList.remove('active');
  };

  const registerBtnClick = () => {
    containerRef.current?.classList.add('active');
  };

  useEffect(() => {
    document.body.classList.add('login-body');
    return () => {
      document.body.classList.remove('login-body');
    };
  }, []);

  return (
    <div className="container" ref={containerRef}>
      <div className="form-box login">
        <form onSubmit={(e) => loginClick(e)}>
          <h1>Login</h1>
          <div className="input-box">
            <input type="text" value={loginForm.username}
              onChange={(e) => onLoginChangeProps(e.target.value, 'username')}
              placeholder="Username" required
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input type="password" value={loginForm.password}
              onChange={(e) => onLoginChangeProps(e.target.value, 'password')}
              placeholder="Password" required
            />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <div className="forgot-link">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="btn">Login</button>
          <p>or login with social platforms</p>
          <div className="social-icons">
            <a href="#"><i className="bx bxl-google"></i></a>
            <a href="#"><i className="bx bxl-facebook"></i></a>
            <a href="#"><i className="bx bxl-tiktok"></i></a>
            <a href="#"><i className="bx bxl-linkedin"></i></a>
          </div>
        </form>
      </div>

      <div className="form-box register">
        <form action={""}>
          <h1>Registration</h1>
          <div className="input-box">
            <input type="text" value={registerForm.username}
              onChange={(e) => onRegisterChangeProps(e.target.value, 'username')}
              placeholder="Username" required
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input type="email" value={registerForm.email}
              onChange={(e) => onRegisterChangeProps(e.target.value, 'email')}
              placeholder="Email" required
            />
            <i className="bx bxs-envelope"></i>
          </div>
          <div className="input-box">
            <input type="password" value={registerForm.password}
              onChange={(e) => onRegisterChangeProps(e.target.value, 'password')}
              placeholder="Password" required
            />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <div className="forgot-link">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="btn">Register</button>
          <p>or register with social platforms</p>
          <div className="social-icons">
            <a href="#"><i className="bx bxl-google"></i></a>
            <a href="#"><i className="bx bxl-facebook"></i></a>
            <a href="#"><i className="bx bxl-tiktok"></i></a>
            <a href="#"><i className="bx bxl-linkedin"></i></a>
          </div>
        </form>
      </div>

      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button className="btn register-btn" onClick={registerBtnClick}>Register</button>
        </div>
        <div className="toggle-panel toggle-right">
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button className="btn login-btn" onClick={loginBtnClick}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;