
export interface FollowerUser {
  username: string;
  telegramId: string;
}

export interface Follower {
  id: string;
  userId: string;
  shopId: string;
  createdAt: string;
  user: FollowerUser;
}

export interface FollowersResponse {
  data: {
    followers: Follower[];
  };
  message: string;
}
export interface Activity {
    id: string;
    type: "follower" | "product";
    message: string;
    time: string;       // what you display like "Recently"
    timestamp?: number; // add this optional field for sorting
  }
