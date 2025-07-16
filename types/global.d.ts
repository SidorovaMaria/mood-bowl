export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  status?: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  status?: number;
}
interface SignInWithOAuthParams {
  provider: "google";
  providerAccountId: string;
  user: {
    name: string;
    username: string;
    email: string;
    avatarURL: string;
  };
}
