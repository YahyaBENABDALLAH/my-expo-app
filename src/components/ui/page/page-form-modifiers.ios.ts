import { scrollContentBackground } from '@expo/ui/swift-ui/modifiers';
import { nativeFillSize } from '../native/native-fill-width';

// Form's system canvas must be hidden separately from its view background.
export const pageFormModifiers = [...nativeFillSize, scrollContentBackground('hidden')];
