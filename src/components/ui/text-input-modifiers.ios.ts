import { accessibilityLabel, frame } from '@expo/ui/swift-ui/modifiers';

export const inputRowFlex = [frame({ maxWidth: Infinity })];
export const rightIconLabel = (label: string) => [accessibilityLabel(label)];
