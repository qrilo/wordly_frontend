import axios from 'axios';
import tokenService from './services/tokenService';

const instance = axios.create({
    baseURL: 'https://localhost:5001/api/v1',
});

const sendPostRequest = async (url, model, isAnonymous = false) => {
    try {
        const headers = await getHeaders(isAnonymous);
        const response = await instance.post(url, model, { headers });
        return new HandledResult(response.data, response.status, null);
    } catch (error) {
        return handleFailedResponse(error);
    }
}

const sendGetRequest = async (url, queryValues, isAnonymous = false) => {
    const urlWithParams = url + '?' + new URLSearchParams(queryValues);

    try {
        const headers = await getHeaders(isAnonymous);
        const response = await instance.get(urlWithParams, { headers });
        return new HandledResult(response.data, response.status, null);
    } catch (error) {
        return handleFailedResponse(error);
    }
}

const sendPutRequest = async (url, request, isAnonymous = false) => {
    try {
        const headers = await getHeaders(isAnonymous);
        const response = await instance.put(url, request, { headers });

        return new HandledResult(response.data, response.status, null);
    }
    catch (error) {
        return handleFailedResponse(error);
    }
}
const sendDeleteRequest = async (url, queryValues, isAnonymous = false) => {
    const urlWithParams = url + '?' + new URLSearchParams(queryValues);

    try {
        const headers = await getHeaders(isAnonymous);
        const response = await instance.delete(urlWithParams, { headers });

        return new HandledResult(response.data, response.status, null);
    }
    catch (error) {
        return handleFailedResponse(error);
    }
}

const getHeaders = async (isAnonymous) => {
    return isAnonymous
        ? {}
        : { Authorization: "Bearer " + await tokenService.getAccessToken() };
}

/* instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            try {
                await tokenService.tryRefreshToken();

                const originalRequest = error.config;
                originalRequest.headers['Authorization'] = "Bearer " + localStorage.getItem("access");
                const updated = await instance.request(originalRequest);
                return updated;
            } catch (refreshError) {
                resetLocalStorage();
            }
        }

        return Promise.reject(error);
    }
);*/

function handleFailedResponse(error) {
    if (error.response != null) {
        if (error.response.status == BadRequest ||
            error.response.status == NotFound) {

            return new HandledResult(null, error.response.status, error.response.data.errorType, error.response.data.errors, error.response.data.exceptionMessage);
        }

        return new HandledResult(null, error.response.code, []);
    }

    console.error("Error occurred while request. Details: " + error);
    return null;
}


var HandledResult = function (data, code, errorType, errors, exceptionMessage) {
    this.data = data;
    this.errorType = errorType ?? null;
    this.errors = errors ?? [];
    this.exceptionMessage = exceptionMessage ?? null;
    this.isSuccessed = SuccessCodes.includes(code);
    this.isBadRequest = (code == BadRequest);
    this.isNotFound = (code == NotFound);
    this.isInternalServerError = (code == InternalServerError);
    this.code = code;
};

const Ok = 200;
const Created = 201;
const NoContent = 204;
const BadRequest = 400;
const NotFound = 404;
const InternalServerError = 500;

const SuccessCodes = [Ok, Created, NoContent];

export default { instance, sendPostRequest, sendGetRequest, sendPutRequest, sendDeleteRequest };