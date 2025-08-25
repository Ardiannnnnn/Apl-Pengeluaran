import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Text, View } from "react-native";
import "react-native-reanimated";
import "../assets/css/global.css";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";

// Auth Guard Component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Tunggu sampai loading selesai

    const inAuthGroup = segments[0] === "(tabs)";

    if (!user && inAuthGroup) {
      // User belum login tapi coba akses (tabs)
      router.replace("/login");
    } else if (user && !inAuthGroup) {
      // User sudah login tapi masih di login screen
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <View className="w-16 h-16 bg-blue-500 rounded-2xl items-center justify-center mb-4">
          <Text className="text-white text-2xl">💰</Text>
        </View>
        <Text className="text-gray-600 text-lg">Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

// Navigation Component
function RootNavigator() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
    </Stack>
  );
}

// Main Layout
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthGuard>
          <RootNavigator />
        </AuthGuard>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
