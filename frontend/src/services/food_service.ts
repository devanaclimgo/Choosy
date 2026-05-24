import { api } from "./api"

export async function getFoodOptionsRequest() {
  const response = await api.get("/food_options")
  return response.data
}