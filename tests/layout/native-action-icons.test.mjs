import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(platform, scheme = 'dark') {
  const native = (name) => (props) => h(name, props, props.children);
  const modifiers = Object.fromEntries(
    [
      'accessibilityAddTraits',
      'accessibilityLabel',
      'background',
      'buttonStyle',
      'clip',
      'contentShape',
      'disabled',
      'fillMaxWidth',
      'font',
      'foregroundStyle',
      'frame',
      'height',
      'selectable',
      'semantics',
      'size',
      'testID',
    ].map((kind) => [kind, (...args) => ({ $type: kind, kind, args })]),
  );
  modifiers.shapes = {
    circle: () => 'circle',
    capsule: () => 'capsule',
    rectangle: () => 'rectangle',
  };
  modifiers.Shapes = { RoundedCorner: (radius) => ({ radius }) };
  const assets = Object.fromEntries(
    [
      'home',
      'search',
      'menu_book',
      'menu',
      'tune',
      'fork_spoon',
      'add',
      'favorite',
      'chef_hat',
      'check',
    ].map((name, index) => [`@expo/material-symbols/${name}.xml`, index + 1]),
  );
  let colors;
  const mocks = {
    ...assets,
    'react-native': { Platform: { OS: platform } },
    '@expo/ui': {},
    '@expo/ui/swift-ui': {
      Button: native('Button'),
      HStack: native('HStack'),
      VStack: native('VStack'),
      Image: native('Icon'),
      Text: native('Text'),
    },
    '@expo/ui/jetpack-compose': {
      Button: native('Button'),
      Column: native('Column'),
      Box: native('Box'),
      Icon: native('Icon'),
      Text: native('Text'),
      Shape: { Circle: () => 'circle' },
    },
    '@expo/ui/swift-ui/modifiers': modifiers,
    '@expo/ui/jetpack-compose/modifiers': modifiers,
    '@/hooks/use-theme': { useThemeColors: () => colors },
    '@/components/ui/host/universal-host': { useHostColorScheme: () => scheme },
  };
  const load = createSourceLoader(mocks);
  colors = load('constants/colors.ts').default[scheme];
  // Exercise the installed universal icon's actual native dispatch, mocking only native views.
  mocks['../transformStyle'] = load(
    `../node_modules/@expo/ui/src/universal/transformStyle.${platform}.ts`,
  );
  mocks['@expo/ui'].Icon = load(
    `../node_modules/@expo/ui/src/universal/Icon/index.${platform}.tsx`,
  ).Icon;
  return {
    colors,
    assets,
    NavigationTab: load(`components/ui/navigation/navigation-tab.${platform}.tsx`).NavigationTab,
    FloatingActionButton: load(
      `components/ui/floating-action/floating-action-button.${platform}.tsx`,
    ).FloatingActionButton,
  };
}

const modifier = (node, kind) => node.props.modifiers.find((item) => item.kind === kind).args;

for (const platform of ['ios', 'android']) {
  test(`${platform}: shared tab icons preserve selected Home, native target and tab accessibility`, () => {
    const s = setup(platform);
    let presses = 0;
    for (const [name, iosName, androidName] of [
      ['index', 'house', 'home'],
      ['search', 'magnifyingglass', 'search'],
      ['recipes', 'book', 'menu_book'],
      ['more', 'line.3.horizontal', 'menu'],
    ]) {
      for (const selected of [false, true]) {
        const view = renderFixture(
          h(s.NavigationTab, {
            name,
            selected,
            label: `Go to ${name}`,
            color: '#123456',
            selectedBackgroundColor: '#abcdef',
            testID: `tab-${name}`,
            onPress: () => presses++,
          }),
        );
        const icon = view.findAll('Icon')[0];
        assert.equal(icon.props.size, name === 'index' ? 22 : 21);
        if (platform === 'ios') {
          assert.equal(
            icon.props.systemName,
            name === 'index' && selected ? 'house.fill' : iosName,
          );
          assert.equal(icon.props.color, '#123456');
          assert.equal(modifier(icon, 'background')[0], selected ? '#abcdef' : 'transparent');
          assert.deepEqual(modifier(icon, 'frame')[0], { width: 44, height: 28 });
          const target = view.findAll('Button')[0];
          assert.equal(target.props.testID, `tab-${name}`);
          assert.equal(modifier(target, 'accessibilityLabel')[0], `Go to ${name}`);
          assert.deepEqual(
            modifier(target, 'accessibilityAddTraits')[0],
            selected ? ['isSelected'] : [],
          );
          assert.equal(modifier(view.findAll('VStack')[0], 'frame')[0].height, 56);
          view.flush(target.props.onPress);
        } else {
          assert.equal(icon.props.source, s.assets[`@expo/material-symbols/${androidName}.xml`]);
          assert.equal(icon.props.tint, '#123456');
          const target = view.findAll('Column')[0];
          assert.equal(modifier(target, 'height')[0], 56);
          assert.equal(modifier(target, 'testID')[0], `tab-${name}`);
          assert.equal(modifier(target, 'semantics')[0].contentDescription, `Go to ${name}`);
          const [isSelected, activate, role] = modifier(target, 'selectable');
          assert.equal(isSelected, selected);
          assert.equal(role, 'tab');
          view.flush(activate);
        }
        view.unmount();
      }
    }
    assert.equal(presses, 8);
  });

  test(`${platform}: shared action icons retain palette, circular control and disabled native state`, () => {
    for (const scheme of ['light', 'dark']) {
      const s = setup(platform, scheme);
      let presses = 0;
      for (const [kind, iosName, androidName] of [
        ['create', 'fork.knife', 'fork_spoon'],
        ['continue', 'plus', 'add'],
        ['filters', 'slider.horizontal.3', 'tune'],
        ['active-filters', 'slider.horizontal.3', 'tune'],
        ['liked', 'heart.fill', 'favorite'],
        ['profile', 'fork.knife', 'chef_hat'],
        ['submit', 'checkmark', 'check'],
      ]) {
        for (const disabled of [false, true]) {
          const view = renderFixture(
            h(s.FloatingActionButton, {
              kind,
              disabled,
              label: `Action ${kind}`,
              onPress: () => presses++,
            }),
          );
          const icon = view.findAll('Icon')[0];
          const target = view.findAll('Button')[0];
          assert.equal(icon.props.size, 28);
          if (platform === 'ios') {
            assert.equal(icon.props.systemName, iosName);
            assert.equal(icon.props.color, s.colors.onPrimary);
            assert.equal(modifier(target, 'disabled')[0], disabled);
            assert.equal(modifier(target, 'accessibilityLabel')[0], `Action ${kind}`);
            assert.equal(target.props.testID, 'tab-context-action');
            assert.deepEqual(modifier(view.findAll('HStack')[0], 'frame')[0], {
              width: 76,
              height: 76,
            });
            if (!disabled) view.flush(target.props.onPress);
          } else {
            assert.equal(icon.props.source, s.assets[`@expo/material-symbols/${androidName}.xml`]);
            assert.equal(icon.props.tint, s.colors.onPrimary);
            assert.equal(target.props.enabled, !disabled);
            assert.equal(target.props.shape, 'circle');
            assert.equal(target.props.colors.containerColor, 'transparent');
            assert.equal(target.props.colors.disabledContainerColor, 'transparent');
            assert.deepEqual(target.props.contentPadding, { start: 0, end: 0, top: 0, bottom: 0 });
            assert.deepEqual(modifier(target, 'size'), [76, 76]);
            assert.equal(modifier(target, 'semantics')[0].contentDescription, `Action ${kind}`);
            if (!disabled) view.flush(target.props.onClick);
          }
          view.unmount();
        }
      }
      assert.equal(presses, 7);
    }
  });
}
