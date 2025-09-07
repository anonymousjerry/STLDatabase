"use client";

import { useRecaptcha } from "@/hooks/useRecaptcha";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// Extend the session type to include provider and Google user data
interface ExtendedSession {
  user: {
    id: string;
    email: string;
    name: string;
    username: string;
    image?: string;
    role: string;
  };
  provider?: string;
  accessToken?: string;
  isNewUser?: boolean;
  googleUserData?: {
    name: string;
    email: string;
    isNewUser: boolean;
  };
}

interface GoogleUserData {
  name: string;
  email: string;
  isNewUser: boolean;
}

export const useGoogleAuth = () => {
  const { executeRecaptcha } = useRecaptcha();
  const { data: session, status } = useSession();
  const [hasSentWelcome, setHasSentWelcome] = useState(false);
  
  // Cast session to extended type
  const extendedSession = session as ExtendedSession | null;
  
  // Send welcome email for new Google users
  const sendWelcomeEmail = async (name: string, email: string) => {
    try {
      const recaptchaToken = await executeRecaptcha('contact');
      
      const requestBody = {
        name,
        email,
        recaptchaToken,
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contact/welcome`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      
      if (response.ok) {
        setHasSentWelcome(true);
        return { success: true, message: 'Welcome email sent successfully' };
      } else {
        const errorData = await response.text();
        console.error('Failed to send welcome email for Google user:', errorData);
        return { success: false, message: 'Failed to send welcome email' };
      }
    } catch (error) {
      console.error('Error sending welcome email for Google user:', error);
      return { success: false, message: 'Error sending welcome email' };
    }
  };

  // Check if user is a new Google OAuth user and send welcome email
  const handleGoogleUserWelcome = async (userData: GoogleUserData) => {
    if (userData.isNewUser && !hasSentWelcome) {
      const result = await sendWelcomeEmail(userData.name, userData.email);
      return result;
    }
    return { success: true, message: 'User already welcomed or not new' };
  };

  // Auto-detect Google OAuth users and send welcome email
  useEffect(() => {
    if (extendedSession?.user && extendedSession.provider === 'google' && !hasSentWelcome) {
      
      // If this is a new Google user, automatically send welcome email
      if (extendedSession.isNewUser && extendedSession.googleUserData) {

        // Call the function directly to avoid dependency issues
        const sendWelcome = async () => {
          try {
            const result = await sendWelcomeEmail(
              extendedSession.googleUserData!.name, 
              extendedSession.googleUserData!.email
            );
          } catch (error) {
            console.error('Error in automatic welcome email:', error);
          }
        };
        sendWelcome();
      }
    }
  }, [extendedSession, hasSentWelcome]);

  return {
    sendWelcomeEmail,
    handleGoogleUserWelcome,
    hasSentWelcome,
    isGoogleUser: extendedSession?.provider === 'google',
    user: extendedSession?.user,
    status,
    googleUserData: extendedSession?.googleUserData
  };
};
