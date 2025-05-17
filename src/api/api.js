import axios from "axios"

export const testConnect = async () => {
    return await axios.get("https://server-dp.onrender.com/test-connect")
}

export const protected_ = async () => {
    return await axios.get("https://server-dp.onrender.com/protected", {
        withCredentials: true
    })
}

export const sendEmail = async email => {
    return await axios.get("https://server-dp.onrender.com/send-email/" + email, {
        withCredentials: true
    })
}

export const register = async (vt, vc, data) => {
    await axios.post("https://server-dp.onrender.com/register/" + vt + "/" + vc, data, {
        withCredentials: true
    })
}

export const login = async data => {
    await axios.post("https://server-dp.onrender.com/login", data, {
        withCredentials: true
    })
}

export const logout = async () => {
    return await axios.get("https://server-dp.onrender.com/logout", {
        withCredentials: true
    })
}

export const getUser = async () => {
    return await axios.get("https://server-dp.onrender.com/get-user", {
        withCredentials: true
    })
}

export const forgotPass = async (vt, vc, data) => {
    await axios.put("https://server-dp.onrender.com/forgot-password/" + vt + "/" + vc, data, {
        withCredentials: true
    })
}

export const createSection = async id => {
    await axios.post("https://server-dp.onrender.com/section/" + id, {}, {
        withCredentials: true
    })
}

export const getSection = async id => {
    return await axios.get("https://server-dp.onrender.com/section/" + id, {
        withCredentials: true
    })
}

export const deleteSection = async id => {
    await axios.delete("https://server-dp.onrender.com/section/" + id, {
        withCredentials: true
    })
}

export const deleteSectionNonUser = async id => {
    await axios.delete("https://server-dp.onrender.com/section-non-user/" + id)
}

export const chatbot = async (id, data) => {
    return await axios.post("https://server-dp.onrender.com/main-chatbot/" + id, data, {
        withCredentials: true
    })
}

export const chatbotV2 = async (id, data) => {
    return await axios.post("https://server-dp.onrender.com/just-venting-chatbot/" + id, data, {
        withCredentials: true
    })
}

export const getHistory = async id => {
    return await axios.get("https://server-dp.onrender.com/history/" + id, {
        withCredentials: true
    })
}

export const chatbotNonUser = async (id, data) => {
    return await axios.post("https://server-dp.onrender.com/test-chatbot/" + id, data)
}

export const getChatbotConfig = async id => {
    return await axios.get("https://server-dp.onrender.com/chatbot-config/" + id, {
        withCredentials: true
    })
}

export const getCountAllUser = async id => {
    return await axios.get("https://server-dp.onrender.com/get-count-all-user/" + id, {
        withCredentials: true
    })
}

export const createRport = async data => {
    return await axios.post("https://server-dp.onrender.com/report", data)
}

export const getReport = async id => {
    return await axios.get("https://server-dp.onrender.com/report/" + id, {
        withCredentials: true
    })
}

export const deleteReport = async (id, report_id) => {
    await axios.delete("https://server-dp.onrender.com/report/" + id + "/" + report_id, {
        withCredentials: true
    })
}

export const testChatbot = async (id, section_id, data) => {
    return await axios.post("https://server-dp.onrender.com/test-main-chatbot/" + id + "/" + section_id, data, {
        withCredentials: true
    })
}

export const updateMainPrompt = async (id, data) => {
    await axios.put("https://server-dp.onrender.com/update-prompt-template/" + id, data, {
        withCredentials: true
    })
}

export const updateMainPromptJV = async (id, data) => {
    await axios.put("https://server-dp.onrender.com/update-prompt-justventing/" + id, data, {
        withCredentials: true
    })
}

export const updateMainPromptTS = async (id, data) => {
    await axios.put("https://server-dp.onrender.com/update-prompt-template-test/" + id, data, {
        withCredentials: true
    })
}

export const updateMainPromptJVTS = async (id, data) => {
    await axios.put("https://server-dp.onrender.com/update-prompt-justventing-test/" + id, data, {
        withCredentials: true
    })
}