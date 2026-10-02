import { useState } from 'react';
import { Keyboard } from 'react-native';
import { useForm, type DefaultValues, type FieldValues, type Resolver } from 'react-hook-form';

/** Validation-only forms: no credentials are stored and no authentication request is sent. */
export function useValidatedAuthForm<T extends FieldValues>(
  resolver: Resolver<T>,
  defaultValues: DefaultValues<T>,
  validMessage: string,
) {
  const [notice, setNotice] = useState<string>();
  const form = useForm<T>({
    resolver,
    defaultValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });
  const submit = form.handleSubmit(
    () => {
      Keyboard.dismiss();
      setNotice(validMessage);
    },
    () => setNotice(undefined),
  );

  return { form, notice, submit, onEdited: () => setNotice(undefined) };
}
