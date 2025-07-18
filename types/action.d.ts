interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
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
