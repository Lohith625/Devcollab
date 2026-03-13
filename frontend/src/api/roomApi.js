import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const joinRoom = (roomId, token) =>
  API.post(`/rooms/${roomId}/join`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });