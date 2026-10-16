import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createSourceLoader } from '../helpers/load-source.mjs';

// Exercise real Host context and native adapters. Captured native props establish
// the JS contract, not device colors, accessibility or touch geometry.
function setup(platform, themeId = 'whatsapp') {
  const buttons = [];
  const content = [];
  const hosts = [];
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
    '@expo/ui': {
      Host: (props) => {
        hosts.push(props);
        return children(props);
      },
    },
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
  mocks['@/components/ui/button/universal-button-content'] = { UniversalButtonContent };
  const { UniversalButton } = load('components/ui/button/universal-button.tsx');
  const { ThemePreferencesProvider } = load('context/theme.context.tsx');
  const withTheme = (children) =>
    createElement(ThemePreferencesProvider, { initialTheme: themeId }, children);
  const colors = load('constants/colors.ts').default;
  return {
    buttons,
    content,
    hosts,
    colors,
    uxColors: load('constants/themes/index.ts').themes.ux.colors,
    render: (props, host = {}) =>
      renderToStaticMarkup(
        withTheme(createElement(UniversalHost, host, createElement(UniversalButtonContent, props))),
      ),
    standalone: (props) => renderToStaticMarkup(withTheme(createElement(UniversalButton, props))),
  };
}

function accent(button, platform) {
  return platform === 'android'
    ? (button.colors.containerColor ?? button.colors.contentColor)
    : button.modifiers.find(({ kind }) => kind === 'tint').args[0];
}

for (const platform of ['ios', 'android']) {
  test(`${platform}: UX primary fills stay black with white labels in both appearances`, () => {
    const s = setup(platform, 'ux');
    for (const scheme of ['light', 'dark']) {
      s.render({ variant: 'primary' }, { colorScheme: scheme });
      const button = s.buttons.at(-1);
      assert.equal(accent(button, platform), '#000000');
      if (platform === 'android') assert.equal(button.colors.contentColor, '#FFFFFF');
      else
        assert.deepEqual(
          s.content.at(-1).modifiers.find(({ kind }) => kind === 'foregroundStyle').args,
          ['#FFFFFF'],
        );
    }
  });

  test(`${platform}: standalone UX controls respect an explicit scheme and keep caller overrides`, () => {
    const s = setup(platform, 'ux');
    s.standalone({ variant: 'success', colorScheme: 'dark' });
    assert.equal(accent(s.buttons.at(-1), platform), s.uxColors.dark.success);
    s.standalone({ variant: 'primary', colorScheme: 'dark' });
    assert.equal(accent(s.buttons.at(-1), platform), '#000000');
    s.render({ variant: 'primary', color: '#123456', contentColor: '#FEDCBA' });
    assert.equal(accent(s.buttons.at(-1), platform), '#123456');
    s.render({ variant: 'primary', contentColor: '#FEDCBA' });
    if (platform === 'android') assert.equal(s.buttons.at(-1).colors.containerColor, undefined);
    else
      assert.equal(
        s.buttons.at(-1).modifiers.some(({ kind }) => kind === 'tint'),
        false,
      );
  });

  test(`${platform}: UX controls keep neutral actions, semantic feedback pairs and disabled guards`, () => {
    const s = setup(platform, 'ux');
    let presses = 0;
    const handler = platform === 'ios' ? 'onPress' : 'onClick';
    for (const scheme of ['light', 'dark']) {
      for (const variant of [
        'primary',
        'secondary',
        'link',
        'success',
        'warning',
        'destructive',
        'glass',
      ]) {
        s.render({ variant, onPress: () => presses++ }, { colorScheme: scheme });
        const button = s.buttons.at(-1);
        const color = accent(button, platform);
        const [, red, green, blue] = color.match(/^#(..)(..)(..)/);
        const statusRole = { success: 'success', warning: 'warning', destructive: 'error' }[
          variant
        ];
        if (statusRole) {
          assert.equal(color, s.uxColors[scheme][statusRole]);
          assert.ok(
            red !== green || green !== blue,
            `${scheme}/${variant} must have a status color`,
          );
          const label =
            platform === 'android'
              ? button.colors.contentColor
              : s.content.at(-1).modifiers.find(({ kind }) => kind === 'foregroundStyle').args[0];
          const foregroundRole = `on${statusRole[0].toUpperCase()}${statusRole.slice(1)}`;
          assert.equal(label, s.uxColors[scheme][foregroundRole]);
        } else {
          assert.equal(red, green, `${scheme}/${variant} must stay grayscale`);
          assert.equal(green, blue, `${scheme}/${variant} must stay grayscale`);
        }
        button[handler]();
      }
    }
    assert.equal(presses, 14);
    s.render({ variant: 'primary', disabled: true, onPress: () => presses++ });
    assert.equal(s.buttons.at(-1)[handler], undefined);
    assert.equal(presses, 14);
  });

  test(`${platform}: diagonal corners clip the existing Host and preserve native activation`, () => {
    const s = setup(platform);
    let presses = 0;
    for (const cornerRadii of [
      { topLeft: 24, bottomRight: 24 },
      { topRight: 24, bottomLeft: 24 },
    ]) {
      s.standalone({
        variant: 'primary',
        fullWidth: true,
        borderRadius: 12,
        cornerRadii,
        onPress: () => presses++,
      });
      const style = Object.assign({}, ...s.hosts.at(-1).style);
      assert.equal(style.width, '100%');
      assert.equal(style.overflow, 'hidden');
      assert.equal(style.borderTopLeftRadius, cornerRadii.topLeft ?? 0);
      assert.equal(style.borderTopRightRadius, cornerRadii.topRight ?? 0);
      assert.equal(style.borderBottomLeftRadius, cornerRadii.bottomLeft ?? 0);
      assert.equal(style.borderBottomRightRadius, cornerRadii.bottomRight ?? 0);
      const button = s.buttons.at(-1);
      if (platform === 'android') assert.equal(button.shape.cornerRadii.topStart, 0);
      else
        assert.deepEqual(button.modifiers.find(({ kind }) => kind === 'buttonBorderShape').args, [
          'roundedRectangle',
          0,
        ]);
      button[platform === 'ios' ? 'onPress' : 'onClick']();
    }
    assert.equal(presses, 2);
    assert.equal(s.hosts.length, 2);
  });

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
  for (const scheme of ['light', 'dark']) {
    test(`${platform}: native color defaults are untouched in a ${scheme} Host`, () => {
      const s = setup(platform);
      s.render({ variant: 'primary' }, { colorScheme: scheme });
      assert.equal(s.hosts[0].colorScheme, scheme);
      if (platform === 'android') assert.equal(s.buttons[0].colors, undefined);
      else {
        assert.equal(
          s.buttons[0].modifiers.some(({ kind }) => kind === 'tint'),
          false,
        );
        assert.equal(
          s.content[0].modifiers.some(({ kind }) => kind === 'foregroundStyle'),
          false,
        );
      }
      s.standalone({ variant: 'primary', colorScheme: scheme });
      assert.equal(s.hosts.at(-1).colorScheme, scheme);
      assert.equal(s.hosts.at(-1).seedColor, undefined);
    });
  }

  test(`${platform}: supplied colors reach the native control directly`, () => {
    const s = setup(platform);
    s.render({ variant: 'primary', color: '#123456', contentColor: '#fedcba' });
    assert.equal(accent(s.buttons[0], platform), '#123456');
    const contentColor =
      platform === 'android'
        ? s.buttons[0].colors.contentColor
        : s.content[0].modifiers.find(({ kind }) => kind === 'foregroundStyle').args[0];
    assert.equal(contentColor, '#fedcba');
    s.render({ variant: 'link', color: '#123456' });
    assert.equal(accent(s.buttons[1], platform), '#123456');
  });

  test(`${platform}: brand variants retain native styles and default colors`, () => {
    const s = setup(platform);
    for (const variant of [
      'glass',
      'primary',
      'secondary',
      'link',
      'success',
      'warning',
      'destructive',
    ]) {
      s.render({ variant });
    }
    if (platform === 'android') {
      assert.deepEqual(
        s.buttons.map(({ kind }) => kind),
        ['OutlinedButton', 'Button', 'OutlinedButton', 'TextButton', 'Button', 'Button', 'Button'],
      );
      assert.ok(s.buttons.every(({ colors }) => colors === undefined));
    } else {
      assert.deepEqual(
        s.buttons.map(
          (button) => button.modifiers.find(({ kind }) => kind === 'buttonStyle').args[0],
        ),
        [
          'glass',
          'borderedProminent',
          'bordered',
          'plain',
          'borderedProminent',
          'borderedProminent',
          'borderedProminent',
        ],
      );
      assert.equal(s.buttons.at(-1).role, 'destructive');
    }
  });

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
