
import { Follower, FollowersResponse } from "../../types/data";
import { apiFetch } from "./client";

// GET followers by shopId
export async function getFollowers(shopId: string): Promise<Follower[]> {
  const response: FollowersResponse = await apiFetch(`/api/follow/${shopId}`);
  return response.data.followers;
}