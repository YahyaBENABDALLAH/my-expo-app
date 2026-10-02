import { RADIUS } from "@/constants/theme.tokens";
import { useTheme } from "@/context/theme.context";
import { ComponentProps } from "react";
import { View } from "react-native";

function Skeleton({ style, ...props }: ComponentProps<typeof View>) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.accent,
          borderRadius: RADIUS.medium,
          opacity: 0.72,
        },
        style,
      ]}
      {...props}
    />
  );
}

export { Skeleton };
