export type SegmentedControlProps = {
  label?: string;
  options: readonly { value: string; label: string; testID: string }[];
  selectedValue: string | null;
  onValueChange: (value: string) => void;
};
