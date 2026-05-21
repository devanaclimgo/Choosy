import { api } from "./api";

export async function createRoomRequest() {
  const response = await api.post("/rooms");

  return response.data;
}

export async function getRoomRequest(code: string) {
  const response = await api.get(`/rooms/${code}`);

  return response.data;
}

export async function joinRoomRequest(code: string, name: string) {
  const response = await api.post(`/rooms/${code}/join`, {
    name,
  });

  return response.data;
}

export async function startVotingRequest(code: string) {
  const response = await api.post(`/rooms/${code}/start`);

  return response.data;
}

export async function getResultsRequest(code: string) {
  const response = await api.get(`/rooms/${code}/results`);

  return response.data;
}