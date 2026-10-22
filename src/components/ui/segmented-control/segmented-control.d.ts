export type SegmentedControlProps = {
  label?: string;
  options: readonly { value: string; label: string; testID: string }[];
  selectedValue: string | null;
  onValueChange: (value: string) => void;
};

// Metro resolves the native implementation; this declaration supplies its shared type.
export declare function SegmentedControl(props: SegmentedControlProps): React.JSX.Element;
