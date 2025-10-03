import axios from "axios";

const API_URL = "http://localhost:3000/users";


export const getUsers = (fetchAll = false) => {
  const url = fetchAll ? `${API_URL}?all=true` : API_URL;
  return axios.get(url);
};

export const getUser = (id) => axios.get(`${API_URL}/${id}`);
export const createUser = (data) => axios.post(API_URL, data);
export const updateUser = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteUser = (id) => axios.delete(`${API_URL}/${id}`);
