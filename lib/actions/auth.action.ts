'use server';

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";


const SESSION_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days 

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // check if user exists in db
    console.log("uid:", uid);
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: unknown) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors safely
    if (typeof error === 'object' && error !== null) {
      const errWithCode = error as { code?: string };
      if (errWithCode.code === "auth/email-already-exists") {
        return {
          success: false,
          message: "This email is already in use",
        };
      }
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
  } catch (error: unknown) {
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

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection("users").doc(decodedClaims.uid).get();

        if (!userRecord.exists) {
            return null;
        }

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();
    return !! user;
}