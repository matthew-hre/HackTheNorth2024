import GitHub from "@auth/core/providers/github";
import Resend from "@auth/core/providers/resend";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub, Resend],
  jwt: {
    durationMs: 1000 * 60 * 60 * 24 * 2, // 2 days
  },
});
