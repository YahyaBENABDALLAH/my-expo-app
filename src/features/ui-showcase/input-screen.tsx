import { useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Column,
  Icon,
  PageScreen,
  PageSection,
  Row,
  Switch,
  TextInput,
  UniversalButtonContent,
  UniversalTextContent as Text,
  nativeFillWidth,
  nativeRowWeight,
  type InputStatus,
  type TextInputRef,
} from '@components/ui';
import { spacing } from '@/constants/layout';

const inputIcons = {
  search: Icon.select({
    ios: 'magnifyingglass',
    android: require('@expo/material-symbols/search.xml'),
  }),
  clear: Icon.select({
    ios: 'xmark.circle.fill',
    android: require('@expo/material-symbols/cancel.xml'),
  }),
  info: Icon.select({ ios: 'info.circle', android: require('@expo/material-symbols/info.xml') }),
};

const statuses = [
  'default',
  'error',
  'success',
  'warning',
] as const satisfies readonly InputStatus[];
const notesLimit = 160;

export default function InputScreen() {
  const { t } = useTranslation();
  return (
    <PageScreen title={t('showcase.input')} description={t('showcase.inputDescription')}>
      <ControlledInputDemo />
      <UncontrolledInputDemo />
      <InputStatusDemo />
      <PasswordInputDemo />
      <InputAvailabilityDemo />
      <InputKeyboardDemo />
    </PageScreen>
  );
}

function InputSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <PageSection>
      <Text variant="title">{title}</Text>
      <Text tone="muted">{hint}</Text>
      {children}
    </PageSection>
  );
}

function ControlledInputDemo() {
  const { t } = useTranslation();
  const inputRef = useRef<TextInputRef>(null);
  const [draft, setDraft] = useState('');
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <InputSection
      title={t('showcase.inputGallery.controlled')}
      hint={t('showcase.inputGallery.controlledHint')}
    >
      <TextInput
        ref={inputRef}
        label={t('showcase.draft')}
        placeholder={t('showcase.inputGallery.placeholder')}
        value={draft}
        onChangeText={setDraft}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={setSubmitted}
        returnKeyType="done"
        autoComplete="off"
        testID="demo-input"
      />
      <Text testID="demo-input-value">{t('showcase.draftValue', { value: draft })}</Text>
      <Text testID="demo-input-focus-state">
        {t(focused ? 'showcase.inputGallery.focused' : 'showcase.inputGallery.blurred')}
      </Text>
      <Text testID="demo-input-submit-value">
        {submitted === null
          ? t('showcase.inputGallery.notSubmitted')
          : t('showcase.inputGallery.submittedValue', { value: submitted })}
      </Text>
      <UniversalButtonContent
        variant="secondary"
        label={t('showcase.inputGallery.fill')}
        fullWidth
        onPress={() => setDraft(t('showcase.inputGallery.sample'))}
        testID="demo-input-fill"
      />
      <UniversalButtonContent
        variant="secondary"
        label={t('showcase.inputGallery.reset')}
        fullWidth
        onPress={() => {
          setDraft('');
          setSubmitted(null);
        }}
        testID="demo-input-reset"
      />
      <Row spacing={spacing.md} modifiers={nativeFillWidth}>
        <Column modifiers={nativeRowWeight}>
          <UniversalButtonContent
            variant="tertiary"
            label={t('showcase.inputGallery.focus')}
            fullWidth
            onPress={() => inputRef.current?.focus()}
            testID="demo-input-focus"
          />
        </Column>
        <Column modifiers={nativeRowWeight}>
          <UniversalButtonContent
            variant="tertiary"
            label={t('showcase.inputGallery.blur')}
            fullWidth
            onPress={() => inputRef.current?.blur()}
            testID="demo-input-blur"
          />
        </Column>
      </Row>
    </InputSection>
  );
}

function UncontrolledInputDemo() {
  const { t } = useTranslation();
  const inputRef = useRef<TextInputRef>(null);
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <InputSection
      title={t('showcase.inputGallery.uncontrolled')}
      hint={t('showcase.inputGallery.uncontrolledHint')}
    >
      <TextInput
        ref={inputRef}
        label={t('showcase.inputGallery.nativeDraft')}
        defaultValue={t('showcase.inputGallery.sample')}
        placeholder={t('showcase.inputGallery.placeholder')}
        returnKeyType="done"
        onSubmitEditing={setSubmitted}
        autoComplete="off"
        testID="demo-input-uncontrolled"
      />
      <UniversalButtonContent
        variant="secondary"
        label={t('showcase.inputGallery.clearNative')}
        fullWidth
        onPress={() => {
          inputRef.current?.clear();
          setSubmitted(null);
        }}
        testID="demo-input-clear-native"
      />
      <Text testID="demo-input-uncontrolled-submit">
        {submitted === null
          ? t('showcase.inputGallery.notSubmitted')
          : t('showcase.inputGallery.submittedValue', { value: submitted })}
      </Text>
    </InputSection>
  );
}

function InputStatusDemo() {
  const { t } = useTranslation();

  return (
    <InputSection
      title={t('showcase.inputGallery.statuses')}
      hint={t('showcase.inputGallery.statusesHint')}
    >
      {statuses.map((status) => (
        <TextInput
          key={status}
          label={t(`showcase.inputGallery.status.${status}`)}
          helperText={t(`showcase.inputGallery.statusHint.${status}`)}
          placeholder={t('showcase.inputGallery.placeholder')}
          status={status}
          autoComplete="off"
          testID={`demo-input-status-${status}`}
        />
      ))}
    </InputSection>
  );
}

function PasswordInputDemo() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [shown, setShown] = useState(false);

  return (
    <InputSection
      title={t('showcase.inputGallery.password')}
      hint={t('showcase.inputGallery.passwordHint')}
    >
      <TextInput
        label={t('auth.password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!shown}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        leftIcon={Icon.select({
          ios: 'lock',
          android: require('@expo/material-symbols/lock.xml'),
        })}
        rightIcon={Icon.select({
          ios: shown ? 'eye.slash' : 'eye',
          android: shown
            ? require('@expo/material-symbols/visibility_off.xml')
            : require('@expo/material-symbols/visibility.xml'),
        })}
        rightIconAccessibilityLabel={t(shown ? 'auth.hidePassword' : 'auth.showPassword')}
        onRightIconPress={() => setShown((current) => !current)}
        testID="demo-input-password"
      />
      <Text testID="demo-input-password-state">
        {t(shown ? 'showcase.inputGallery.passwordShown' : 'showcase.inputGallery.passwordHidden')}
      </Text>
    </InputSection>
  );
}

function InputAvailabilityDemo() {
  const { t } = useTranslation();
  const [disabled, setDisabled] = useState(true);
  const [query, setQuery] = useState('');
  const [actions, setActions] = useState(0);

  return (
    <InputSection
      title={t('showcase.inputGallery.availability')}
      hint={t('showcase.inputGallery.availabilityHint')}
    >
      <Switch
        label={t('showcase.inputGallery.disable')}
        value={disabled}
        onValueChange={setDisabled}
        modifiers={nativeFillWidth}
        testID="demo-input-disable-toggle"
      />
      <TextInput
        label={t('showcase.inputGallery.search')}
        value={query}
        onChangeText={setQuery}
        placeholder={t('showcase.inputGallery.searchPlaceholder')}
        disabled={disabled}
        leftIcon={inputIcons.search}
        rightIcon={inputIcons.clear}
        rightIconAccessibilityLabel={t('showcase.inputGallery.clearSearch')}
        onRightIconPress={() => {
          setQuery('');
          setActions((current) => current + 1);
        }}
        returnKeyType="search"
        autoComplete="off"
        testID="demo-input-disabled"
      />
      <TextInput
        label={t('showcase.inputGallery.readOnly')}
        value={t('showcase.inputGallery.readOnlyValue')}
        readOnly
        helperText={t('showcase.inputGallery.readOnlyHint')}
        rightIcon={inputIcons.info}
        rightIconAccessibilityLabel={t('showcase.inputGallery.inspect')}
        onRightIconPress={() => setActions((current) => current + 1)}
        testID="demo-input-read-only"
      />
      <Text testID="demo-input-icon-actions">
        {t('showcase.inputGallery.iconActions', { total: actions })}
      </Text>
    </InputSection>
  );
}

function InputKeyboardDemo() {
  const { t } = useTranslation();
  const emailRef = useRef<TextInputRef>(null);
  const notesRef = useRef<TextInputRef>(null);
  const quantityRef = useRef<TextInputRef>(null);
  const [notes, setNotes] = useState('');

  return (
    <InputSection
      title={t('showcase.inputGallery.keyboards')}
      hint={t('showcase.inputGallery.keyboardsHint')}
    >
      <TextInput
        ref={emailRef}
        label={t('auth.email')}
        placeholder="chef@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        returnKeyType="next"
        onSubmitEditing={() => notesRef.current?.focus()}
        leftIcon={Icon.select({
          ios: 'envelope',
          android: require('@expo/material-symbols/mail.xml'),
        })}
        testID="demo-input-email"
      />
      <TextInput
        label={t('showcase.inputGallery.notes')}
        ref={notesRef}
        value={notes}
        onChangeText={setNotes}
        placeholder={t('showcase.inputGallery.notesPlaceholder')}
        multiline
        numberOfLines={4}
        maxLength={notesLimit}
        helperText={t('showcase.inputGallery.length', { length: notes.length, limit: notesLimit })}
        autoComplete="off"
        testID="demo-input-multiline"
      />
      <TextInput
        ref={quantityRef}
        label={t('showcase.inputGallery.quantity')}
        placeholder="2.5"
        keyboardType="decimal-pad"
        helperText={t('showcase.inputGallery.quantityHint')}
        autoComplete="off"
        testID="demo-input-decimal"
      />
      <UniversalButtonContent
        variant="tertiary"
        label={t('showcase.inputGallery.dismissKeyboard')}
        fullWidth
        onPress={() => {
          emailRef.current?.blur();
          notesRef.current?.blur();
          quantityRef.current?.blur();
        }}
        testID="demo-input-dismiss-keyboard"
      />
    </InputSection>
  );
}
