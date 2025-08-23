/// <reference types="nativewind/types" />

declare module "nativewind" {
  interface NativeWind {
    LinearGradient: typeof import("expo-linear-gradient").LinearGradient;
  }
}
