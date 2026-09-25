import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {

        if (error.response) {

            if (error.response.status === 401) {
                alert("Please login again");
            }

            else if (error.response.status === 403) {
                alert("You do not have permission");
            }

            else if (error.response.status === 400) {
                alert("Please check your input");
            }

            else if (error.response.status >= 500) {
                alert("Server error. Please try again later");
            }

        } else {

            alert("Network error. Please check your connection");

        }

        return Promise.reject(error);
    }
);

export default api;