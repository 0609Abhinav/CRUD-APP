
// import axios from "axios";

// const API_URL = "http://localhost:3000/api/users"; // Backend API

// // GET USERS with pagination, search, sort (matches SP parameter names)
// export const getUsers = ({
//   pageNumber = 1,
//   pageSize = 8,
//   searchTerm = "",
//   sortField = "id",
//   sortOrder = "DESC",
// } = {}) => {
//   return axios.get(API_URL, {
//     params: {
//       pageNumber,
//       pageSize,
//       searchTerm,
//       sortField,
//       sortOrder: sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC", // Ensure only ASC/DESC
//     },
//   });
// };

// // CRUD operations
// export const getUser = (id) => axios.get(`${API_URL}/${id}`);
// export const createUser = (data) => axios.post(API_URL, data);
// export const updateUser = (id, data) => axios.put(`${API_URL}/${id}`, data);
// export const deleteUser = (id) => axios.delete(`${API_URL}/${id}`);
// src/api.js
import axios from "axios";

// Set the base URL of your backend
const API_BASE_URL = "http://localhost:3000/api"; // Adjust if needed

// GET USERS with search, pagination, sorting
export const getUsers = async ({ pageNumber = 1, pageSize = 8, searchTerm = "", sortField = "id", sortOrder = "DESC" }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      params: {
        pageNumber,
        pageSize,
        searchTerm,
        sortField,
        sortOrder,
      },
    });
    return response;
  } catch (err) {
    console.error("Error in getUsers:", err);
    throw err;
  }
};

// CREATE USER
export const createUser = async ({ name, email }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, { name, email });
    return response.data;
  } catch (err) {
    console.error("Error in createUser:", err);
    throw err;
  }
};

// UPDATE USER
export const updateUser = async (id, { name, email }) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, { name, email });
    return response.data;
  } catch (err) {
    console.error("Error in updateUser:", err);
    throw err;
  }
};

// DELETE USER (soft delete)
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error in deleteUser:", err);
    throw err;
  }
};
