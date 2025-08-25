import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
    GoogleAuthProvider,
    User,
    onAuthStateChanged,
    signInWithCredential,
    signOut,
} from "firebase/auth";
import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { auth } from "../FirebaseConfig";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Configure Google Auth Request - PRIORITAS WEB CLIENT ID untuk Expo hosted service
  const [request, response, promptAsync] = Google.useAuthRequest({
    // Prioritaskan webClientId untuk menggunakan Expo hosted auth service
    webClientId: "366237419933-i0grtfktv09bjadnc088fks2vauagfq2.apps.googleusercontent.com",
    
    androidClientId: "366237419933-8qnicbgbhf4o3f21jroid466q9312ko5.apps.googleusercontent.com",
    
    scopes: ["profile", "email"],
  });

  // Log auth request configuration
  useEffect(() => {
    console.log("🔧 Google Auth Request Configuration:");
    console.log("- Using Web Client ID (Priority):", "366237419933-i0grtfktv09bjadnc088fks2vauagfq2.apps.googleusercontent.com");
    console.log("- Android Client ID (Disabled):", "Commented out to force web flow");
    
    if (request) {
      console.log("🔗 Request URL:", request.url);
      console.log("🔗 Redirect URI:", request.redirectUri);
      
      // Analisis redirect URI
      if (request.redirectUri?.includes('auth.expo.io')) {
        console.log("✅ Using Expo Auth Service (Good!)");
        console.log("🚨 ADD THIS TO GOOGLE CLOUD CONSOLE:");
        console.log("   Web Client ID → Authorized redirect URIs:");
        console.log("   " + request.redirectUri);
      } else if (request.redirectUri?.includes('exp://')) {
        console.log("⚠️ Using local development URI");
        console.log("🚨 ADD THIS TO GOOGLE CLOUD CONSOLE:");
        console.log("   Android Client ID → Advanced Settings → Authorized redirect URIs:");
        console.log("   " + request.redirectUri);
      }
    }
  }, [request]);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔄 Auth state changed:", user ? `✅ ${user.email}` : "❌ No user");
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Handle Google Auth Response
  useEffect(() => {
    console.log("📱 Google Auth Response Type:", response?.type);
    
    if (response?.type === "success") {
      console.log("✅ Google Auth Success!");
      console.log("📝 Response params:", Object.keys(response.params));
      
      const { id_token, access_token } = response.params;
      
      if (id_token) {
        console.log("🔑 Creating Firebase credential...");
        const credential = GoogleAuthProvider.credential(id_token, access_token);

        signInWithCredential(auth, credential)
          .then((result) => {
            console.log("🎉 Firebase sign-in successful:", result.user.email);
            console.log("👤 User UID:", result.user.uid);
          })
          .catch((error) => {
            console.error("❌ Firebase credential error:");
            console.error("- Code:", error.code);
            console.error("- Message:", error.message);
            Alert.alert("Firebase Error", `${error.code}: ${error.message}`);
          });
      } else {
        console.error("❌ No id_token in response");
        Alert.alert("Authentication Error", "No authentication token received from Google");
      }
    } 
    else if (response?.type === "error") {
      console.error("❌ Google Auth Error Response:");
      console.error("- Type:", response.type);
      console.error("- Error object:", response.error);
      
      if (response.error) {
        console.error("- Error message:", response.error.message);
        console.error("- Error description:", response.error.description);
        
        if (response.error.message?.includes("invalid_request")) {
          console.error("🚨 INVALID REQUEST ERROR DETAILS:");
          console.error("- Current redirect URI:", request?.redirectUri);
          console.error("🔧 SOLUTION:");
          console.error("1. Go to Google Cloud Console");
          
          if (request?.redirectUri?.includes('auth.expo.io')) {
            console.error("2. Edit Web Client ID");
            console.error("3. Authorized redirect URIs");
          } else {
            console.error("2. Edit Android Client ID");
            console.error("3. Advanced Settings → Authorized redirect URIs");
          }
          
          console.error("4. Add: " + request?.redirectUri);
        }
        
        Alert.alert(
          "Google Authentication Error", 
          `❌ ${response.error.message}\n\n` +
          `Redirect URI: ${request?.redirectUri}\n\n` +
          `Add this URI to Google Cloud Console`
        );
      }
    }
    else if (response?.type === "cancel") {
      console.log("⚠️ User cancelled Google authentication");
    }
  }, [response, request]);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      console.log("🚀 Starting Google sign-in process...");
      console.log("🔗 Using redirect URI:", request?.redirectUri);
      
      const result = await promptAsync();
      
      console.log("📝 Prompt result type:", result.type);
      
      if (result.type === "error") {
        console.error("❌ Prompt error:", result.error);
        Alert.alert("Sign-in Error", `Failed to sign in: ${result.error}`);
      } else if (result.type === "cancel") {
        console.log("⚠️ User cancelled sign-in");
      } else if (result.type === "success") {
        console.log("✅ Prompt success - waiting for response processing...");
      }
    } catch (error) {
      console.error("❌ Exception during Google sign-in:", error);
      Alert.alert("Sign-in Exception", `Unexpected error: ${error}`);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      console.log("✅ User logged out successfully");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };

  const value: AuthContextType = { user, loading, signInWithGoogle, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthContext");
  return context;
};
