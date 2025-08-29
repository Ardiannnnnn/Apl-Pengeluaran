import * as Haptics from 'expo-haptics';
import { Pressable, PressableProps } from 'react-native';

interface HapticTabProps extends PressableProps {
  children: React.ReactNode;
}

export function HapticTab({ onPressIn, children, ...props }: HapticTabProps) {
  return (
    <Pressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPressIn?.(ev);
      }}
    >
      {children}
    </Pressable>
  );
}
