import api from '../api';
import constants from './../constants/localStorage';

const getAccessToken = async () => {
    const tokenExpireDateTime = localStorage.getItem(constants.AccessExpires);
    const currentDateTime = new Date().toISOString();

    if (new Date(tokenExpireDateTime) <= new Date(currentDateTime)) {
        await tryRefreshToken();
    }

    return localStorage.getItem(constants.Access);
}

const tryRefreshToken = async () => {
    const model = {
        accessToken: localStorage.getItem(constants.Access),
        refreshToken: localStorage.getItem(constants.Refresh)
    }

    const response = await api.sendPostRequest("/auth/refresh", model, true);

    if (response.isSuccessed) {
        localStorage.setItem(constants.Access, response.data.jwt.accessToken);
        localStorage.setItem(constants.AccessExpires, response.data.jwt.expiresAtUtc);

        localStorage.setItem(constants.Refresh, response.data.refreshToken.token);
        localStorage.setItem(constants.RefreshExpires, response.data.refreshToken.expiresAtUtc);
    } else {
        resetLocalStorage();
    }
}

const setTokens = (data) => {
    localStorage.setItem(constants.Access, data.jwt.accessToken);
    localStorage.setItem(constants.AccessExpires, data.jwt.expiresAtUtc);

    localStorage.setItem(constants.Refresh, data.refreshToken.token);
    localStorage.setItem(constants.RefreshExpires, data.refreshToken.expiresAtUtc);
}

const resetLocalStorage = () => {
    localStorage.removeItem(constants.Access);
    localStorage.removeItem(constants.AccessExpires);

    localStorage.removeItem(constants.Refresh);
    localStorage.removeItem(constants.RefreshExpires);
    window.location.reload();
}

const isLoggenIn = () => {
    const access = localStorage.getItem(constants.Access);
    const refresh = localStorage.getItem(constants.Refresh);

    if (access && refresh) {
        return true;
    }

    return false;
}

export default {
    getAccessToken,
    tryRefreshToken,
    resetLocalStorage,
    setTokens,
    isLoggenIn
}