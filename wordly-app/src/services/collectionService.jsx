import api from "../api"

const createCollection = async (model) => {
    const response = await api.sendPostRequest('/collections', model);

    return response;
}

const getCollections = async (model) => {
    const response = await api.sendGetRequest('/collections', model);

    return response;
}

const getCollection = async (id) => {
    const response = await api.sendGetRequest(`/collections/${id}`);

    return response;
}

const updateCollection = async (id, model) => {
    const response = await api.sendPutRequest(`/collections/${id}`, model);

    return response;
}

const deleteCollection = async (id) => {
    const response = await api.sendDeleteRequest(`/collections/${id}`);

    return response;
}

const addTermsToCollection = async (id, model) => {
    const response = await api.sendPostRequest(`/collections/${id}/terms`, model);

    return response;
}

const deleteTermsFromCollection = async (id, model) => {
    const response = await api.sendPostRequest(`/collections/${id}/terms/delete`, model);

    return response;
}

const getCollectionsInfo = async () => {
    const response = await api.sendGetRequest('/collections/info');

    return response;
}

const searchCollection = async (model) => {
    const response = await api.sendGetRequest('/collections/search', model)

    return response;
}

const getTest = async (id, model) => {
    const response = await api.sendGetRequest(`/collections/${id}/test`, model);

    return response;
}

const submitTest = async (id, model) => {
    console.log(model);
    const response = await api.sendPostRequest(`/collections/${id}/test`, model);

    return response;
}


export default {
    createCollection,
    getCollections,
    getCollection,
    updateCollection,
    deleteCollection,
    addTermsToCollection,
    deleteTermsFromCollection,
    getCollectionsInfo,
    searchCollection,
    getTest,
    submitTest
}