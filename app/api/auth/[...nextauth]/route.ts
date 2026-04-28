import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import KakaoProvider from "next-auth/providers/kakao"
import { SupabaseAdapter } from "@auth/supabase-adapter"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.kakao_account?.profile?.nickname || profile.properties?.nickname,
          email: profile.kakao_account?.email,
          image: profile.kakao_account?.profile?.profile_image_url || profile.properties?.profile_image,
        }
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    schema: "public",
  } as any),
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/shop', // Redirect to shop for sign in modal
  },
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST }
