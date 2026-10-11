import { Column, Icon, Row, Spacer, Text, useNativeState, type TextInputRef } from '@expo/ui';
import { useEffect, useRef } from 'react';
import Animated, {
  cancelAnimation,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { nativeFillWidth, nativeRowWeight } from '../native/native-fill-width';
import { UniversalTextInputContent } from '../text-input/universal-text-input';
import { inputFieldAppearance } from '../text-input/text-input-modifiers';
import { SearchFieldTrigger } from './search-field-trigger';

type SearchFieldBase = {
  placeholder: string;
  testID: string;
  colorScheme?: 'light' | 'dark';
  active?: boolean;
  animate?: boolean;
};
export type SearchFieldProps = SearchFieldBase &
  (
    | { mode: 'navigate'; onPress: () => void }
    | {
        mode: 'edit';
        value: string;
        onChange: (value: string) => void;
        onSubmit: (value: string) => void;
        clearLabel: string;
        /** One-shot intent from Home. Changing it focuses an already mounted field. */
        focusRequest?: string;
      }
  );

const searchIcon = Icon.select({
  ios: 'magnifyingglass',
  android: require('@expo/material-symbols/search.xml'),
});
const clearIcon = Icon.select({
  ios: 'xmark.circle.fill',
  android: require('@expo/material-symbols/cancel.xml'),
});

/** Standalone control at a page's pinned RN header boundary. */
export function SearchField(props: SearchFieldProps) {
  const { placeholder, testID, active = true, animate = true } = props;
  const scheme = useHostColorScheme(props.colorScheme);
  const colors = useThemeColors(scheme);
  const motionEnabled = useMotionEnabled(active && animate);
  const inputRef = useRef<TextInputRef>(null);
  const handledRequest = useRef<string | undefined>(undefined);
  const progress = useSharedValue(1);
  const text = props.mode === 'edit' ? props.value : '';
  const request = props.mode === 'edit' ? props.focusRequest : undefined;
  const nativeText = useNativeState(text);

  useEffect(() => {
    nativeText.set(text);
  }, [nativeText, text]);
  useEffect(() => {
    if (!active) inputRef.current?.blur();
    if (!active || !request || handledRequest.current === request) return;
    // Focus on the next frame after mounting; navigation itself stays immediate.
    const frame = requestAnimationFrame(() => {
      handledRequest.current = request;
      inputRef.current?.focus();
      if (motionEnabled) {
        progress.set(0);
        progress.set(
          withSpring(1, { duration: 300, dampingRatio: 1, reduceMotion: ReduceMotion.System }),
        );
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [active, request, motionEnabled, progress]);
  useEffect(() => {
    if (!motionEnabled) {
      cancelAnimation(progress);
      progress.set(1);
    }
    return () => cancelAnimation(progress);
  }, [motionEnabled, progress]);
  const transition = useAnimatedStyle(() => ({
    transform: [
      { translateY: (1 - progress.get()) * 4 },
      { scale: 0.985 + progress.get() * 0.015 },
    ],
  }));
  const appearance = inputFieldAppearance({
    paddingHorizontal: 14,
    paddingVertical: 0,
    paddingRight: 2,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  });
  return (
    <Animated.View style={transition}>
      <UniversalHost colorScheme={scheme} ignoreSafeArea="all">
        {props.mode === 'navigate' ? (
          <SearchFieldTrigger
            label={placeholder}
            onPress={props.onPress}
            testID={testID}
            colorScheme={scheme}
          >
            <Row
              alignment="center"
              spacing={8}
              style={appearance.style}
              modifiers={[...nativeFillWidth, ...(appearance.modifiers ?? [])]}
            >
              <Icon
                name={searchIcon}
                size={20}
                color={colors.muted}
                style={{ width: 20, height: 20 }}
              />
              <Column modifiers={nativeRowWeight}>
                <Text
                  numberOfLines={1}
                  style={{ paddingVertical: 14 }}
                  textStyle={{ fontSize: 16, lineHeight: 24, color: colors.muted }}
                >
                  {placeholder}
                </Text>
              </Column>
              <Spacer style={{ width: 48 }} />
            </Row>
          </SearchFieldTrigger>
        ) : (
          <UniversalTextInputContent
            ref={inputRef}
            testID={testID}
            placeholder={placeholder}
            value={nativeText}
            onChangeText={props.onChange}
            onSubmitEditing={props.onSubmit}
            autoCapitalize="none"
            returnKeyType="search"
            leftIcon={searchIcon}
            rightIcon={clearIcon}
            onRightIconPress={() => {
              props.onChange('');
              inputRef.current?.focus();
            }}
            rightIconAccessibilityLabel={props.clearLabel}
            textStyle={{ fontSize: 16, lineHeight: 24 }}
          />
        )}
      </UniversalHost>
    </Animated.View>
  );
}
