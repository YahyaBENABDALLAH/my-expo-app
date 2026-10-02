import { Host } from "@/components/Universal/host";
import { Column } from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import { Card } from "@/components/ui/surface";
import { useTheme } from "@/context/theme.context";

interface RecipesEmptyStateProps {
  message: string;
}

export function RecipesEmptyState({ message }: RecipesEmptyStateProps) {
  const { colors } = useTheme();

  return (
    <Card style={{ paddingHorizontal: 20, paddingVertical: 24 }}>
      <Host matchContents>
        <Column>
          <Text
            style={[{ color: colors.mutedForeground }, { fontSize: 18, lineHeight: 28 }]}
          >
            {message}
          </Text>
        </Column>
      </Host>
    </Card>
  );
}
