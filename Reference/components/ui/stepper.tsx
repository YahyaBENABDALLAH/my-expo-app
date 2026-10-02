import { Icon, icons } from "@/components/Universal/icon";
import {
  TextInput,
  useNativeState,
} from "@/components/Universal/text-input";
import { FONT_WEIGHT } from "@/constants/theme.tokens";
import { useTheme } from "@/context/theme.context";
import { useEffect } from "react";
import { Pressable, View, type ViewStyle } from "react-native";

export interface NumericStepperProps {
  value: number | string;
  onChange: (value: number | string) => void;
  min?: number;
  max?: number;
  step?: number;
  hasError?: boolean;
  allowEmpty?: boolean;
  style?: ViewStyle;
}

export function NumericStepper({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  hasError = false,
  allowEmpty = false,
  style,
}: NumericStepperProps) {
  const { colors } = useTheme();
  const inputValue = useNativeState(String(value ?? ""));

  useEffect(() => {
    const nextValue = String(value ?? "");

    if (nextValue !== inputValue.value) {
      inputValue.set(nextValue);
    }
  }, [inputValue, value]);

  const handleMinus = () => {
    const current = Number(value) || 0;
    const next = Math.max(min, current - step);
    if (next === 0 && allowEmpty) {
      onChange("");
    } else {
      onChange(next);
    }
  };

  const handlePlus = () => {
    const current = Number(value) || 0;
    const next = Math.min(max, current + step);
    onChange(next);
  };

  const handleChangeText = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    inputValue.set(cleaned);

    if (cleaned === "") {
      onChange(allowEmpty ? "" : min);
    } else {
      const parsed = parseInt(cleaned, 10);
      onChange(isNaN(parsed) ? (allowEmpty ? "" : min) : parsed);
    }
  };

  const iconColor = hasError ? colors.destructive : colors.mutedForeground;

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 9999,
          backgroundColor: hasError ? colors.destructive + "1a" : colors.muted,
          height: 36,
          width: "100%",
          maxWidth: 130,
          paddingHorizontal: 4,
          borderWidth: 1,
          borderColor: hasError ? colors.destructive : "transparent",
        },
        style,
      ]}
    >
      <Pressable
        onPress={handleMinus}
        style={{
          height: 36,
          width: 16,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 9999,
        }}
        hitSlop={8}
      >
        <Icon name={icons.minus} size={16} color={iconColor} />
      </Pressable>

      <TextInput
        value={inputValue}
        onChangeText={handleChangeText}
        keyboardType="number-pad"
        selectTextOnFocus
        elevated={false}
        containerStyle={{ width: 32 }}
        style={{
          width: 32,
          height: 32,
          paddingHorizontal: 0,
          borderRadius: 9999,
          borderWidth: 2,
          borderColor: hasError ? colors.destructive : colors.primary,
          backgroundColor: colors.background,
        }}
        textStyle={{
          textAlign: "center",
          fontSize: 16,
          fontWeight: FONT_WEIGHT.bold,
          color: hasError ? colors.destructive : colors.foreground,
        }}
      />

      <Pressable
        onPress={handlePlus}
        style={{
          height: 36,
          width: 16,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 9999,
        }}
        hitSlop={8}
      >
        <Icon name={icons.plus} size={16} color={iconColor} />
      </Pressable>
    </View>
  );
}
