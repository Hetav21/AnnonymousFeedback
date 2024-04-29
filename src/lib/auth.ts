import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import {NextAuthOptions} from 'next-auth';
import prisma from './dbConnect';

export const AUTH_OPTIONS: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req): Promise<any>{
                try{
                    const user = await prisma.user.findUnique({
                        // @ts-ignore
                        where: {
                            OR: [
                            {email: credentials?.email},
                            {username: credentials?.email}                            ]
                        }
                    })

                    if(!user){
                        throw new Error('No user found');
                    }

                    if(!user.isVerified){
                        throw new Error('Please verify your email');
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials!.password, user.password);

                    if(isPasswordCorrect){
                        return user;
                    } else {
                        throw new Error("Incorrect password");
                    }

                } catch (err: any) {
                    console.log(err);
                    throw new Error("Server Error");
                }

            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    }
    , pages: {
        signIn: '/signin'
    },
    callbacks: {
        async jwt({ token, user }) {
            if(user){
                token._id = user._id;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }

            return token
        },
        async session({ session, token }) {
            
            if(token){
                session.user._id = token._id,
                session.user.isVerified = token.isVerified,
                session.user.isAcceptingMessages = token.isAcceptingMessages,
                session.user.username = token.username
            }

            return session
        }
    }
}