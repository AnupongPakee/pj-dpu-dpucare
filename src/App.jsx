import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPalette, faForwardFast, faPlay, faPause,
  faFilm, faBars, faVolumeHigh, faTrash,
  faExpand, faPaperPlane, faRightFromBracket, faPlus,
  faPlug, faGear, faLanguage, faRepeat, faVolumeXmark, faComment, faFlag
} from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"

import {
  protected_, logout, createSection, getSection,
  getHistory, deleteSection, chatbot, chatbotV2, chatbotNonUser,
  getUser, deleteSectionNonUser, testConnect
} from "./api/api"

import THEMES from "./Themes.json"
import THEMESDATA from "./ThemesData.json"
import LANGUAGES from "./Languages.json"
import Toast from './components/Toast';

import music_1 from "/music/piano-solo-334668.mp3"
import music_2 from "/music/piano-solo-337597.mp3"
import music_3 from "/music/sad-piano-song-335357.mp3"
import music_4 from "/music/melancholic-piano-music-337918.mp3"
import music_5 from "/music/piano-solo-334664.mp3"
import music_6 from "/music/meditation-music-334817.mp3"

function App() {
  const [time, setTime] = useState(new Date())
  const [data, setData] = useState({})
  const [index, setIndex] = useState(0);
  const [staeOnOff, setStateOnOff] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [statePlay, setStatePlay] = useState(false)
  const [warn, setWarn] = useState(false)
  const [limit, setLimit] = useState(3);
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageMode, setMessageMode] = useState([]);
  const [question, setQuestion] = useState("");
  const [section, setSection] = useState([])
  const [currentSection, setCurrentSection] = useState("")
  const [settingFull, setSettingFull] = useState(false)
  const [volume, setVolume] = useState(0.4)
  const [navState, setNavState] = useState(0)
  const [appMoblie, setAppMoblie] = useState(false)
  const [chatHistory, setChatHistory] = useState(false)
  const [themeData] = useState(THEMESDATA)
  const [stateTheme, setStateTheme] = useState(0)
  const [stateLanguage, setStateLanguage] = useState(0)
  const [currentSetting, setCurrentSetting] = useState({
    theme: true,
    language: false,
    audio: false
  })
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

  const platform_ls = localStorage.getItem("platform")
  const language_ls = localStorage.getItem("language")
  const theme_ls = localStorage.getItem("theme")
  const intoAnimetion_ls = localStorage.getItem("intoAnimetion")
  const status_ls = localStorage.getItem("status")
  const mode_ls = localStorage.getItem("mode")
  const status_mode_ls = localStorage.getItem("status_mode")
  const current_section_ls = localStorage.getItem("current_section")
  const first_reload_ls = localStorage.getItem("first_reload")
  const warn_mode_ls = localStorage.getItem("warn_mode")
  const current_uuid_ls = localStorage.getItem("current_uuid")
  const limit_ls = localStorage.getItem("limit")

  const [firstMode, setFirstMode] = useState(status_mode_ls ? status_mode_ls : false)
  const [stateMode, setStateMode] = useState(mode_ls ? mode_ls : "advice")
  const [platform, setPlatform] = useState(platform_ls ? platform_ls : "window")
  const [language, setLanguage] = useState(language_ls ? language_ls : "th")
  const [theme, setTheme] = useState(theme_ls ? theme_ls : "default")
  const [intoAnimetion, setIntoAnimetion] = useState(intoAnimetion_ls ? intoAnimetion_ls : false)
  const [warnMode, setWarnMode] = useState(warn_mode_ls ? warn_mode_ls : false)

  const audioRef = useRef(null);
  const messageEndRef = useRef(null);
  const navigate = useNavigate()
  const dateTime = new Date()

  const message_title = [
    LANGUAGES.messages[language].messgaesInto["1"],
    LANGUAGES.messages[language].messgaesInto["2"],
    LANGUAGES.messages[language].messgaesInto["3"],
    LANGUAGES.messages[language].messgaesInto["4"]
  ];

  const songs = [
    music_1,
    music_2,
    music_3,
    music_4,
    music_5,
    music_6
  ];

  useEffect(() => {
    if (!first_reload_ls) {
      localStorage.setItem("first_reload", true)
      localStorage.setItem("current_uuid", uuidv4())
      window.location.reload()
    }
    testConnect()
      .then(_ => {
        if (dateTime.getHours() == 23) {
          deleteSectionNonUser(current_uuid_ls)
            .then(_ => {
              return;
            })
            .catch(err => {
              console.log(err);
              setToast({
                show: true,
                text: LANGUAGES.messages[language].error.mainerror,
                duration: 10000,
                status: "error",
                showIcon: true,
                icon: faFlag,
                flag: true,
                report: {
                  "user_id": data.user_id,
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
        if (status_ls == "login") {
          getUser()
            .then(res => {
              setData(res.data)
              get_section(res.data.user_id)
              get_history(current_section_ls)
              return;
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
                  "user_id": data.user_id,
                  "timestamp": err.response.headers.date,
                  "title": err.response.statusText,
                  "description": err.stack,
                  "status": err.status
                }
              })
              handleTime(10500)
              return;
            })

          const checkToken = () => {
            protected_()
              .then(_ => {
                localStorage.setItem("status", "login")
                return;
              })
              .catch(err => {
                console.log(err)
                localStorage.setItem("status", "view")
                localStorage.removeItem("status_mode")
                localStorage.removeItem("mode")
                localStorage.removeItem("current_section")
                navigate("/authentication")
                window.location.reload()
                return;
              })
          }
          checkToken()

          const interval = setInterval(checkToken, 30 * 60 * 1000)
          return () => clearInterval(interval)
        } else {
          localStorage.setItem("status", "view")
          localStorage.removeItem("status_mode")
          localStorage.removeItem("mode")
          return;
        }
      })
      .catch(err => {
        localStorage.setItem("status", "view")
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
    scrollToBottom()
    return;
  }, [messages])

  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(time)
  }, [])

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setCount(prev => prev + 1);
      }, 100);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (window.innerWidth < 1280) {
      localStorage.setItem("platform", "phone")
      return;
    } else {
      localStorage.setItem("platform", "window")
      return;
    }
  }, [])

  useEffect(() => {
    if (index < message_title.length) {
      const timeout = setTimeout(() => {
        setIndex(prev => prev + 1)
      }, 5000)
      return () => clearTimeout(timeout)
    }
    else {
      setIntoAnimetion(true)
      localStorage.setItem("intoAnimetion", true)
      return;
    }
  }, [index])

  const handleTime = (second) => {
    setTimeout(() => {
      setToast({ "show": false })
    }, second);
    return;
  }

  const scrollToBottom = () => messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  const startAnime = () => {
    localStorage.setItem("intoAnimetion", false)
    setIntoAnimetion(false)
    setIndex(0)
    return;
  }

  const showOnOffChatHistory = check => {
    const chatStyle = document.getElementById("chatbot")
    const chatHistoryStyle = document.getElementById("chat-history")
    const miniMenu = document.getElementById("mini-menu")

    if (check == "window") {
      setStateOnOff((prev) => {
        const newState = prev + 1;
        if (newState === 1) {
          chatStyle.style.gridColumn = "2 / 3 span"
          chatHistoryStyle.style.display = "none"
          miniMenu.style.display = "none"
        }
        if (newState === 2) {
          chatStyle.style.gridColumn = "3 / 3 span"
          chatHistoryStyle.style.display = "block"
          miniMenu.style.display = "flex"
          return 0;
        }
        return newState;
      })
    } else {
      create_section(data.user_id)
      return;
    }
  }

  const playOnOff = () => {
    setStatePlay((prev => {
      const newState = !prev
      if (newState) {
        audioRef.current.volume = volume
        audioRef.current.play()
      } else {
        audioRef.current.pause()
        return false
      }
      return newState
    }))
  }

  const changeMusic = () => {
    setCurrentSongIndex(prev => {
      const newState = prev + 1;
      setStatePlay(false)
      if (newState === 6) {
        return 0
      }
      return newState
    })
  }

  const changeThemes = () => {
    setStateTheme(prev => {
      const newState = prev + 1;
      setTheme(THEMESDATA[newState].name)
      localStorage.setItem("theme", THEMESDATA[newState].name)
      if (newState === 5) {
        return -1;
      }
      return newState;
    })
  }

  const changeLanguages = () => {
    setStateLanguage(prev => {
      const newState = prev + 1;
      if (newState === 1) {
        setLanguage("en")
        localStorage.setItem("language", "en")
      }
      if (newState === 2) {
        setLanguage("th")
        localStorage.setItem("language", "th")
        return 0;
      }
      return newState;
    })
  }

  const restore = () => {
    setTheme("default")
    setLanguage("en")
    localStorage.removeItem("theme")
    localStorage.removeItem("language")
    window.location.reload()
    return;
  }

  const nextPage = (check, page) => {
    if (check == "view") {
      if (page == "setting") {
        localStorage.setItem("form", "register")
        navigate("/authentication")
        return;
      } if (page == "exit") {
        localStorage.setItem("form", "login")
        navigate("/authentication")
        return;
      }
    } else {
      if (page == "setting") {
        setSettingFull(true)
        return;
      } if (page == "exit") {
        logOut()
        return;
      }
    }
  }

  const selectMode = mode => {
    if (mode == "advice" && status_ls == "login" && section.length == 0) {
      create_section(data.user_id)
      window.location.reload()
    }
    localStorage.setItem("status_mode", true)
    localStorage.setItem("mode", mode)
    setStateMode(mode)
    setFirstMode(true)
    return;
  }

  const create_section = id => {
    setIsActive(true)
    createSection(id)
      .then(_ => {
        setIsActive(false)
        get_section(data.user_id)
        get_history(current_section_ls)
        return;
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
            "user_id": data.user_id,
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

  const get_history = id => {
    getHistory(id)
      .then(res => {
        setMessages(res.data)
        return;
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
            "user_id": data.user_id,
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

  const get_section = id => {
    getSection(id)
      .then(res => {
        setSection(res.data)
        if (res.data.length == 0) {
          localStorage.setItem("status_mode", false)
          setFirstMode(false)
          return
        } else {
          if (current_section_ls == null || undefined) {
            setCurrentSection(res.data[0]._id)
            localStorage.setItem("current_section", res.data[0]._id)
            get_history(res.data[0]._id)
          }
          localStorage.setItem("status_mode", true)
          setFirstMode(true)
          return
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
            "user_id": data.user_id,
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

  const delete_section = id => {
    setIsActive(true)
    deleteSection(id)
      .then(_ => {
        localStorage.removeItem("current_section")
        window.location.reload()
        setIsActive(false)
        return;
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
            "user_id": data.user_id,
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

  const selectSection = id => {
    setCurrentSection(id)
    get_history(id)
    localStorage.setItem("current_section", id)
    return;
  }

  const handleChatbot = e => {
    e.preventDefault()
    setIsActive(true)
    setIsRunning(true)
    const text = document.getElementById("question")
    text.value = "";
    setMessages([...messages, { question, answer: LANGUAGES.messages[language].typeing }])
    if (status_ls == "login") {
      chatbot(current_section_ls, { human: question })
        .then(res => {
          setMessages([...messages, {
            question,
            answer: res.data.answer
          }])
          get_history(current_section_ls)
          setIsActive(false)
          setIsRunning(false)
          setCount(0)
          return;
        })
        .catch(err => {
          console.log(err)
          setMessages([...messages, { question, answer: LANGUAGES.messages[language].warnchat }])
          setIsActive(false)
          setIsRunning(false)
          setCount(0)
          setToast({
            show: true,
            text: LANGUAGES.messages[language].error.mainerror,
            duration: 10000,
            status: "error",
            showIcon: true,
            icon: faFlag,
            flag: true,
            report: {
              "user_id": data.user_id,
              "timestamp": err.response.headers.date,
              "title": err.response.statusText,
              "description": err.stack,
              "status": err.status
            }
          })
          handleTime(10500)
          return;
        })
    } else {
      if (limit == 0) {
        localStorage.setItem("limit", 0)
      }
      if (localStorage.getItem("limit")) {
        deleteSectionNonUser(current_uuid_ls)
          .then(_ => {
            setMessages([...messages, {
              question,
              answer: LANGUAGES.messages[language].countlimit
            }])
            setIsActive(false)
            setIsRunning(false)
            setCount(0)
            return;
          })
          .catch(err => {
            console.log(err);
            setToast({
              show: true,
              text: LANGUAGES.messages[language].error.mainerror,
              duration: 10000,
              status: "error",
              showIcon: true,
              icon: faFlag,
              flag: true,
              report: {
                "user_id": data.user_id,
                "timestamp": err.response.headers.date,
                "title": err.response.statusText,
                "description": err.stack,
                "status": err.status
              }
            })
            handleTime(10500)
          })
        return;
      } else {
        chatbotNonUser(current_uuid_ls, { human: question })
          .then(res => {
            setMessages([...messages, {
              question,
              answer: res.data.answer
            }])
            setLimit(prev => prev - 1)
            setIsActive(false)
            setIsRunning(false)
            setCount(0)
            return;
          })
          .catch(err => {
            console.log(err)
            setMessages([...messages, { question, answer: LANGUAGES.messages[language].warnchat }])
            setIsActive(false)
            setIsRunning(false)
            setCount(0)
            setToast({
              show: true,
              text: LANGUAGES.messages[language].error.mainerror,
              duration: 10000,
              status: "error",
              showIcon: true,
              icon: faFlag,
              flag: true,
              report: {
                "user_id": data.user_id,
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
    }
  }

  const handleChatbotV2 = e => {
    e.preventDefault()
    const text = document.getElementById("questionv2")
    text.value = "";
    setMessageMode([...messageMode, {
      question,
      answer: ""
    }])
    chatbotV2(current_uuid_ls, { human: question })
      .then(res => {
        setMessageMode([...messageMode, {
          question,
          answer: res.data.answer
        }])
        return;
      })
      .catch(err => {
        console.log(err)
        setMessageMode([...messageMode, { question, answer: LANGUAGES.messages[language].warnchat }])
        setToast({
          show: true,
          text: LANGUAGES.messages[language].error.mainerror,
          duration: 10000,
          status: "error",
          showIcon: true,
          icon: faFlag,
          flag: true,
          report: {
            "user_id": data.user_id,
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

  const delete_section_just_venting = () => {
    deleteSectionNonUser(current_uuid_ls)
      .then(_ => {
        if (data.user_id != undefined | null) {
          window.location.reload()
          return;
        } else {
          localStorage.removeItem("status_mode")
          localStorage.removeItem("mode")
          window.location.reload()
          return;
        }
      })
      .catch(err => {
        console.log(err);
        setToast({
          show: true,
          text: LANGUAGES.messages[language].error.mainerror,
          duration: 10000,
          status: "error",
          showIcon: true,
          icon: faFlag,
          flag: true,
          report: {
            "user_id": data.user_id,
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

  const logOut = () => {
    setFirstMode(false)
    logout()
      .then(_ => {
        deleteSectionNonUser(current_uuid_ls)
          .then(_ => {
            localStorage.removeItem("status_mode")
            localStorage.removeItem("mode")
            localStorage.removeItem("first_reload")
            localStorage.removeItem("current_section")
            localStorage.setItem("status", "view")
            window.location.reload()
            return;
          })
          .catch(err => {
            console.log(err);
            setToast({
              show: true,
              text: LANGUAGES.messages[language].error.mainerror,
              duration: 10000,
              status: "error",
              showIcon: true,
              icon: faFlag,
              flag: true,
              report: {
                "user_id": data.user_id,
                "timestamp": err.response.headers.date,
                "title": err.response.statusText,
                "description": err.stack,
                "status": err.status
              }
            })
            handleTime(10500)
            return;
          })
      })
      .catch(err => {
        console.log(err);
        setToast({
          show: true,
          text: LANGUAGES.messages[language].error.mainerror,
          duration: 10000,
          status: "error",
          showIcon: true,
          icon: faFlag,
          flag: true,
          report: {
            "user_id": data.user_id,
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

  const formatBold = text => {
    const cleanedText = text.replace(/(\w)\*(\W|$)/g, '$1$2');

    const regex = /(\*\*(.*?)\*\*|\*(.*?)\*)/g;

    const elements = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(cleanedText)) !== null) {
      if (match.index > lastIndex) {
        elements.push(cleanedText.slice(lastIndex, match.index));
      }

      if (match[2]) {
        elements.push(<strong key={key++}>{match[2]}</strong>);
      } else if (match[3]) {
        elements.push(<em key={key++}>{match[3]}</em>);
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < cleanedText.length) {
      elements.push(cleanedText.slice(lastIndex));
    }

    return elements;
  }

  const formatNumber = (num) => {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  }

  const navMenuFull = () => {
    const nav = document.getElementById("nav-menu-left")
    const menu_right = document.getElementById("content-menu-right")
    setNavState(prev => {
      const newState = prev + 1
      if (newState == 1) {
        if (platform == "window") {
          nav.style.width = "4%"
          menu_right.style.width = "96%"
        } if (platform == "phone") {
          nav.style.width = "100%"
          menu_right.style.width = "0%"
        }
      } if (newState == 2) {
        if (platform == "window") {
          nav.style.width = "20%"
          menu_right.style.width = "80%"
        } if (platform == "phone") {
          nav.style.width = "10%"
          menu_right.style.width = "90%"
        }
        return 0;
      }
      return newState
    })
  }

  return (
    <div className='app' style={THEMES[theme].background}>
      <div className="block-blur"></div>
      <div className="animetion-start" style={intoAnimetion ? { display: "none" } : THEMES[theme].background}>
        <h1 style={LANGUAGES.fontFamily.th} key={index}>{message_title[index]}</h1>
      </div>
      <div className="content-app" style={LANGUAGES.fontFamily[language]}>
        <div className="date-time">
          {platform == "phone" ? (
            <div className='date-menu'>
              <h1 onClick={changeLanguages}>{language == "th" ? "EN" : "TH"}</h1>
              <FontAwesomeIcon icon={faPalette} className='fa-mini-menu' onClick={() => changeThemes()} />
              <FontAwesomeIcon icon={faForwardFast} className='fa-mini-menu' onClick={changeMusic} />
              <audio style={{ display: "none" }} src={songs[currentSongIndex]} ref={audioRef} controls loop></audio>
              <FontAwesomeIcon icon={statePlay ? faPause : faPlay} className='fa-mini-menu' onClick={playOnOff} />
              <FontAwesomeIcon icon={faFilm} className='fa-mini-menu' onClick={startAnime} />
            </div>
          ) : (
            <div>
              <h1 style={platform == "phone" ? { display: "block" } : { display: "none" }}>DPUCARE</h1>
              <h1>DPUCARE</h1>
            </div>
          )}
        </div>
        <div className="mini-menu" id='mini-menu'>
          {platform == "phone" ? (<FontAwesomeIcon icon={faBars} onClick={() => setAppMoblie(true)} />) :
            <div>
              <h1 onClick={changeLanguages}>{language == "th" ? "EN" : "TH"}</h1>
              <FontAwesomeIcon icon={faPalette} className='fa-mini-menu' onClick={() => changeThemes()} />
              <FontAwesomeIcon icon={faForwardFast} className='fa-mini-menu' onClick={changeMusic} />
              <audio style={{ display: "none" }} src={songs[currentSongIndex]} ref={audioRef} controls loop></audio>
              <FontAwesomeIcon icon={statePlay ? faPause : faPlay} className='fa-mini-menu' onClick={playOnOff} />
              <FontAwesomeIcon icon={faFilm} className='fa-mini-menu' onClick={startAnime} />
            </div>}
        </div>
        <div className="logo">
          <h1>{time.toLocaleTimeString()}</h1>
        </div>
        {firstMode ? (
          <div className="chatbot" id='chatbot'>
            {status_ls == "view" ? (
              <div className='menu-mode-hidden'>
                <h1>{LANGUAGES.messages[language].limit} {limit_ls == 0 ? limit_ls : limit}</h1>
              </div>
            ) : (
              <div className="menu-mode">
                <select name="mode" id="mode" defaultValue={stateMode} onChange={e => selectMode(e.target.value)}>
                  <option value="advice">🌱 {LANGUAGES.messages[language].advice}</option>
                  <option value="just_venting">🤍 {LANGUAGES.messages[language].justventing}</option>
                </select>
                <div className="mini-menu">
                  {mode_ls == "just_venting" ? <FontAwesomeIcon icon={faTrash} className='fa-mini' onClick={() => delete_section_just_venting()} /> : null}
                  <FontAwesomeIcon icon={faTrash} className='fa-mini' style={mode_ls == "advice" && currentSection != "" ? { display: "block" } : { display: "none" }} onClick={() => delete_section(currentSection)} />
                  <FontAwesomeIcon style={platform == "phone" && mode_ls == "just_venting" ? { display: "none" } : { display: "block" }} icon={platform == "phone" ? faPlus : faExpand} className='fa-mini' onClick={() => showOnOffChatHistory(platform)} />
                </div>
              </div>
            )}
            {stateMode == "advice" ? (
              <div className="chat">
                <div className="show-message">
                  <div className="ai-message">
                    <h1>{LANGUAGES.messages[language].firstchat}</h1>
                  </div>
                  {messages.map((item, idx) => {
                    const isLast = idx === messages.length - 1;
                    return (
                      <div key={idx}>
                        <div className="human-message">
                          <h1>{item.question}</h1>
                        </div>
                        <div className="ai-message">
                          <h1 style={isActive && isLast ? THEMES[theme].loader : null} >{formatBold(item.answer)}</h1>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messageEndRef} />
                </div>
                <div className="input">
                  <div className="input-user">
                    <form onSubmit={handleChatbot}>
                      <input type="text" name='question' id='question' placeholder={LANGUAGES.messages[language].maininput} onChange={e => setQuestion(e.target.value)} required disabled={isActive} />
                      {isRunning ? formatNumber(count) : <FontAwesomeIcon icon={faPaperPlane} className='fa-input-user' onClick={handleChatbot} />}
                    </form>
                  </div>
                  <p>{LANGUAGES.messages[language].warndpu}</p>
                </div>
              </div>
            ) : (
              <div className="chat">
                <div className="show-message">
                  <div className="empty-space"></div>
                  {messageMode.map((item, idx) => {
                    return (
                      <div key={idx}>
                        <div className="human-message-mode-2">
                          <h1>{item.question}</h1>
                        </div>
                        <div className="ai-message" style={item.answer == "" ? { display: "none" } : { display: "block" }}>
                          <h1>{formatBold(item.answer)}</h1>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messageEndRef} />
                </div>
                <div className="input">
                  <div className="input-user">
                    <form onSubmit={handleChatbotV2}>
                      <input type="text" name='question' id='questionv2' placeholder={LANGUAGES.messages[language].secondinput} onChange={e => setQuestion(e.target.value)} required disabled={isActive} />
                      {isRunning ? count : <FontAwesomeIcon icon={faPaperPlane} className='fa-input-user' />}
                    </form>
                  </div>
                  <p>{LANGUAGES.messages[language].warndpu}</p>
                </div>
                <div className="warn-mode" style={warn_mode_ls ? { display: "none" } : { display: "flex" }}>
                  <div className="content-warn-mode">
                    <h1>{LANGUAGES.messages[language].warnmode}</h1>
                    <div className="btn-accept">
                      <button onClick={() => { localStorage.setItem("warn_mode", true); setWarnMode(true) }}>Accept</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="chatbot">
            <div className="setting-mode">
              <div className="select-mode">
                <h1>{LANGUAGES.messages[language].selectmode}</h1>
                <div className="mode">
                  <button onClick={() => selectMode("advice")} style={isActive ? THEMES[theme].loader : null} >🌱 {LANGUAGES.messages[language].advice}</button>
                  {status_ls == "view" ? <button className='just_venting' onClick={() => setWarn(true)} >🤍 {LANGUAGES.messages[language].justventing}</button> : <button onClick={() => selectMode("just_venting")}>🤍 {LANGUAGES.messages[language].justventing}</button>}
                  <p style={warn ? { display: "block" } : { display: "none" }} onClick={() => navigate("/authentication")}>{LANGUAGES.messages[language].plaseauth}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="aboutus" onClick={() => nextPage(status_ls, "aboutus")}>
          <h1>{time.toDateString()}</h1>
        </div>
        <div className="chat-history" id='chat-history'>
          {section.length <= 0 ? <h1>{LANGUAGES.messages[language].nochat}</h1> : (
            <div className="chat-history-container">
              <div className="new-chat">
                <button style={isActive ? { cursor: "not-allowed" } : { cursor: "pointer" }} disabled={isActive} onClick={() => create_section(data.user_id)} >{LANGUAGES.messages[language].newchat}</button>
              </div>
              <div className="historys">
                {section.map((item, idx) => {
                  return (
                    <div className="history" key={idx} style={current_section_ls == item._id ? THEMES[theme].background : null} onClick={() => selectSection(item._id)} >
                      <p>{item.time}</p>
                      <FontAwesomeIcon icon={faTrash} className='fa-delete-section' onClick={() => delete_section(item._id)} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        <div className="setting" onClick={() => nextPage(status_ls, "setting")}>
          <h2>{status_ls == "view" || status_ls == null ? LANGUAGES.messages[language].signup : LANGUAGES.messages[language].setting}</h2>
        </div>
        <div className="exit" onClick={() => nextPage(status_ls, "exit")}>
          <h2>{status_ls == "view" || status_ls == null ? LANGUAGES.messages[language].signin : LANGUAGES.messages[language].exit}</h2>
        </div>
      </div>
      <div className="setting-full" style={settingFull ? { display: "flex" } : { display: "none" }}>
        <div className="content-setting-full" style={LANGUAGES.fontFamily[language]}>
          <div className="nav-menu-left" id='nav-menu-left'>
            <div className="title-menu">
              <div className='title' onClick={navMenuFull}>
                <FontAwesomeIcon icon={faGear} className='fa-icon-setting' />
                <h1>{LANGUAGES.messages[language].setting}</h1>
              </div>
              <FontAwesomeIcon icon={faBars} className='fa-setting-out' onClick={navMenuFull} />
            </div>
            <div className="theme-setting" style={currentSetting.theme ? { backgroundColor: "rgba(0, 0, 0, 0.4)" } : null} onClick={() => setCurrentSetting({ theme: true, language: false, audio: false })}>
              <FontAwesomeIcon icon={faPalette} className='fa-icon-setting' />
              <h1>{LANGUAGES.messages[language].theme}</h1>
            </div>
            <div className="language-setting" style={currentSetting.language ? { backgroundColor: "rgba(0, 0, 0, 0.4)" } : null} onClick={() => setCurrentSetting({ theme: false, language: true, audio: false })}>
              <FontAwesomeIcon icon={faLanguage} className='fa-icon-setting' />
              <h1>{LANGUAGES.messages[language].language}</h1>
            </div>
            <div className="aduio-setting" style={currentSetting.audio ? { backgroundColor: "rgba(0, 0, 0, 0.4)" } : null} onClick={() => setCurrentSetting({ theme: false, language: false, audio: true })}>
              <FontAwesomeIcon icon={volume == 0 ? faVolumeXmark : faVolumeHigh} className='fa-icon-setting' />
              <h1>{LANGUAGES.messages[language].audio}</h1>
            </div>
            <div className="empty">
              <div className="restore" onClick={() => restore()}>
                <FontAwesomeIcon icon={faRepeat} className='fa-icon-setting' />
                <h1>{LANGUAGES.messages[language].restore}</h1>
              </div>
              <div className="backward" onClick={() => setSettingFull(false)}>
                <FontAwesomeIcon icon={faRightFromBracket} className='fa-icon-setting' />
                <h1>{LANGUAGES.messages[language].exit}</h1>
              </div>
            </div>
          </div>
          <div className="content-menu-right" id='content-menu-right'>
            <div className="theme-setting-right" style={currentSetting.theme ? { display: "block" } : { display: "none" }}>
              <div className="themes">
                {themeData.map((item, idx) => {
                  return (
                    <div className="block-theme" key={idx} style={item.background} onClick={() => { setTheme(item.name), localStorage.setItem("theme", item.name) }}>
                      <h1>{item.name} {theme == item.name ? "(used)" : null}</h1>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="language-setting-right" style={currentSetting.language ? { display: "block" } : { display: "none" }}>
              <button onClick={() => { setLanguage("th"); localStorage.setItem("language", "th") }}>Thai {language == "th" ? "(used)" : null}</button> <br />
              <button onClick={() => { setLanguage("en"); localStorage.setItem("language", "en") }}>English {language == "en" ? "(used)" : null}</button>
            </div>
            <div className="audio-setting-right" style={currentSetting.audio ? { display: "flex" } : { display: "none" }} >
              <input type="range" defaultValue={50} min={0} max={100} onChange={e => setVolume(e.target.value / 100)} />
              <FontAwesomeIcon icon={statePlay ? faPause : faPlay} onClick={playOnOff} className='fa-test-music' />
            </div>
          </div>
        </div>
      </div>
      <div className="app-moblie" style={appMoblie ? { display: "flex" } : { display: "none" }} onClick={() => setAppMoblie(false)}>
        <div className="content-app" style={LANGUAGES.fontFamily[language]}>
          <FontAwesomeIcon icon={faBars} onClick={() => setAppMoblie(false)} />
          <div className="block-signin" style={status_ls == "view" ? { display: "block" } : { display: "none" }} onClick={() => nextPage(status_ls, "exit")}>
            <h1>{LANGUAGES.messages[language].signin}</h1>
          </div>
          <div className="block-signup" style={status_ls == "view" ? { display: "block" } : { display: "none" }} onClick={() => nextPage(status_ls, "setting")}>
            <h1>{LANGUAGES.messages[language].signup}</h1>
          </div>
          <div className="block-history" style={section.length <= 0 ? { display: "none" } : { display: "block" }} onClick={() => setChatHistory(true)}>
            <FontAwesomeIcon icon={faComment} />
            <h1>{LANGUAGES.messages[language].chathistory}</h1>
          </div>
          <div className="block-setting" onClick={() => setSettingFull(true)}>
            <FontAwesomeIcon icon={faGear} />
            <h1>{LANGUAGES.messages[language].setting}</h1>
          </div>
          <div className="block-exit" style={status_ls == "view" ? { display: "none" } : { display: "block" }} onClick={() => logOut()} >
            <FontAwesomeIcon icon={faRightFromBracket} />
            <h1>{LANGUAGES.messages[language].logout}</h1>
          </div>
        </div>
      </div>
      <div className="app-history" style={chatHistory ? { display: "flex" } : { display: "none" }} onClick={() => setChatHistory(false)} >
        <div className="content-history" style={LANGUAGES.fontFamily[language]}>
          <div className="title-history">
            <h1>{LANGUAGES.messages[language].chathistory}</h1>
            <FontAwesomeIcon icon={faRightFromBracket} onClick={() => setChatHistory(false)} />
          </div>
          <div className="list-history">
            {
              section.map((item, idx) => {
                return (
                  <div className="block-history" style={current_section_ls == item._id ? THEMES[theme].background : null} key={idx} onClick={() => selectSection(item._id)}>
                    <h1>{item.time}</h1>
                    <FontAwesomeIcon icon={faTrash} onClick={() => delete_section(item._id)} />
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      <Toast data={toast} />
    </div>
  )
}

export default App
