import { TabNavigator } from "@/features/home/tab-navigator";
import { RequireAuth } from "@/guards/require-auth";

export default function TabLayout() {
  return (
    <RequireAuth>
      <TabNavigator />
    </RequireAuth>
  );
}
