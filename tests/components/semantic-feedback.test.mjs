import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

test('text tones follow the Host appearance and retain explicit color and typography overrides', () => {
  let scheme = 'light';
  const palettes = {
    light: { text: '#111111', muted: '#666666', success: '#2F6F4E', info: '#1967A1' },
    dark: { text: '#FFFFFF', muted: '#B3B3B3', success: '#8CC6A3', info: '#8CCDF5' },
  };
  const load = createSourceLoader({
    '@expo/ui': { Text: (props) => h('Text', props, props.children) },
    '@/hooks/use-theme': { useThemeColors: (value) => palettes[value] },
    '@/components/ui/host/universal-host': {
      useHostColorScheme: (preferred) => preferred ?? scheme,
    },
  });
  const { UniversalTextContent } = load('components/ui/text/universal-text.tsx');
  let setProps;
  function Screen() {
    const [props, updateProps] = useState({ variant: 'label', tone: 'success' });
    setProps = updateProps;
    return h(UniversalTextContent, props, 'Feedback');
  }
  const view = renderFixture(h(Screen));
  const update = (props) => view.flush(() => setProps(props));
  try {
    const text = view.findAll('Text')[0];
    assert.equal(text.props.textStyle.color, palettes.light.success);
    assert.equal(text.props.textStyle.fontWeight, '600');
    scheme = 'dark';
    update({ variant: 'label', tone: 'success' });
    assert.equal(view.findAll('Text')[0], text);
    assert.equal(text.props.textStyle.color, palettes.dark.success);
    update({ variant: 'subtitle', tone: 'info', colorScheme: 'light' });
    assert.equal(text.props.textStyle.color, palettes.light.info);
    assert.equal(text.props.textStyle.fontSize, 20);
    update({
      tone: 'info',
      darkColor: '#ABCDEF',
      fontSize: 22,
      textStyle: { fontWeight: '700' },
    });
    assert.deepEqual(text.props.textStyle, { fontSize: 22, fontWeight: '700', color: '#ABCDEF' });
    update({ tone: 'muted', textStyle: { color: '#123456' } });
    assert.equal(text.props.textStyle.color, '#123456');
    update({});
    assert.equal(text.props.textStyle.color, palettes.dark.text);
    assert.equal(text.props.textStyle.fontSize, undefined);
  } finally {
    view.unmount();
  }
});

test('info feedback queues with other toast variants, deduplicates and ignores stale dismissals', () => {
  const load = createSourceLoader();
  const { showToast, getToast, subscribeToasts, dismissToast } = load('lib/toasts.ts');
  const { getToastPresentation } = load('components/ui/toast/toast-presentation.ts');
  let updates = 0;
  const unsubscribe = subscribeToasts(() => updates++);
  const variants = ['info', 'success', 'warning', 'error'];
  for (const variant of variants)
    showToast({ variant, message: ' A saved draft ', title: ' Draft ' });
  showToast({ variant: 'info', message: 'A saved draft', title: 'Draft' });
  assert.equal(updates, 4);
  const firstId = getToast().id;
  for (const variant of variants) {
    assert.equal(getToast().variant, variant);
    assert.equal(getToast().message, 'A saved draft');
    dismissToast(getToast().id);
    dismissToast(firstId);
  }
  assert.equal(getToast(), null);
  assert.equal(updates, 8);
  const colors = load('constants/themes/whatsapp.ts').whatsappTheme;
  for (const scheme of ['light', 'dark']) {
    assert.deepEqual(getToastPresentation('info', colors[scheme]), {
      accent: colors[scheme].info,
      container: colors[scheme].infoContainer,
      titleKey: 'common.infoNotificationTitle',
    });
  }
  unsubscribe();
});
