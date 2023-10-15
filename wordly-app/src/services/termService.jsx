import api from "../api"

const getTerms = async (model) => {
    const response = await api.sendGetRequest('/terms', model);

    return response;
}

const createTerm = async (model) => {
    const response = await api.sendPostRequest('/terms', model);

    return response;
}

const removeTerms = async (model) => {
    const response = await api.sendPostRequest('/terms/delete', model);

    return response;
}

const updateTerm = async (id, model) => {
    const response = await api.sendPutRequest(`/terms/${id}`, model);

    return response;
}

const removeImageTerm = async (id) => {
    const response = await api.sendDeleteRequest(`/terms/${id}`);

    return response;
}

export default {
    getTerms,
    createTerm,
    removeTerms,
    updateTerm,
    removeImageTerm
}