import { StatusBar } from "expo-status-bar";
import { SafeAreaView, View, Text } from "react-native";

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Buat view untuk background status bar */}
      <View className="h-10 bg-white" />

      {/* StatusBar hanya atur warna ikon */}
      <StatusBar style="dark" translucent />

      {/* Konten utama */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-blue-500">
          Tambah Screen
        </Text>
      </View>
    </SafeAreaView>
  );
}
