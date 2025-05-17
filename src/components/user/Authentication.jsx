import React, { useEffect, useState } from 'react'
import { useGoogleLogin } from "@react-oauth/google"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft, faArrowRight, faUser, faEye,
  faEyeSlash, faLock, faEnvelope, faShieldHalved,
  faPaperPlane, faExclamation, faPlug, faFlag
} from "@fortawesome/free-solid-svg-icons"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { useNavigate } from "react-router-dom"

import { sendEmail, register, login, getUser, forgotPass, testConnect } from "../../api/api"

import THEMES from "../../Themes.json"
import LANGUAGES from "../../Languages.json"
import Toast from '../Toast'

import IMAGE from "/images/ai_gen_metaAI.jfif"

function Authentication() {
  const [data, setData] = useState({})
  const [verify, setVerify] = useState({
    verify_tk: "",
    verification_code: ""
  })
  const [stateSwitchForm, setStateSwitchForm] = useState(0)
  const [stateForgotPass, setStateForgotPass] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    text: "",
    duration: 1000,
    status: "",
    showIcon: false,
    icon: null,
    flag: false,
    report: {}
  })

  const navigate = useNavigate()

  const theme_ls = localStorage.getItem("theme")
  const language_ls = localStorage.getItem("language")

  const [theme, setTheme] = useState(theme_ls ? theme_ls : "default")
  const [language, setLanguage] = useState(language_ls ? language_ls : "th")

  const dataSwitchSignInUp = [
    {
      login: {
        display: "block"
      },
      register: {
        display: "none"
      },
      header: LANGUAGES.messages[language].login,
      google: LANGUAGES.messages[language].signinwithgoogle
    },
    {
      login: {
        display: "none"
      },
      register: {
        display: "block"
      },
      header: LANGUAGES.messages[language].register,
      google: LANGUAGES.messages[language].signupwithgoogle
    }
  ]

  useEffect(() => {
    const formStyle = localStorage.getItem("form")
    if (formStyle == "login") {
      setStateSwitchForm(0)
      return;
    } if (formStyle == "register") {
      setStateSwitchForm(1)
      return;
    }

    testConnect()
      .catch(err => {
        console.log(err);
        setToast({
          show: true,
          text: LANGUAGES.messages[language].error.connecterror,
          duration: 5000,
          status: "error",
          showIcon: true,
          icon: faPlug
        })
        return;
      })
  }, [])

  useEffect(() => {
    let timer;

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const handleChange = e => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const startCountdown = () => {
    setTimeLeft(30);
    setIsActive(true);
    return;
  };

  const handleTime = (second) => {
    setTimeout(() => {
      setToast({ "show": false })
    }, second);
  }

  const switchFormStyle = () => {
    setStateSwitchForm(prev => {
      const newState = prev + 1;
      if (newState === 2) {
        return 0;
      }
      return newState;
    })
  }

  const togglePassword = () => {
    setShowPass(prev => !prev)
    return;
  }

  const switchFormForgotPass = check => {
    const block_form = document.getElementById("block-form")
    if (check) {
      block_form.style.display = "none"
      setStateForgotPass(true)
      return
    } else {
      block_form.style.display = "block"
      setStateForgotPass(false)
      return
    }
  }

  const handleGoogleAuth = async res => {
    startCountdown()
    await fetch("/api/auth-google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token: res.access_token })
    })
      .then(_ => {
        localStorage.setItem("status", "login")
        navigate("/")
        return;
      })
      .catch(err => {
        console.log(err)
        setIsActive(false)
        setTimeLeft(0)
        setToast({
          show: true,
          text: LANGUAGES.messages[language].error.mainerror,
          duration: 10000,
          status: "error",
          showIcon: true,
          icon: faFlag,
          flag: true,
          report: {
            "user_id": "view",
            "timestamp": err.response.headers.date,
            "title": err.response.statusText,
            "description": err.stack,
            "status": err.status
          }
        })
        handleTime(10500)
        return;
      })
  }

  const googleLogin = useGoogleLogin({
    onSuccess: res => handleGoogleAuth(res),
  });

  const handleSendEmail = e => {
    e.preventDefault()

    if (!data.email.includes("@")) {
      setToast({
        show: true,
        text: LANGUAGES.messages[language].error.emailformat,
        duration: 5000,
        status: "warn",
        icon: faEnvelope
      })
      handleTime(5500)
      return;
    }

    startCountdown()
    sendEmail(data.email)
      .then(res => {
        setVerify({
          verify_tk: res.data.verify_tk,
          verification_code: res.data.verification_code
        })
        setIsActive(false)
        setTimeLeft(0)
        return;
      })
      .catch(err => {
        console.log(err)
        setIsActive(false)
        setTimeLeft(0)
        setToast({
          show: true,
          text: LANGUAGES.messages[language].error.mainerror,
          duration: 10000,
          status: "error",
          showIcon: true,
          icon: faFlag,
          flag: true,
          report: {
            "user_id": "view",
            "timestamp": err.response.headers.date,
            "title": err.response.statusText,
            "description": err.stack,
            "status": err.status
          }
        })
        handleTime(10500)
        return
      })
  }

  const handleRegister = e => {
    e.preventDefault()
    startCountdown()
    register(verify.verify_tk, verify.verification_code, data)
      .then(_ => {
        localStorage.setItem("status", "login")
        navigate("/")
        return;
      })
      .catch(err => {
        console.log(err)
        setIsActive(false)
        setTimeLeft(0)
        if (err.response.data.detail == "user already exists") {
          setToast({
            show: true,
            text: LANGUAGES.messages[language].error.useralready,
            duration: 5000,
            status: "warn",
            icon: faExclamation
          })
          handleTime(5500)
          return
        } if (err.response.data.detail == "email already exists") {
          setToast({
            show: true,
            text: LANGUAGES.messages[language].error.emailalready,
            duration: 5000,
            status: "warn",
            icon: faEnvelope
          })
          handleTime(5500);
          return;
        } else {
          setToast({
            show: true,
            text: LANGUAGES.messages[language].error.mainerror,
            duration: 10000,
            status: "error",
            showIcon: true,
            icon: faFlag,
            flag: true,
            report: {
              "user_id": "view",
              "timestamp": err.response.headers.date,
              "title": err.response.statusText,
              "description": err.stack,
              "status": err.status
            }
          })
          handleTime(10500)
          return
        }
      })
  }

  const handleLogin = e => {
    e.preventDefault()
    startCountdown()
    login(data)
      .then(_ => {
        localStorage.setItem("status", "login")
        getUser()
          .then(res => {
            if (res.data.role === "user") {
              navigate("/")
              return;
            } if (res.data.role === "admin") {
              navigate("/admin")
              return;
            }
          })
          .catch(err => {
            console.log(err)
            setToast({
              show: true,
              text: LANGUAGES.messages[language].error.mainerror,
              duration: 10000,
              status: "error",
              showIcon: true,
              icon: faFlag,
              flag: true,
              report: {
                "user_id": "view",
                "timestamp": err.response.headers.date,
                "title": err.response.statusText,
                "description": err.stack,
                "status": err.status
              }
            })
            handleTime(10500)
            return
          })
      })
      .catch(err => {
        setIsActive(false)
        setTimeLeft(0)
        console.log(err)
        if (err.response.data.detail == "user or email not found") {
          setToast({
            show: true,
            text: LANGUAGES.messages[language].error.useroremail,
            duration: 5000,
            status: "warn",
            icon: faExclamation
          })
          handleTime(5500)
          return;
        } if (err.response.data.detail == "password is incorrect") {
          setToast({
            show: true,
            text: LANGUAGES.messages[language].error.passwordfail,
            duration: 5000,
            status: "error",
            icon: faShieldHalved
          })
          handleTime(5500)
          return;
        } else {
          setToast({
            show: true,
            text: LANGUAGES.messages[language].error.mainerror,
            duration: 10000,
            status: "error",
            showIcon: true,
            icon: faFlag,
            flag: true,
            report: {
              "user_id": "view",
              "timestamp": err.response.headers.date,
              "title": err.response.statusText,
              "description": err.stack,
              "status": err.status
            }
          })
          handleTime(10500)
          return;
        }
      })
  }

  const handleForgotPassword = e => {
    e.preventDefault()
    startCountdown()
    forgotPass(verify.verify_tk, verify.verification_code, data)
      .then(res => res.json())
      .then(_ => {
        navigate("//authentication")
        return;
      })
      .catch(err => {
        console.log(err)
        setIsActive(false)
        setTimeLeft(0)
        if (err.response.data.detail == "password is incorrect") {
          setToast({
            show: true,
            text: LANGUAGES.messages[language].error.emailfound,
            duration: 5000,
            status: "warn",
            icon: faExclamation
          })
          handleTime(5500)
        } else {
          setToast({
            show: true,
            text: LANGUAGES.messages[language].error.mainerror,
            duration: 10000,
            status: "error",
            showIcon: true,
            icon: faFlag,
            flag: true,
            report: {
              "user_id": "view",
              "timestamp": err.response.headers.date,
              "title": err.response.statusText,
              "description": err.stack,
              "status": err.status
            }
          })
          handleTime(10500)
          return;
        }
      })
  }

  return (
    <div className='auth' style={THEMES[theme].background}>
      <img src={IMAGE} className="content-image"></img>
      <div className="content-form" style={LANGUAGES.fontFamily[language]}>
        <div className="block-blur"></div>
        <div className="block-form" id='block-form'>
          <div className="content-mini-menu">
            <FontAwesomeIcon icon={faArrowLeft} className='fa-content-mini-menu' onClick={switchFormStyle} />
            <h1>{dataSwitchSignInUp[stateSwitchForm].header}</h1>
            <FontAwesomeIcon icon={faArrowRight} className='fa-content-mini-menu' onClick={switchFormStyle} />
          </div>
          <div className="content-form-data">
            <form style={dataSwitchSignInUp[stateSwitchForm].register} onSubmit={handleRegister} >
              <div className="input-username">
                <FontAwesomeIcon icon={faUser} />
                <input type="text" name='username' placeholder={LANGUAGES.messages[language].username} onChange={e => handleChange(e)} required />
              </div>
              <div className="input-password">
                <FontAwesomeIcon icon={faLock} />
                <input type={showPass ? "text" : "password"} name='password' placeholder={LANGUAGES.messages[language].password} onChange={e => handleChange(e)} required />
                <FontAwesomeIcon style={{ cursor: "pointer" }} icon={showPass ? faEyeSlash : faEye} onClick={togglePassword} />
              </div>
              <div className="input-email">
                <FontAwesomeIcon icon={faEnvelope} />
                <input type="email" name='email' placeholder={LANGUAGES.messages[language].email} disabled={isActive} onChange={e => handleChange(e)} required />
                {timeLeft > 0 ? timeLeft : <FontAwesomeIcon icon={faPaperPlane} onClick={handleSendEmail} />}
              </div>
              <div className="input-verify">
                <FontAwesomeIcon icon={faShieldHalved} />
                <input type="text" name='verify_code' placeholder={LANGUAGES.messages[language].verify} onChange={e => handleChange(e)} required />
                <p id='desc-verify'>{LANGUAGES.messages[language].warnsendmail}</p>
              </div>
              <button type="submit" style={isActive ? THEMES[theme].loader : null} disabled={isActive}>{LANGUAGES.messages[language].createaccount}</button>
            </form>
            <form style={dataSwitchSignInUp[stateSwitchForm].login} onSubmit={handleLogin}>
              <div className="input-username">
                <FontAwesomeIcon icon={faUser} />
                <input type="text" name='username' placeholder={LANGUAGES.messages[language].username} onChange={e => handleChange(e)} required />
              </div>
              <div className="input-password">
                <FontAwesomeIcon icon={faLock} />
                <input type={showPass ? "text" : "password"} name='password' placeholder={LANGUAGES.messages[language].password} onChange={e => handleChange(e)} required />
                <FontAwesomeIcon style={{ cursor: "pointer" }} icon={showPass ? faEyeSlash : faEye} onClick={togglePassword} />
              </div>
              <div className="forgot-password">
                <p onClick={() => switchFormForgotPass(true)}>{LANGUAGES.messages[language].forgotpass}</p>
              </div>
              <button type="submit" style={isActive ? THEMES[theme].loader : null} disabled={isActive}>{LANGUAGES.messages[language].signin}</button>
            </form>
            <div className="content-line">
              <div className="line"></div>
            </div>
            <div className="google-login">
              <button onClick={googleLogin} style={isActive ? THEMES[theme].loader : null} disabled={isActive}>
                <FontAwesomeIcon icon={faGoogle} className='fa-google' />
                {dataSwitchSignInUp[stateSwitchForm].google}
              </button>
            </div>
          </div>
        </div>
        <div className="block-forgot-pass" style={stateForgotPass ? { display: "block" } : { display: "none" }}>
          <div className="content-mini-menu">
            <FontAwesomeIcon icon={faArrowLeft} className='fa-content-mini-menu' onClick={() => switchFormForgotPass(false)} />
            <h1>{LANGUAGES.messages[language].forgotpass}</h1>
            <div></div>
          </div>
          <div className="content-form-data">
            <form onSubmit={handleForgotPassword}>
              <div className="input-email">
                <FontAwesomeIcon icon={faEnvelope} />
                <input type="email" name='email' placeholder={LANGUAGES.messages[language].email} disabled={isActive} onChange={e => handleChange(e)} required />
                {timeLeft > 0 ? timeLeft : <FontAwesomeIcon icon={faPaperPlane} onClick={handleSendEmail} />}
              </div>
              <div className="input-new-pass">
                <FontAwesomeIcon icon={faLock} />
                <input type={showPass ? "text" : "password"} name='password' placeholder={LANGUAGES.messages[language].newpass} onChange={e => handleChange(e)} required />
                <FontAwesomeIcon style={{ cursor: "pointer" }} icon={showPass ? faEyeSlash : faEye} onClick={togglePassword} />
              </div>
              <div className="input-verify">
                <FontAwesomeIcon icon={faShieldHalved} />
                <input type="text" name='verify_code' placeholder={LANGUAGES.messages[language].verify} onChange={e => handleChange(e)} required />
                <p id='desc-verify-re-pass'>{LANGUAGES.messages[language].warnsendmail}</p>
              </div>
              <button type="submit" style={isActive ? THEMES[theme].loader : null} disabled={isActive}>{LANGUAGES.messages[language].confirm}</button>
            </form>
          </div>
        </div>
      </div>
      <Toast data={toast} />
    </div>
  )
}

export default Authentication
