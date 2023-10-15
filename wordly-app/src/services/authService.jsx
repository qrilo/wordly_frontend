import api from "../api"
import tokenService from "./tokenService";

const signIn = async (model) => {
    const response = await api.sendPostRequest('auth/sign-in', model, true);
    if (response.isSuccessed) {
        tokenService.setTokens(response.data);
    }
    return response;
}

const logout = () => {
    tokenService.resetLocalStorage();
}

const signUp = async (model) => {
    const response = await api.sendPostRequest('auth/sign-up', model, true);

    return response;
}

export default {
    signIn,
    logout,
    signUp
}