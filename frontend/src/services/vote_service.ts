import { api } from "./api";

interface VotePayload {
  room_id: number;
  player_id: number;
  food_option_id: number;
  liked: boolean;
}

export async function createVote(
  payload: VotePayload
) {
  const response = await api.post(
    "/votes",
    {
      vote: payload,
    }
  );

  return response.data;
}