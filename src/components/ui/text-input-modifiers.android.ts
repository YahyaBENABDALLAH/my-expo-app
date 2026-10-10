import { semantics, weight } from '@expo/ui/jetpack-compose/modifiers';

export const inputRowFlex = [weight(1)];
export const rightIconLabel = (label: string) => [semantics({ contentDescription: label })];
