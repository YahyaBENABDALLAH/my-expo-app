import type { ReactElement } from 'react';
import type { UniversalButtonContentProps } from './universal-button.types';

/** Expo UI button content; must be composed inside an existing Host. */
export declare function UniversalButtonContent(props: UniversalButtonContentProps): ReactElement;

/** @internal Native renderer shared by standalone and hosted buttons. */
export declare function NativeButtonContent(props: UniversalButtonContentProps): ReactElement;
