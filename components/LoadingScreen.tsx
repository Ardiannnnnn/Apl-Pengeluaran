import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {Text, useColorScheme, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({
  message = "Loading data...",
}: LoadingScreenProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    // Scale animation for icon
    scale.value = withRepeat(
      withTiming(1.1, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Opacity animation for dots
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [scale, opacity]);

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(opacity.value, [0.3, 1], [0.3, 1]),
  }));

  return (
    <View
      className={`flex-1 justify-center items-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Background Pattern */}
      <View className="absolute inset-0 justify-center items-center opacity-5">
        <Ionicons
          name="card"
          size={200}
          color={isDark ? "#3b82f6" : "#2563eb"}
        />
      </View>

      {/* Main Loading Content */}
      <View className="items-center">
        {/* Loading Text */}
        <View className="items-center px-8">
          <Text
            className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-800"}`}
          >
            Const Tracker
          </Text>

          <Animated.View style={[opacityStyle]}>
            <Text
              className={`text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              {message}
            </Text>
          </Animated.View>

          {/* Loading Dots */}
          <View className="flex-row mt-4 space-x-1">
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  opacityStyle,
                  {
                    animationDelay: `${index * 200}ms`,
                  },
                ]}
              >
                <View
                  className={`w-2 h-2 rounded-full ${
                    isDark ? "bg-blue-400" : "bg-blue-500"
                  }`}
                />
              </Animated.View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
