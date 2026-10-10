import type { ReactElement } from 'react';

export type LoadingIndicatorProps = { color: string; testID?: string };
/** Indeterminate native progress, composed inside an Expo UI Host. */
export declare function LoadingIndicator(props: LoadingIndicatorProps): ReactElement;
