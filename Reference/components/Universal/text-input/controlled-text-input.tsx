import { useNativeState } from "@expo/ui";
import { forwardRef, useCallback, useEffect } from "react";

import { TextInput } from "./text-input";
import type { TextInputProps, TextInputRef } from "./types";

export interface ControlledTextInputProps
  extends Omit<TextInputProps, "defaultValue" | "onChangeText" | "value"> {
  value?: string | null;
  defaultValue?: string;
  onChangeText?: (value: string) => void;
}

/** Bridges plain form values to Expo's native observable state. */
export const ControlledTextInput = forwardRef<
  TextInputRef,
  ControlledTextInputProps
>(
  (
    { value, defaultValue = "", onChangeText, ...inputProps },
    ref,
  ) => {
    const nativeValue = useNativeState(value ?? defaultValue);

    useEffect(() => {
      if (value !== undefined) {
        const nextValue = value ?? "";

        if (nextValue !== nativeValue.value) {
          nativeValue.set(nextValue);
        }
      }
    }, [nativeValue, value]);

    const handleChangeText = useCallback(
      (nextValue: string) => {
        nativeValue.set(nextValue);
        onChangeText?.(nextValue);
      },
      [nativeValue, onChangeText],
    );

    return (
      <TextInput
        {...inputProps}
        ref={ref}
        value={nativeValue}
        onChangeText={handleChangeText}
      />
    );
  },
);

ControlledTextInput.displayName = "ControlledTextInput";
