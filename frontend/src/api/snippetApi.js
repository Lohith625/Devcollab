import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const createSnippet = (data, token) =>
  API.post("/snippets", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getSnippets = async (roomId, token) => {
  return API.get(`/snippets/${roomId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
