import {
  createContext,
  useContext,
  useRef,
  useState,
  type PropsWithChildren,
  type RefObject,
} from "react";

// ── State ────────────────────────────────────────────────────

export const CREATION_STATE = {
  IDLE: "idle",
  CREATING: "creating",
  VALID: "valid",
} as const;

export type CreationState =
  (typeof CREATION_STATE)[keyof typeof CREATION_STATE];

// ── Context ──────────────────────────────────────────────────

interface CreateRecipeContextProps {
  creationState: CreationState;
  setCreationState: (state: CreationState) => void;
  onSubmitRef: RefObject<(() => void) | null>;
  onTriggerRef: RefObject<(() => Promise<boolean>) | null>;
  isSearchFilterActive: boolean;
  setIsSearchFilterActive: (active: boolean) => void;
  onResetSearchFiltersRef: RefObject<(() => void) | null>;
  onOpenSearchFiltersRef: RefObject<(() => void) | null>;
  onOpenProfileRef: RefObject<(() => void) | null>;
}

const CreateRecipeContext = createContext<CreateRecipeContextProps | undefined>(
  undefined,
);

// ── Provider ─────────────────────────────────────────────────

export function CreateRecipeProvider({ children }: PropsWithChildren) {
  const [creationState, setCreationState] = useState<CreationState>(
    CREATION_STATE.IDLE,
  );
  const onSubmitRef = useRef<(() => void) | null>(null);
  const onTriggerRef = useRef<(() => Promise<boolean>) | null>(null);
  const [isSearchFilterActive, setIsSearchFilterActive] = useState(false);
  const onResetSearchFiltersRef = useRef<(() => void) | null>(null);
  const onOpenSearchFiltersRef = useRef<(() => void) | null>(null);
  const onOpenProfileRef = useRef<(() => void) | null>(null);

  return (
    <CreateRecipeContext.Provider
      value={{
        creationState,
        setCreationState,
        onSubmitRef,
        onTriggerRef,
        isSearchFilterActive,
        setIsSearchFilterActive,
        onResetSearchFiltersRef,
        onOpenSearchFiltersRef,
        onOpenProfileRef,
      }}
    >
      {children}
    </CreateRecipeContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────

export function useCreateRecipeContext() {
  const context = useContext(CreateRecipeContext);

  if (!context) {
    throw new Error(
      "useCreateRecipeContext must be used within a CreateRecipeProvider",
    );
  }

  return context;
}
