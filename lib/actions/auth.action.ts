'use server';

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";


const SESSION_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return { success: false, message: 'User not found' };
        }

        // const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRE_TIME });
        await setSessionCookie(idToken);

        return { success: true, message: 'Sign in successful' };
    } catch (error: any) {
        console.error('Error signing in:', error);
        return { success: false, message: 'Failed to sign in' };
    }
}

export async function setSessionCookie(idToken:string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRE_TIME });

    cookieStore.set('session', sessionCookie, {
        maxAge: SESSION_EXPIRE_TIME / 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    })
    
}

