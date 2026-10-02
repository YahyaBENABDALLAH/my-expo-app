import CreateRecipeForm from "@/features/create-recipe/create-recipe-form";
import { KeyboardAvoidingView, Platform, View } from "react-native";

export default function CreateRecipeScreen() {
  return (
    <View
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <CreateRecipeForm />
      </KeyboardAvoidingView>
    </View>
  );
}
