import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
    return(
        <SafeAreaView className="flex-1 bg-white">
              {/* Buat view untuk background status bar */}
              <View className="h-10 bg-white" />
        
              {/* StatusBar hanya atur warna ikon */}
              <StatusBar style="dark" translucent />
        
              {/* Konten utama */}
              <View className="flex-1 items-center justify-center">
                <Text className="text-xl font-bold text-blue-500">
                  Profile Screen Tabs
                </Text>
              </View>
            </SafeAreaView>
    )
}