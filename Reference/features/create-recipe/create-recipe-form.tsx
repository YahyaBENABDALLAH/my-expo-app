import { Button } from "@/components/Universal/button";
import { QueryErrorState } from "@/components/query-error-state";
import { SkiaStepperHeader } from "@/components/ui/skia-stepper-header";
import { Text } from "@/components/Universal/text";
import { TAB_BAR_HEIGHT } from "@/constants/app.constant";
import { useAuthContext } from "@/context/auth.context";
import {
    CREATION_STATE,
    useCreateRecipeContext,
} from "@/context/create-recipe.context";
import { useTheme } from "@/context/theme.context";
import { CreateRecipeFormValues, createRecipeSchema } from "@/resolvers";
import { useCuisineListQuery } from "@/services/cuisine/cuisine.queries";
import { useDifficultyListQuery } from "@/services/difficulty/difficulty.queries";
import { useCreateRecipeMutation } from "@/services/recipe/recipe.mutations";
import { CreateRecipeBody } from "@/types/recipe.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { defineStepper } from "@stepperize/react";
import { usePathname, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Alert, ScrollView, View } from "react-native";
import { CuisineField } from "./components/cuisine-field";
import { DifficultyField } from "./components/difficulty-field";
import { IngredientsField } from "./components/ingredients-field";
import { ServingsField } from "./components/servings-field";
import { StepsField } from "./components/steps-field";
import { SummaryField } from "./components/summary-field";
import { TimeField } from "./components/time-field";
import { TitleField } from "./components/title-field";

// ── Stepper Definition ─────────────────────────────────────────────────
const recipeStepper = defineStepper([
  { id: "info", title: "Info" },
  { id: "details", title: "Details" },
  { id: "ingredients", title: "Ingredients" },
  { id: "steps", title: "Steps" },
]);

// ── Skia Step Indicator Circle ───────────────────────────────────

export default function CreateRecipeForm() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();
  const { user } = useAuthContext();
  const { setCreationState, onSubmitRef, onTriggerRef } =
    useCreateRecipeContext();
  const createMutation = useCreateRecipeMutation();

  const stepper = recipeStepper.useStepper();

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    formState: { isValid, errors },
  } = useForm<CreateRecipeFormValues>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      title: "",
      summary: "",
      difficultyUuid: "",
      cuisineUuid: "",
      prepTimeMinutes: "",
      cookTimeMinutes: "",
      servings: 5,
      steps: [],
      ingredients: [],
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const {
    hasTitle,
    hasSummary,
    hasDifficulty,
    ingredientCount,
    stepCount,
  } = useWatch({
    control,
    compute: (values) => ({
      hasTitle: Boolean(values.title?.trim()),
      hasSummary: Boolean(values.summary?.trim()),
      hasDifficulty: Boolean(values.difficultyUuid?.trim()),
      ingredientCount: values.ingredients?.length ?? 0,
      stepCount: values.steps?.length ?? 0,
    }),
  });

  const isInfoValid = !!(
    hasTitle &&
    hasSummary &&
    !errors.title &&
    !errors.summary
  );
  const isDetailsValid = !!(
    hasDifficulty &&
    !errors.difficultyUuid &&
    !errors.cuisineUuid &&
    !errors.prepTimeMinutes &&
    !errors.cookTimeMinutes &&
    !errors.servings
  );
  const isIngredientsValid = !!(
    ingredientCount > 0 &&
    !errors.ingredients
  );
  const isStepsValid = stepCount > 0 && !errors.steps;

  const stepsWithValidation = stepper.steps.map((step) => {
    let stepValid = false;
    if (step.id === "info") {
      stepValid = isInfoValid;
    } else if (step.id === "details") {
      stepValid = isDetailsValid;
    } else if (step.id === "ingredients") {
      stepValid = isIngredientsValid;
    } else if (step.id === "steps") {
      stepValid = isStepsValid;
    }
    return {
      ...step,
      isValid: stepValid,
    };
  });

  // Data queries
  const cuisinesQuery = useCuisineListQuery({
    isActive: true,
    pageSize: 50,
  });
  const difficultiesQuery = useDifficultyListQuery({
    isActive: true,
    pageSize: 50,
  });

  const cuisines = cuisinesQuery.data?.data ?? [];
  const difficulties = difficultiesQuery.data?.data ?? [];
  const hasDetailsLookupError =
    (cuisinesQuery.isError && cuisines.length === 0) ||
    (difficultiesQuery.isError && difficulties.length === 0);
  const chefUuid = user?.chefProfileUuid;

  const isLastStep = stepper.isLast;

  // Sync creation state with form validity, current step position, and current screen focus
  useEffect(() => {
    if (pathname === "/create-recipe") {
      setCreationState(
        isLastStep && isValid ? CREATION_STATE.VALID : CREATION_STATE.CREATING,
      );
    } else {
      setCreationState(CREATION_STATE.IDLE);
    }
  }, [pathname, isValid, isLastStep, setCreationState]);

  const onSubmit = useCallback(async (values: CreateRecipeFormValues) => {
    if (!chefUuid) {
      Alert.alert(
        "Chef Profile Required",
        "You need a chef profile to create recipes. Would you like to set one up?",
        [
          { text: "Not now", style: "cancel" },
          {
            text: "Become a Chef",
            onPress: () => {
              setCreationState(CREATION_STATE.IDLE);
              router.replace("/become-chef");
            },
          },
        ],
      );
      return;
    }

    const body: CreateRecipeBody = {
      title: values.title.trim(),
      difficultyUuid: values.difficultyUuid,
      status: "DRAFT",
      isActive: true,
      steps:
        values.steps?.map((step, index) => ({
          stepNumber: index + 1,
          title: step.title?.trim() || null,
          instruction: step.instruction.trim(),
          durationMinutes: step.durationMinutes
            ? Number(step.durationMinutes)
            : null,
        })) || null,
      ingredients:
        values.ingredients?.map((item, index) => ({
          ingredientUuid: item.ingredientUuid,
          quantity: item.quantity ? Number(item.quantity) : undefined,
          unitUuid: item.unitUuid || null,
          isOptional: item.isOptional || false,
          notes: item.notes?.trim() || null,
          sortOrder: index,
        })) || null,
    };

    const summary = values.summary?.trim();
    if (summary) body.summary = summary;

    if (values.cuisineUuid) body.cuisineUuid = values.cuisineUuid;

    const prep = Number(values.prepTimeMinutes);
    if (!isNaN(prep) && prep > 0) body.prepTimeMinutes = prep;

    const cook = Number(values.cookTimeMinutes);
    if (!isNaN(cook) && cook > 0) body.cookTimeMinutes = cook;

    if (values.servings > 0) body.servings = values.servings;

    try {
      const recipe = await createMutation.mutateAsync({ chefUuid, body });
      setCreationState(CREATION_STATE.IDLE);
      router.replace(`/recipe/${recipe.uuid}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create recipe";
      Alert.alert("Error", message);
    }
  }, [chefUuid, createMutation, router, setCreationState]);

  // Handle advancing steps with step-specific validation
  const handleNext = useCallback(async () => {
    let fieldsToValidate: (keyof CreateRecipeFormValues)[] = [];
    if (stepper.current.id === "info") {
      fieldsToValidate = ["title", "summary"];
    } else if (stepper.current.id === "details") {
      fieldsToValidate = ["difficultyUuid", "cuisineUuid", "servings"];
    } else if (stepper.current.id === "ingredients") {
      fieldsToValidate = ["ingredients"];
    } else if (stepper.current.id === "steps") {
      fieldsToValidate = ["steps"];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      await stepper.next();
      return true;
    }
    return false;
  }, [stepper, trigger]);

  // Bind the onSubmit and onTrigger refs so the floating button can trigger them
  useEffect(() => {
    onSubmitRef.current = handleSubmit(onSubmit);
    onTriggerRef.current = handleNext;

    return () => {
      onSubmitRef.current = null;
      onTriggerRef.current = null;
    };
  }, [handleSubmit, handleNext, onSubmit, onSubmitRef, onTriggerRef]);

  return (
    <>
      <View style={{ flexDirection: "row", paddingHorizontal: 16 }}>
        <Text
          style={[{ color: colors.secondary }, { fontSize: 30, fontWeight: "700", letterSpacing: -1.2 }]}
        >
          New Recipe
        </Text>
      </View>

      {/* ── Stepper Progress Header ─────────────────────────── */}
      <SkiaStepperHeader
        steps={stepsWithValidation}
        currentIndex={stepper.index}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          gap: 16,
          paddingHorizontal: 16,
          paddingBottom: TAB_BAR_HEIGHT + 24,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Render Active Step Content */}
        {stepper.match({
          info: () => (
            <View style={{ gap: 16 }}>
              <TitleField control={control} />
              <SummaryField control={control} />
            </View>
          ),
          details: () => hasDetailsLookupError ? (
            <QueryErrorState
              isRetrying={
                cuisinesQuery.isFetching || difficultiesQuery.isFetching
              }
              message="We could not load the recipe options."
              onRetry={() =>
                Promise.all([
                  cuisinesQuery.refetch(),
                  difficultiesQuery.refetch(),
                ])
              }
            />
          ) : (
            <View style={{ gap: 16 }}>
              <DifficultyField
                control={control}
                difficulties={difficulties}
                isLoading={difficultiesQuery.isPending}
              />
              <CuisineField
                control={control}
                cuisines={cuisines}
                isLoading={cuisinesQuery.isPending}
              />
              <View style={{ gap: 16 }}>
                <Text
                  style={[{ color: colors.secondary }, { fontSize: 16, fontWeight: "600" }]}
                >
                  Time & Servings
                </Text>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TimeField
                    control={control}
                    name="prepTimeMinutes"
                    label="Prep (min)"
                  />
                  <TimeField
                    control={control}
                    name="cookTimeMinutes"
                    label="Cook (min)"
                  />
                  <ServingsField control={control} step={5} />
                </View>
              </View>
            </View>
          ),
          ingredients: () => (
            <IngredientsField
              control={control}
              errors={errors}
              setValue={setValue}
            />
          ),
          steps: () => <StepsField control={control} errors={errors} />,
        })}

        {/* ── Navigation Controls ────────────────────────────── */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 16,
            marginTop: 24,
          }}
        >
          {stepper.canPrev ? (
            <Button
              fullWidth
              variant="outlined"
              onPress={() => stepper.prev()}
              containerStyle={{ flex: 1 }}
              style={{ height: 48, borderRadius: 12 }}
              label="Back"
            />
          ) : (
            <View style={{ flex: 1 }} />
          )}
          {stepper.canNext ? (
            <Button
              fullWidth
              onPress={handleNext}
              containerStyle={{ flex: 1 }}
              style={{ height: 48, borderRadius: 12 }}
              label="Next"
            />
          ) : null}
        </View>
      </ScrollView>
    </>
  );
}
