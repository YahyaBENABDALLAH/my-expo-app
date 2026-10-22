import type { ReactNode } from 'react';
import { PageSection, UniversalTextContent as Text } from '@components/ui';

export function DemoSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <PageSection>
      <Text variant="title">{title}</Text>
      {hint ? <Text tone="muted">{hint}</Text> : null}
      {children}
    </PageSection>
  );
}
