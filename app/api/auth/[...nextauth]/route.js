import NextAuth from "next-auth";
import Github from "next-auth/providers/github";

export const authOptions = {
    // use the github provider for oauth and provide the required keys
    providers: [
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };