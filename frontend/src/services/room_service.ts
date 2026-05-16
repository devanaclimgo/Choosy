import { api } from "./api";

export async function createRoom() {
  const response = await api.post("/rooms");

  return response.data;
}

export async function getRoom(code: string) {
  const response = await api.get(`/rooms/${code}`);

  return response.data;
}

export async function joinRoom(
  code: string,
  name: string
) {
  const response = await api.post(
    `/rooms/${code}/join`,
    { name }
  );

  return response.data;
}

export async function startVoting(code: string) {
  const response = await api.post(
    `/rooms/${code}/start`
  );

  return response.data;
}

export async function getResults(code: string) {
  const response = await api.get(
    `/rooms/${code}/results`
  );

  return response.data;
}