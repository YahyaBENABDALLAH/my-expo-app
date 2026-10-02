import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type PropsWithChildren,
} from "react";
import { useTranslation } from "react-i18next";

const ALERT_VARIANTS = {
  DEFAULT: "default",
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SUCCESS: "success",
  WARNING: "warning",
  DANGER: "danger",
} as const;

type AlertVariant = (typeof ALERT_VARIANTS)[keyof typeof ALERT_VARIANTS];
type AlertDescription = string | string[];

interface AlertShowOptions {
  title?: string;
  description?: AlertDescription;
  variant?: AlertVariant;
  actionLabel?: string;
  /** @deprecated Native dialogs stay open until the user dismisses them. */
  duration?: number;
}

interface AlertContextValue {
  alert: (options: AlertShowOptions) => void;
  success: (title: string, description?: AlertDescription) => void;
  error: (title: string, description?: AlertDescription) => void;
  info: (title: string, description?: AlertDescription) => void;
  warning: (title: string, description?: AlertDescription) => void;
  danger: (title: string, description?: AlertDescription) => void;
  primary: (title: string, description?: AlertDescription) => void;
  secondary: (title: string, description?: AlertDescription) => void;
  dismiss: () => void;
}

interface ActiveAlert {
  id: number;
  title?: string;
  description?: AlertDescription;
  variant: AlertVariant;
  actionLabel: string;
}

interface AlertRendererProps {
  alert: ActiveAlert;
  onDismiss: () => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

function normalizeDescription(description?: AlertDescription) {
  if (typeof description === "string") {
    return description.trim() || undefined;
  }

  if (!description) return undefined;

  const messages = description.map((message) => message.trim()).filter(Boolean);
  return messages.length > 0 ? messages : undefined;
}

function descriptionToText(description?: AlertDescription) {
  return Array.isArray(description) ? description.join("\n") : description;
}

function createAlertProvider(AlertRenderer: ComponentType<AlertRendererProps>) {
  function AlertProvider({ children }: PropsWithChildren) {
    const { t } = useTranslation();
    const [current, setCurrent] = useState<ActiveAlert | null>(null);
    const nextId = useRef(0);

    const dismiss = useCallback(() => setCurrent(null), []);

    const showAlert = useCallback((options: AlertShowOptions) => {
      nextId.current += 1;
      setCurrent({
        id: nextId.current,
        title: options.title?.trim() || undefined,
        description: normalizeDescription(options.description),
        variant: options.variant ?? ALERT_VARIANTS.DEFAULT,
        actionLabel: options.actionLabel?.trim() || t("common.ok"),
      });
    }, [t]);

    const actions = useMemo<AlertContextValue>(
      () => ({
        alert: showAlert,
        success: (title, description) =>
          showAlert({ title, description, variant: ALERT_VARIANTS.SUCCESS }),
        error: (title, description) =>
          showAlert({ title, description, variant: ALERT_VARIANTS.DANGER }),
        info: (title, description) =>
          showAlert({ title, description, variant: ALERT_VARIANTS.DEFAULT }),
        warning: (title, description) =>
          showAlert({ title, description, variant: ALERT_VARIANTS.WARNING }),
        danger: (title, description) =>
          showAlert({ title, description, variant: ALERT_VARIANTS.DANGER }),
        primary: (title, description) =>
          showAlert({ title, description, variant: ALERT_VARIANTS.PRIMARY }),
        secondary: (title, description) =>
          showAlert({ title, description, variant: ALERT_VARIANTS.SECONDARY }),
        dismiss,
      }),
      [dismiss, showAlert],
    );

    return (
      <AlertContext.Provider value={actions}>
        {children}
        {current ? (
          <AlertRenderer
            key={current.id}
            alert={current}
            onDismiss={dismiss}
          />
        ) : null}
      </AlertContext.Provider>
    );
  }

  AlertProvider.displayName = "AlertProvider";
  return AlertProvider;
}

function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}

export {
  ALERT_VARIANTS,
  createAlertProvider,
  descriptionToText,
  useAlert,
};
export type {
  ActiveAlert,
  AlertDescription,
  AlertRendererProps,
  AlertShowOptions,
  AlertVariant,
};
