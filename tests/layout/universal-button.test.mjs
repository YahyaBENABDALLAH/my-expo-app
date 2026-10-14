import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createSourceLoader } from '../helpers/load-source.mjs';

// Exercise real Host context and native adapters. Captured native props establish
// the JS contract, not device colors, accessibility or touch geometry.
function setup(platform) {
  const buttons = [];
  const content = [];
  const children = ({ children }) => createElement('div', null, children);
  const nativeButton = (kind) => (props) => {
    buttons.push({ kind, ...props });
    return children(props);
  };
  const modifier =
    (kind) =>
    (...args) => ({ kind, args });
  const modifiers = Object.fromEntries(
    [
      'buttonStyle',
      'buttonBorderShape',
      'clipShape',
      'padding',
      'disabled',
      'foregroundStyle',
      'frame',
      'tint',
      'fillMaxWidth',
      'testID',
    ].map((name) => [name, modifier(name)]),
  );
  const mocks = {
    '@expo/ui': { Host: children },
    '@/hooks/use-color-scheme': { useColorScheme: (preferred) => preferred ?? 'light' },
    '@/context/layout-direction.context': { useLayoutDirection: () => 'ltr' },
    '@expo/ui/swift-ui': {
      Button: nativeButton('Button'),
      Text: children,
      VStack: (props) => {
        content.push(props);
        return children(props);
      },
    },
    '@expo/ui/jetpack-compose': {
      Shape: { RoundedCorner: (props) => ({ ...props, kind: 'roundedCorner' }) },
      Button: nativeButton('Button'),
      OutlinedButton: nativeButton('OutlinedButton'),
      TextButton: nativeButton('TextButton'),
      Text: children,
    },
    '@expo/ui/swift-ui/modifiers': modifiers,
    '@expo/ui/jetpack-compose/modifiers': modifiers,
  };
  const load = createSourceLoader(mocks);
  const { UniversalHost } = load('components/ui/host/universal-host.tsx');
  const { UniversalButtonContent } = load(
    `components/ui/button/universal-button-content.${platform}.tsx`,
  );
  const { authButtonPalettes } = load('components/ui/auth/auth-theme.ts');
  mocks['@/components/ui/button/universal-button-content'] = { UniversalButtonContent };
  const { UniversalButton } = load('components/ui/button/universal-button.tsx');
  const colors = load('constants/colors.ts').default;
  return {
    buttons,
    content,
    colors,
    authButtonPalettes,
    render: (props, host = {}) =>
      renderToStaticMarkup(
        createElement(UniversalHost, host, createElement(UniversalButtonContent, props)),
      ),
    standalone: (props) => renderToStaticMarkup(createElement(UniversalButton, props)),
  };
}

function accent(button, platform) {
  return platform === 'android'
    ? (button.colors.containerColor ?? button.colors.contentColor)
    : button.modifiers.find(({ kind }) => kind === 'tint').args[0];
}

for (const platform of ['ios', 'android']) {
  test(`${platform}: card geometry accepts zero rounding and padding while ordinary buttons retain native defaults`, () => {
    const s = setup(platform);
    s.render({ variant: 'link', borderRadius: 0, contentPadding: 0 });
    s.render({ variant: 'primary' });
    if (platform === 'android') {
      assert.deepEqual(s.buttons[0].shape.cornerRadii, {
        topStart: 0,
        topEnd: 0,
        bottomStart: 0,
        bottomEnd: 0,
      });
      assert.deepEqual(s.buttons[0].contentPadding, { start: 0, end: 0, top: 0, bottom: 0 });
      assert.equal(s.buttons[1].shape, undefined);
      assert.equal(s.buttons[1].contentPadding, undefined);
    } else {
      assert.deepEqual(s.buttons[0].modifiers.find(({ kind }) => kind === 'clipShape').args, [
        'roundedRectangle',
        0,
      ]);
      assert.deepEqual(
        s.buttons[0].modifiers.find(({ kind }) => kind === 'buttonBorderShape').args,
        ['roundedRectangle', 0],
      );
      assert.deepEqual(s.content[0].modifiers.find(({ kind }) => kind === 'padding').args, [
        { all: 0 },
      ]);
      assert.equal(
        s.buttons[1].modifiers.some(({ kind }) => kind === 'clipShape'),
        false,
      );
      assert.equal(
        s.buttons[1].modifiers.some(({ kind }) => kind === 'buttonBorderShape'),
        false,
      );
      assert.equal(
        s.content[1].modifiers.some(({ kind }) => kind === 'padding'),
        false,
      );
    }
  });
  test(`${platform}: standalone custom radius reaches the native button surface`, () => {
    const s = setup(platform);
    s.standalone({ variant: 'primary', borderRadius: 12 });
    s.standalone({ variant: 'secondary', borderRadius: 4, disabled: true });
    if (platform === 'android') {
      assert.deepEqual(s.buttons[0].shape.cornerRadii, {
        topStart: 12,
        topEnd: 12,
        bottomStart: 12,
        bottomEnd: 12,
      });
      assert.equal(s.buttons[1].shape.cornerRadii.topStart, 4);
    } else {
      assert.deepEqual(
        s.buttons.map(
          (button) => button.modifiers.find(({ kind }) => kind === 'buttonBorderShape').args,
        ),
        [
          ['roundedRectangle', 12],
          ['roundedRectangle', 4],
        ],
      );
      assert.deepEqual(
        s.buttons.map(
          (button) => button.modifiers.find(({ kind }) => kind === 'buttonStyle').args[0],
        ),
        ['borderedProminent', 'bordered'],
      );
    }
  });
  test(`${platform}: buttons inherit the owning Host scheme and auth palette`, () => {
    const s = setup(platform);
    s.render(
      { variant: 'primary', label: 'Sign in' },
      { colorScheme: 'dark', buttonPalette: s.authButtonPalettes.dark },
    );
    assert.equal(accent(s.buttons[0], platform), s.authButtonPalettes.dark.primary);
    if (platform === 'android')
      assert.equal(s.buttons[0].colors.contentColor, s.authButtonPalettes.dark.onAccent);
    else
      assert.equal(
        s.content[0].modifiers.find(({ kind }) => kind === 'foregroundStyle').args[0],
        s.authButtonPalettes.dark.onAccent,
      );
  });

  test(`${platform}: explicit palette and scheme override inherited appearance`, () => {
    const s = setup(platform);
    s.render(
      { variant: 'primary', palette: s.authButtonPalettes.light },
      { colorScheme: 'dark', buttonPalette: s.authButtonPalettes.dark },
    );
    assert.equal(accent(s.buttons[0], platform), s.authButtonPalettes.light.primary);
    s.render({ variant: 'primary', colorScheme: 'light' }, { colorScheme: 'dark' });
    assert.equal(accent(s.buttons[1], platform), s.colors.light.primary);
  });

  for (const scheme of ['light', 'dark']) {
    test(`${platform}: each semantic intent uses its ${scheme} accent and foreground`, () => {
      const s = setup(platform);
      for (const [variant, role, foreground] of [
        ['primary', 'primary', 'onPrimary'],
        ['secondary', 'secondary', 'secondary'],
        ['link', 'tint', 'tint'],
        ['success', 'success', 'onSuccess'],
        ['warning', 'warning', 'onWarning'],
        ['destructive', 'error', 'onError'],
      ]) {
        s.render({ variant }, { colorScheme: scheme });
        assert.equal(accent(s.buttons.at(-1), platform), s.colors[scheme][role]);
        const contentColor =
          platform === 'android'
            ? s.buttons.at(-1).colors.contentColor
            : s.content.at(-1).modifiers.find(({ kind }) => kind === 'foregroundStyle').args[0];
        assert.equal(contentColor, s.colors[scheme][foreground]);
      }
      if (platform === 'android')
        assert.deepEqual(
          s.buttons.map(({ kind }) => kind),
          ['Button', 'OutlinedButton', 'TextButton', 'Button', 'Button', 'Button'],
        );
      else
        assert.deepEqual(
          s.buttons.map(
            (button) => button.modifiers.find(({ kind }) => kind === 'buttonStyle').args[0],
          ),
          [
            'borderedProminent',
            'bordered',
            'plain',
            'borderedProminent',
            'borderedProminent',
            'borderedProminent',
          ],
        );
    });
  }

  test(`${platform}: standalone and hosted controls forward one action and suppress disabled actions`, () => {
    const s = setup(platform);
    let presses = 0;
    s.standalone({ variant: 'primary', onPress: () => presses++ });
    const handler = platform === 'ios' ? 'onPress' : 'onClick';
    s.buttons[0][handler]();
    assert.equal(presses, 1);
    s.render({ variant: 'secondary', disabled: true, onPress: () => presses++ });
    assert.equal(s.buttons[1][handler], undefined);
    if (platform === 'android') assert.equal(s.buttons[1].enabled, false);
    else assert.equal(s.buttons[1].modifiers.find(({ kind }) => kind === 'disabled').args[0], true);
    assert.equal(presses, 1);
  });

  test(`${platform}: custom content takes priority and full width reaches the native surface`, () => {
    const s = setup(platform);
    const output = s.render({
      variant: 'primary',
      label: 'Fallback label',
      fullWidth: true,
      children: createElement('span', null, 'Custom label'),
    });
    assert.ok(output.includes('Custom label'));
    assert.equal(output.includes('Fallback label'), false);
    if (platform === 'android')
      assert.ok(s.buttons[0].modifiers.some(({ kind }) => kind === 'fillMaxWidth'));
    else
      assert.equal(
        s.content[0].modifiers.find(({ kind }) => kind === 'frame').args[0].maxWidth,
        Infinity,
      );
  });
}
