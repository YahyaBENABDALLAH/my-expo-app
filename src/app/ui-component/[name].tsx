import { useLocalSearchParams } from 'expo-router';
import { ComponentScreen } from '@/features/ui-showcase/component-screen';

export default function ComponentPage() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  return <ComponentScreen name={name} />;
}
