import userLogin from "@/libs/userLogin"
import NextAuth, { SessionStrategy } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        if(!credentials) return null
        
        const user=await userLogin(credentials.email,credentials.password)
        console.log("USER",user)
        // If no error and we have user data, return it
        if (user) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
  ],
  session: {
    strategy:"jwt" as SessionStrategy
  },
  callbacks:{
    async jwt({token, user} : {token : any, user : any}){
      // console.log("user:",user)
        if(user){
            token.id = user.data._id
            token.token = user.token
            token.name= user.data.name
            token.isOn=user.data.isOn
        }
        return token;
    },
    async session({session, token}  : {token : any, session : any}){
        if(token){
            session.user.id = token.id as string;
            session.user.name = token.name;
            session.user.token = token.token   
            session.user.isOn= token.isOn 
        }
        return session
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return baseUrl
    },
    async signIn({ user }: { user: any }){
        if(!user){
            return false
        }
        return true
    }
   
  },
  pages: {
    signIn: "/auth/signIn",
  }
  
}
const handler= NextAuth(authOptions)
export {handler as GET, handler as POST}