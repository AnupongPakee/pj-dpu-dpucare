import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPalette, faForwardFast, faPlay, faPause,
  faBars, faVolumeHigh, faTrash, faExpand,
  faPaperPlane, faRightFromBracket,
  faPlug, faXmark, faGear, faLanguage,
  faRepeat, faVolumeXmark, faFlag, faPenToSquare,
  faPlus, faInfo, faCheck
} from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"

import {
  protected_, logout, testChatbot, getUser,
  getChatbotConfig, getCountAllUser, getReport, deleteReport,
  deleteSectionNonUser, getSectionTemplate, getVersion,
  updateTemplate, createHistoryTemplate, createSectionTemplate,
  updateSelectMain, updateSelectSecondery, deleteHistoryTemplate,
  deleteSectionTemplate, testConnect
} from "../../api/api"

import LANGUAGES from "../../Languages.json"
import THEMES from "../../Themes.json"
import THEMESDATA from "../../ThemesData.json"
import Toast from '../Toast';

import music_1 from "/music/piano-solo-334668.mp3"
import music_2 from "/music/piano-solo-337597.mp3"
import music_3 from "/music/sad-piano-song-335357.mp3"
import music_4 from "/music/melancholic-piano-music-337918.mp3"
import music_5 from "/music/piano-solo-334664.mp3"
import music_6 from "/music/meditation-music-334817.mp3"

const Admin = () => {
  const [data, setData] = useState({})
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [statePlay, setStatePlay] = useState(false)
  const [staeOnOff, setStateOnOff] = useState(0);
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageMode, setMessageMode] = useState([]);
  const [question, setQuestion] = useState("");
  const [settingFull, setSettingFull] = useState(false)
  const [volume, setVolume] = useState(0.4)
  const [navState, setNavState] = useState(0)
  const [appMoblie, setAppMoblie] = useState(false)
  const [currentCountAllUser, setCurrntCountAllUser] = useState({})
  const [report, setReport] = useState([])
  const [reportStyle, setReportStyle] = useState(false)
  const [reportStyleOne, setReportStyleOne] = useState(false)
  const [viewOneReport, setViewOneReport] = useState({})
  const [themeData] = useState(THEMESDATA)
  const [stateTheme, setStateTheme] = useState(0)
  const [stateLanguage, setStateLanguage] = useState(0)
  const [stateSelect, setStateSelect] = useState(false)
  const [sectionTemplatem, setSectionTemplate] = useState([])
  const [versionTemplate, setVersionTemplate] = useState([])
  const [stateVersion, setStateVersion] = useState(false)
  const [stateSelectOF, setStateSelectOF] = useState(0)
  const [stateVersionOF, setStateVersionOF] = useState(0)
  const [stateSOF, setStateSOF] = useState(true)
  const [stateVOF, setStateVOF] = useState(true)
  const [newVersion, setNewVersion] = useState(false)
  const [template, setTemplate] = useState({})
  const [viewTemplate, setViewTemplate] = useState({})
  const [viewVersion, setViewVersion] = useState({})
  const [stateNewSec, setStateNewSec] = useState(false)
  const [nameSec, setNameSec] = useState("")
  const [stateSelc, setStateSelc] = useState(false)
  const [stateFullSelc, setStateFullSelc] = useState(0)
  const [stateFullTem, setStateFullTem] = useState(false)
  const [chatbotConfig, setChatbotConfig] = useState({
    total_tokens: 0,
    select_main: "",
    select_secondery: ""
  })
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
  const status_ls = localStorage.getItem("status")
  const mode_ls = localStorage.getItem("mode")
  const status_mode_ls = localStorage.getItem("status_mode")
  const first_reload_ls = localStorage.getItem("first_reload")
  const warn_mode_ls = localStorage.getItem("warn_mode")
  const current_template_ls = localStorage.getItem("current_template")
  const current_uuid_ls = localStorage.getItem("current_uuid")
  const cureent_section_tem_ls = localStorage.getItem("current_sec_tem")
  const current_sec_tem_name_ls = localStorage.getItem("current_sec_tem_name")
  const current_version_ls = localStorage.getItem("current_version")
  const current_history_tem_ls = localStorage.getItem("current_history_tem")
  const current_name_tem_ls = localStorage.getItem("current_name_tem")
  const current_history_ls = localStorage.getItem("current_history_id")

  const [firstMode, setFirstMode] = useState(status_mode_ls ? status_mode_ls : false)
  const [stateMode, setStateMode] = useState(mode_ls ? mode_ls : "advice")
  const [platform, setPlatform] = useState(platform_ls ? platform_ls : "window")
  const [language, setLanguage] = useState(language_ls ? language_ls : "th")
  const [theme, setTheme] = useState(theme_ls ? theme_ls : "default")
  const [warnMode, setWarnMode] = useState(warn_mode_ls ? warn_mode_ls : false)
  const [currentHisTem, setCurrentHisTem] = useState(current_history_tem_ls != undefined ? current_history_tem_ls : "Empty")

  const audioRef = useRef(null);
  const messageEndRef = useRef(null);
  const timesmp = Date()
  const navigate = useNavigate()

  const songs = [
    music_1,
    music_2,
    music_3,
    music_4,
    music_5,
    music_6
  ];

  useEffect(() => {
    if (status_ls == null | undefined | "view") {
      navigate("/authentication")
      return;
    }
    testConnect()
      .then(_ => {
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
                "timestamp": timesmp,
                "title": err.response.statusText,
                "description": err.stack,
                "status": err.status
              }
            })
            handleTime(10500)
            return;
          })
        if (status_ls == "login") {
          getUser()
            .then(res => {
              setData(res.data)
              get_chatbot_config(res.data.user_id)
              get_report(res.data.user_id)
              get_count_user(res.data.user_id)
              get_section_template()
              get_version(cureent_section_tem_ls)
              if (!first_reload_ls) {
                localStorage.setItem("first_reload", true)
                localStorage.setItem("current_uuid", uuidv4())
                window.location.reload()
              }
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
                  "user_id": "admin",
                  "timestamp": timesmp,
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
                localStorage.setItem("status", "login");
                return;
              })
              .catch(err => {
                console.log(err)
                localStorage.setItem("status", "view")
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
          navigate("/authentication")
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
  }, [messages, messageMode])

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
      return
    }
  }, [])

  const handleChangeTemplate = e => {
    setTemplate({
      ...template,
      [e.target.name]: e.target.value
    })
  }

  const handleTime = (second) => {
    setTimeout(() => {
      setToast({ "show": false })
    }, second);
  }

  const scrollToBottom = () => messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })

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
    setCurrentSongIndex((prev) => {
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
      } if (page == "aboutus") {
        console.log("wait aboutus");
        return;
      }
    } else {
      if (page == "setting") {
        setSettingFull(true)
        return;
      } if (page == "exit") {
        logOut()
        return;
      } if (page == "aboutus") {
        console.log("wait aboutus");
        return;
      }
    }
  }

  const select_section = (id, idx) => {
    localStorage.setItem("current_sec_tem", id)
    localStorage.setItem("current_sec_tem_name", viewTemplate[idx].name)
    get_version(id)
    setStateSelect(false)
    return
  }

  const select_version = (id, idx) => {
    setCurrentHisTem(viewVersion[idx].template)
    localStorage.setItem("current_version", id)
    localStorage.setItem("current_name_tem", viewVersion[idx].name)
    localStorage.setItem("current_history_tem", viewVersion[idx].template)
    localStorage.setItem("current_history_id", idx)
    setStateVersion(false)
    get_version(id)
    window.location.reload()
    return
  }

  const onOffSection = () => {
    setStateSelectOF(prev => {
      const newState = prev + 1
      if (newState === 1) {
        setStateSelect(true)
        setStateVOF(false)
      } if (newState === 2) {
        setStateSelect(false)
        setStateVOF(true)
        return 0;
      }
      return newState
    })
  }

  const onOffVersion = () => {
    setStateVersionOF(prev => {
      const newState = prev + 1
      if (newState === 1) {
        setStateVersion(true)
        setStateSOF(false)
      } if (newState === 2) {
        setStateVersion(false)
        setStateSOF(true)
        return 0;
      }
      return newState
    })
  }

  const selectMode = mode => {
    localStorage.setItem("status_mode", true)
    localStorage.setItem("mode", mode)
    setStateMode(mode)
    setFirstMode(true)
    return;
  }

  const get_section_template = () => {
    getSectionTemplate()
      .then(res => {
        setSectionTemplate(res.data)
        setViewTemplate(res.data)
        if (cureent_section_tem_ls != undefined) {
          return
        } else {
          localStorage.setItem("current_sec_tem", res.data[0]._id)
          localStorage.setItem("current_sec_tem_name", res.data[0].name)
          return;
        }
      })
      .catch(err => console.log(err))
  }

  const get_version = id => {
    getVersion(id)
      .then(res => {
        setVersionTemplate(res.data)
        setViewVersion(res.data)
        if (current_version_ls != undefined) {
          localStorage.setItem("current_version", res.data[current_history_ls]._id)
          localStorage.setItem("current_name_tem", res.data[current_history_ls].name)
          localStorage.setItem("current_history_tem", res.data[current_history_ls].template)
          setCurrentHisTem(res.data[current_history_ls].template)
          return
        } else {
          localStorage.setItem("current_version", res.data[0]._id)
          localStorage.setItem("current_name_tem", res.data[0].name)
          localStorage.setItem("current_history_tem", res.data[0].template)
          setCurrentHisTem(res.data[0].template)
          return
        }
      })
      .catch(err => console.log(err))
  }

  const delete_history_template = () => {
    deleteHistoryTemplate(current_version_ls)
      .then(_ => {
        localStorage.removeItem("current_version")
        localStorage.removeItem("current_name_tem")
        localStorage.removeItem("current_history_tem")
        window.location.reload()
        return;
      })
      .catch(err => {
        console.log(err)
        if (err.response.data.detail == "not allowed delete") {
          setToast({
            show: true,
            text: "This is template usely",
            duration: 5000,
            status: "error",
            icon: faXmark
          })
          handleTime(5500)
        }
        return;
      })
  }

  const delete_section_template = (id) => {
    deleteSectionTemplate(id)
      .then(_ => {
        localStorage.removeItem("current_sec_tem")
        localStorage.removeItem("current_sec_tem_name")
        localStorage.removeItem("current_version")
        localStorage.removeItem("current_name_tem")
        localStorage.removeItem("current_history_tem")
        window.location.reload()
        return;
      })
      .catch(err => {
        console.log(err)
        if (err.response.data.detail == "not allowed delete") {
          setToast({
            show: true,
            text: "This is template usely",
            duration: 5000,
            status: "error",
            icon: faXmark
          })
          handleTime(5500)
        }
        return;
      })
  }

  const create_section_template = () => {
    createSectionTemplate({ "name": nameSec })
      .then(_ => {
        window.location.reload()
        return;
      })
      .catch(err => console.log(err))
  }

  const create_history_template = e => {
    e.preventDefault()
    createHistoryTemplate(cureent_section_tem_ls, template)
      .then(_ => {
        get_version(cureent_section_tem_ls)
        window.location.reload()
        return;
      })
      .catch(err => console.log(err))
  }

  const get_report = id => {
    getReport(id)
      .then(res => {
        setReport(res.data)
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
            "user_id": "admin",
            "timestamp": timesmp,
            "title": err.response.statusText,
            "description": err.stack,
            "status": err.status
          }
        })
        handleTime(10500)
        return;
      })
  }

  const view_one_report = idx => {
    setViewOneReport({
      _id: report[idx]._id,
      index: idx,
      user_id: report[idx].user_id,
      title: report[idx].title,
      status: report[idx].status,
      timestamp: report[idx].timestamp,
      description: report[idx].description
    })
    setReportStyleOne(true)
    return;
  }

  const get_count_user = id => {
    getCountAllUser(id)
      .then(res => {
        setCurrntCountAllUser(res.data)
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
            "user_id": "admin",
            "timestamp": timesmp,
            "title": err.response.statusText,
            "description": err.stack,
            "status": err.status
          }
        })
        handleTime(10500)
        return;
      })
  }

  const get_chatbot_config = id => {
    getChatbotConfig(id)
      .then(res => {
        setChatbotConfig(res.data)
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
            "user_id": "admin",
            "timestamp": timesmp,
            "title": err.response.statusText,
            "description": err.stack,
            "status": err.status
          }
        })
        handleTime(10500)
        return;
      })
  }

  const delete_report = id => {
    deleteReport(data.user_id, id)
      .then(_ => {
        window.location.reload()
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
            "user_id": "admin",
            "timestamp": timesmp,
            "title": err.response.statusText,
            "description": err.stack,
            "status": err.status
          }
        })
        handleTime(10500)
        return;
      })
  }

  const delete_section = () => {
    deleteSectionNonUser(current_uuid_ls)
      .then(_ => {
        localStorage.removeItem("status_mode")
        localStorage.removeItem("mode")
        window.location.reload()
        return;
      })
      .catch(err => {
        console.log(err);
      })
  }

  const handleChatbot = e => {
    e.preventDefault()
    setIsActive(true)
    setIsRunning(true)
    if (mode_ls == "advice") {
      const text = document.getElementById("question")
      text.value = "";
      setMessages([...messages, { question, answer: LANGUAGES.messages[language].typeing }])
      testChatbot(data.user_id, current_uuid_ls, { human: question, mode: mode_ls })
        .then(res => {
          setMessages([...messages, {
            question,
            answer: res.data.answer
          }])
          setIsActive(false)
          setIsRunning(false)
          setCount(0)
          get_chatbot_config(data.user_id)
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
              "user_id": "admin",
              "timestamp": timesmp,
              "title": err.response.statusText,
              "description": err.stack,
              "status": err.status
            }
          })
          handleTime(10500)
          return;
        })
    } if (mode_ls == "just_venting") {
      const text = document.getElementById("questionv2")
      text.value = "";
      setMessageMode([...messageMode, {
        question,
        answer: ""
      }])
      testChatbot(data.user_id, current_uuid_ls, { human: question, mode: mode_ls })
        .then(res => {
          setMessageMode([...messageMode, {
            question,
            answer: res.data.answer
          }])
          get_chatbot_config(data.user_id)
          setIsActive(false)
          setIsRunning(false)
          setCount(0)
          return;
        })
        .catch(err => {
          setMessageMode([...messages, { question, answer: LANGUAGES.messages[language].warnchat }])
          console.log(err);
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
              "user_id": "admin",
              "timestamp": timesmp,
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

  const handleUpdateTemplate = e => {
    e.preventDefault()    
    updateTemplate(current_version_ls, {"template" : template})
      .then(_ => {
        setCurrentHisTem(template.template)
        localStorage.setItem("current_history_tem", template.template)
        window.location.reload()
        return
      })
      .catch(err => console.log(err))
  }

  const handleUpdateSelect = mode => {
    if (mode == "Intelligent_Advisor") {
      updateSelectMain(data.user_id, { "select_main": current_version_ls })
        .then(_ => {
          window.location.reload()
          return;
        })
        .catch(err => console.log(err))
    }
    if (mode == "Just_Venting") {
      updateSelectSecondery(data.user_id, { "select_secondery": current_version_ls })
        .then(_ => {
          window.location.reload()
          return;
        })
        .catch(err => console.log(err))
    }
  }

  const logOut = () => {
    logout()
      .then(_ => {
        deleteSectionNonUser(current_uuid_ls)
          .then(_ => {
            setFirstMode(false)
            localStorage.removeItem("first_reload")
            localStorage.removeItem("current_template")
            localStorage.removeItem("current_section")
            localStorage.removeItem("current_sec_tem")
            localStorage.removeItem("current_sec_tem_name")
            localStorage.removeItem("current_version")
            localStorage.removeItem("current_name_tem")
            localStorage.removeItem("current_history_tem")
            localStorage.setItem("status", "view")
            navigate("/authentication")
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
                "user_id": "admin",
                "timestamp": timesmp,
                "title": err.response.statusText,
                "description": err.stack,
                "status": err.status
              }
            })
            handleTime(10500)
            return;
          })
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
            "user_id": "admin",
            "timestamp": timesmp,
            "title": err.response.statusText,
            "description": err.stack,
            "status": err.status
          }
        })
        handleTime(10500)
        return;
      })
    return;
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

  const fullSelect = () => {
    const dt = document.getElementById("dt")
    const logo = document.getElementById("logo")
    const abt = document.getElementById("abt")
    const st = document.getElementById("st")
    const et = document.getElementById("et")
    const mini_menu = document.getElementById("mini-menu")
    const chat_history = document.getElementById("chat-history")

    setStateFullSelc(prev => {
      const newState = prev + 1
      if (newState === 1) {
        dt.style.display = "none"
        logo.style.display = "none"
        abt.style.display = "none"
        st.style.display = "none"
        et.style.display = "none"
        mini_menu.style.display = "none"
        chat_history.style.gridColumn = "1 / 2 span"
        chat_history.style.gridRow = "1 / 5 span"
      } if (newState === 2) {
        dt.style.display = "block"
        logo.style.display = "block"
        abt.style.display = "block"
        st.style.display = "block"
        et.style.display = "block"
        mini_menu.style.display = "flex"
        chat_history.style.gridColumn = "2"
        chat_history.style.gridRow = "2 / 4 span"
        return 0
      }
      return newState
    })

  }

  return (
    <div className='app admin' style={THEMES[theme].background}>
      <div className="block-blur"></div>
      <div className="content-app" style={LANGUAGES.fontFamily[language]}>
        <div className="date-time" id='dt'>
          {platform == "phone" ? (
            <div className='date-menu'>
              <h1 onClick={changeLanguages}>{language == "th" ? "EN" : "TH"}</h1>
              <FontAwesomeIcon icon={faPalette} className='fa-mini-menu' onClick={() => changeThemes()} />
              <FontAwesomeIcon icon={faForwardFast} className='fa-mini-menu' onClick={changeMusic} />
              <audio style={{ display: "none" }} src={songs[currentSongIndex]} ref={audioRef} controls loop></audio>
              <FontAwesomeIcon icon={statePlay ? faPause : faPlay} className='fa-mini-menu' onClick={playOnOff} />
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }} onClick={() => setReportStyle(true)}>
              <h2>Report</h2>
              <h3>{report.length}</h3>
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
            </div>}
        </div>
        <div className="logo" id='logo'>
          <h2>{LANGUAGES.messages[language].member}</h2>
          <h1>{currentCountAllUser.total_user}</h1>
        </div>
        {firstMode ? (
          <div className="chatbot" id='chatbot'>
            {status_ls == "view" ? (
              <div className='menu-mode-hidden'>
                <h1>{LANGUAGES.messages[language].limit}</h1>
              </div>
            ) : (
              <div className="menu-mode">
                <select name="mode" id="mode" defaultValue={stateMode} onChange={e => selectMode(e.target.value)}>
                  <option style={THEMES[theme].background} value="advice">🌱 {LANGUAGES.messages[language].advice}</option>
                  <option style={THEMES[theme].background} value="just_venting">🤍 {LANGUAGES.messages[language].justventing}</option>
                </select>
                <div className="mini-menu">
                  {mode_ls == "advice" ? null : <FontAwesomeIcon icon={faTrash} className='fa-mini' onClick={() => delete_section()} />}
                  <FontAwesomeIcon icon={faTrash} className='fa-mini' style={mode_ls == "advice" ? { display: "block" } : { display: "none" }} onClick={() => delete_section()} />
                  <FontAwesomeIcon style={platform == "phone" ? { display: "none" } : { display: "block" }} icon={faExpand} className='fa-mini' onClick={() => showOnOffChatHistory(platform)} />
                </div>
              </div>
            )}
            {stateMode == "advice" ? (
              <div className="chat">
                <div className="show-message">
                  <div className="ai-message">
                    <pre>{LANGUAGES.messages[language].firstchat}</pre>
                  </div>
                  {messages.map((item, idx) => {
                    return (
                      <div key={idx}>
                        <div className="human-message" style={item.question == "" ? { display: "none" } : { display: "block" }}>
                          <h1>{item.question}</h1>
                        </div>
                        <div className="ai-message">
                          <pre>{formatBold(item.answer)}</pre>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messageEndRef} />
                </div>
                <div className="input">
                  <div className="input-user">
                    <form style={isActive ? THEMES[theme].loader : null} onSubmit={handleChatbot}>
                      <input type="text" name='question' id='question' placeholder={LANGUAGES.messages[language].maininput} onChange={e => setQuestion(e.target.value)} required disabled={isActive} />
                      {isRunning ? count : <FontAwesomeIcon icon={faPaperPlane} className='fa-input-user' onClick={handleChatbot} />}
                    </form>
                    <p>{LANGUAGES.messages[language].warndpu}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="chat">
                <div className="show-message">
                  <div className="empty-space"></div>
                  {messageMode.map((item, idx) => {
                    return (
                      <div key={idx}>
                        <div className="human-message-mode-2" style={item.question == "" ? { display: "none" } : { display: "block" }}>
                          <h1>{item.question}</h1>
                        </div>
                        <div className="ai-message" style={item.answer == "" | "ค่าว่าง" ? { display: "none" } : { display: "block" }}>
                          <pre>{formatBold(item.answer)}</pre>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messageEndRef} />
                </div>
                <div className="input">
                  <div className="input-user">
                    <form style={isActive ? THEMES[theme].loader : null} onSubmit={handleChatbot}>
                      <input type="text" name='question' id='questionv2' placeholder={LANGUAGES.messages[language].secondinput} onChange={e => setQuestion(e.target.value)} required />
                      {isRunning ? count : <FontAwesomeIcon icon={faPaperPlane} className='fa-input-user' />}
                    </form>
                    <p>{LANGUAGES.messages[language].warndpu}</p>
                  </div>
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
                <h1>Select Mode</h1>
                <div className="mode">
                  <button onClick={() => selectMode("advice")} style={isActive ? THEMES[theme].loader : null} >🌱 {LANGUAGES.messages[language].advice}</button>
                  {status_ls == "view" ? <button className='just_venting' >🤍 {LANGUAGES.messages[language].justventing}</button> : <button onClick={() => selectMode("just_venting")}>🤍 {LANGUAGES.messages[language].justventing}</button>}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="aboutus" id='abt' onClick={() => nextPage(status_ls, "aboutus")}>
          <h2>Total Totokens</h2>
          <h1>{formatNumber(chatbotConfig.total_tokens)}</h1>
        </div>
        <div className="chat-history" id='chat-history'>
          <FontAwesomeIcon icon={faExpand} className='icon-full-selc' onClick={() => fullSelect()} />
          <div className="content-prompt-template">
            {sectionTemplatem.length > 0 ? (
              <div style={{ height: "100%" }}>
                <h2 className='h1-prompt'>Prompt Template</h2>
                <div className="empty"></div>
                <div className="name-template">
                  <div className="new-name-sec" onClick={() => setStateNewSec(true)}>New Session</div>
                  {sectionTemplatem.map((item, idx) => {
                    return (
                      <div className="name-sec" key={idx} onClick={() => { select_section(item._id, idx); setStateFullTem(true) }}>
                        <h2>{item.name}</h2>
                        <FontAwesomeIcon icon={faTrash} className='fa-icon-delete' style={{ cursor: "pointer" }} onClick={() => delete_section_template(item._id)} />
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="empty-section">
                <p className='warn-new-sec'>กรุณาสร้าง session สำหรับ template</p>
                <form onSubmit={create_section_template}>
                  <input type="text" name='name' placeholder='name session' onChange={e => setNameSec(e.target.value)} required />
                  <button type='submit'>Create</button>
                </form>
              </div>
            )}
            {
              versionTemplate.length > 0 ? (
                <div className="name-templates" style={stateFullTem ? { display: "block" } : { display: "none" }} >
                  <div className='select'>
                    <div>
                      <select name="verion" style={{ marginRight: "1rem" }} onChange={e => select_version(e.target.value, e.target.selectedIndex)} defaultValue={current_version_ls}>
                        {
                          versionTemplate.map((item, idx) => {
                            return (
                              <option key={idx} value={item._id}>{item.name}</option>
                            )
                          })
                        }
                      </select>
                      <FontAwesomeIcon style={{ cursor: "pointer" }} icon={faPlus} className='fa-icon-add' onClick={() => setNewVersion(true)} />
                      <FontAwesomeIcon style={{ cursor: "pointer", marginLeft: "1rem" }} icon={faTrash} className='fa-icon-delete' onClick={() => delete_history_template()} />
                      <FontAwesomeIcon style={{ cursor: "pointer", marginLeft: "1rem" }} icon={faRightFromBracket} onClick={() => setStateFullTem(false)} />
                    </div>
                    <button onClick={() => setStateSelc(true)}>Use</button>
                  </div>
                  <form onSubmit={handleUpdateTemplate}>
                    <textarea name="template" defaultValue={currentHisTem} onChange={e => setTemplate(e.target.value)}></textarea>
                    <button className='btn-update' type='submit'>Update</button>
                  </form>
                </div>
              ) : (
                <div className="empty-template">
                  <p>กรุณาสร้าง template สำหรับ session</p>
                  <form onSubmit={create_history_template}>
                    <input type="text" name='name' placeholder='name template' required onChange={e => handleChangeTemplate(e)} />
                    <textarea name="template" placeholder='prompt template' required onChange={e => handleChangeTemplate(e)}></textarea> <br />
                    <button type='submit'>Create</button>
                  </form>
                </div>
              )
            }
          </div>
          <div className="new-section-tem" style={stateNewSec ? { display: "flex" } : { display: "none" }}>
            <form onSubmit={create_section_template}>
              <input type="text" name='name' placeholder='name session' onChange={e => setNameSec(e.target.value)} />
              <div className="btn-s-c">
                <button style={{ marginRight: "1rem" }} type="reset" onClick={() => setStateNewSec(false)}>{LANGUAGES.messages[language].cancel}</button>
                <button type="submit">Create</button>
              </div>
            </form>
          </div>
          <div className="select-template-in" style={stateSelc ? { display: "block" } : { display: "none" }}>
            <div className="text">
              <h1>{current_sec_tem_name_ls}</h1>
              <div className="line-h"></div>
              <h1>{current_name_tem_ls}</h1>
            </div>
            <div className="pl-select">
              <p>โปรดเลือกโหมด</p>
              <div className="btn-m1-m2">
                <button onClick={() => handleUpdateSelect("Intelligent_Advisor")}>Intelligent Advisor</button> <br />
                <button onClick={() => handleUpdateSelect("Just_Venting")}>Just Venting</button> <br />
                <button onClick={() => setStateSelc(false)}>{LANGUAGES.messages[language].cancel}</button>
              </div>
            </div>
          </div>
        </div>
        <div id='st' className="setting" onClick={() => nextPage(status_ls, "setting")}>
          <h2>{status_ls == "view" || status_ls == null ? LANGUAGES.messages[language].signup : LANGUAGES.messages[language].setting}</h2>
        </div>
        <div id='et' className="exit" onClick={() => nextPage(status_ls, "exit")}>
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
          {
            report.length == 0 ? null : (
              <div className="block-report" onClick={() => setReportStyle(true)}>
                <FontAwesomeIcon icon={faFlag} />
                <h1>{LANGUAGES.messages[language].report}</h1>
              </div>
            )
          }
          <div className="block-template">
            <FontAwesomeIcon icon={faPenToSquare} />
            <h1>Prompt Template</h1>
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
      <div className="setting-full-prompt">
        <div className="content-setting-full-prompt" style={LANGUAGES.fontFamily[language]}>
          <h1>Setting Full Prompt</h1>
        </div>
      </div>
      <div className="new-version" style={newVersion ? { display: "flex" } : { display: "none" }}>
        <form onSubmit={create_history_template} style={LANGUAGES.fontFamily[language]}>
          <div className="btn-save-cel">
            <button onClick={() => setNewVersion(false)}>ยกเลิก</button>
            <button type="submit">ยืนยัน</button>
          </div>
          <div className="input-version">
            <label>Version Name: </label>
            <input type="text" name='name' placeholder='name' onChange={e => handleChangeTemplate(e)} />
          </div>
          <div className="input-version-template">
            <label style={{ marginRight: "0.4rem" }}>Prompt Template: </label>
            <textarea name="template" placeholder='Empty' onChange={e => handleChangeTemplate(e)}></textarea>
          </div>
        </form>
      </div>
      <div className="report" style={reportStyle ? { display: "flex" } : { display: "none" }}>
        <div className="content-report" style={LANGUAGES.fontFamily[language]}>
          <div className="report-title">
            <h1>{LANGUAGES.messages[language].report} ({report.length})</h1>
            <div className="icon-report">
              <FontAwesomeIcon icon={faXmark} className='fa-report' onClick={() => setReportStyle(false)} />
            </div>
          </div>
          {
            report.length == 0 ? (
              <div className="non-report">
                <h1>{LANGUAGES.messages[language].noreport}</h1>
              </div>
            ) : (
              <div className="detail-report" style={reportStyleOne ? { display: "none" } : null}>
                <table>
                  <thead>
                    <tr>
                      <th>{LANGUAGES.messages[language].count}</th>
                      <th>{LANGUAGES.messages[language].title}</th>
                      <th>{LANGUAGES.messages[language].status}</th>
                      <th>{LANGUAGES.messages[language].detail}</th>
                      <th style={platform == "phone" ? { display: "none" } : null}>{LANGUAGES.messages[language].bugfix}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      report.map((item, idx) => {
                        return (
                          <tr key={idx}>
                            <td>{idx}</td>
                            <td>{item.title}</td>
                            <td>{item.status}</td>
                            <td><button onClick={() => view_one_report(idx)}>{language_ls == "en" ? "View" : "ดู"}</button></td>
                            <td style={platform == "phone" ? { display: "none" } : null} ><button onClick={() => delete_report(item._id)}>{language_ls == "en" ? "fix" : "แก้ไข"}</button></td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            )
          }
          <div className="details" style={reportStyleOne ? { display: "block" } : { display: "none" }}>
            <div className="text-btn">
              <h1>{LANGUAGES.messages[language].count}: {viewOneReport.index}</h1>
              <div className="btn-report">
                <button onClick={() => setReportStyleOne(false)}>{LANGUAGES.messages[language].cancel}</button>
                <button onClick={() => delete_report(viewOneReport._id)}>{language_ls == "en" ? "fix" : "แก้ไข"}</button>
              </div>
            </div>
            <h1>User ID: {viewOneReport.user_id}</h1>
            <h1>{LANGUAGES.messages[language].title}: {viewOneReport.title}</h1>
            <h1>Timestamp: {viewOneReport.timestamp}</h1>
            <h1>{LANGUAGES.messages[language].status}: {viewOneReport.status}</h1>
            <div className="pre-text">
              <pre>{language_ls == "en" ? "Details" : "รายละเอียด"}: {viewOneReport.description}</pre>
            </div>
          </div>
        </div>
      </div>
      <Toast data={toast} />
    </div>
  )
}

export default Admin
