import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RecipeDrawerContent } from "@/components/recipe-drawer-content";

export default function RecipeDrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerPosition: "right", // Slide in from the right for details
          drawerStyle: {
            width: "95%",
            maxWidth: 380,
            backgroundColor: "transparent", // Styled in custom content
          },
          sceneStyle: {
            backgroundColor: "transparent",
          },
          swipeEnabled: true,
        }}
        drawerContent={(props) => <RecipeDrawerContent {...props} />}
      >
        <Drawer.Screen name="index" />
      </Drawer>
    </GestureHandlerRootView>
  );
}
