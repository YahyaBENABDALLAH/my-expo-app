import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h, Fragment, useRef, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(platform) {
  const native = (name) =>
    function NativeFixture(props) {
      return h(name, props, props.children);
    };
  const compound = (name, slots) =>
    Object.assign(
      native(name),
      Object.fromEntries(slots.map((slot) => [slot, native(`${name}.${slot}`)])),
    );
  const modifiers = Object.fromEntries(
    [
      'background',
      'clickable',
      'clip',
      'fillMaxWidth',
      'foregroundStyle',
      'graphicsLayer',
      'listRowBackground',
      'listRowSeparatorTint',
      'menuAnchor',
      'padding',
      'pickerStyle',
      'buttonStyle',
      'refreshable',
      'scrollContentBackground',
      'scrollIndicators',
      'tag',
      'testID',
      'tint',
      'disabled',
      'spring',
      'animated',
    ].map((name) => [name, (...args) => ({ name, args })]),
  );
  modifiers.Shapes = { RoundedCorner: (radii) => ({ radii }) };
  const universal = {
    Host: native('Host'),
    Column: native('Column'),
    Text: native('Text'),
    Switch: native('Switch'),
    Checkbox: native('Checkbox'),
    Collapsible: native('Collapsible'),
    List: native('List'),
    Slider: native('Slider'),
    Picker: compound('UniversalPicker', ['Item']),
    ListItem: compound('ListItem', ['Leading', 'Supporting', 'Trailing']),
    FieldGroup: compound('FieldGroup', ['Section', 'SectionHeader', 'SectionFooter']),
  };
  const transition = { plus: () => transition };
  const compose = {
    ...universal,
    Row: native('Row'),
    LazyColumn: native('LazyColumn'),
    PullToRefreshBox: native('PullToRefreshBox'),
    SegmentedButton: compound('SegmentedButton', ['Label']),
    SingleChoiceSegmentedButtonRow: native('Segments'),
    ExposedDropdownMenuBox: native('DropdownBox'),
    ExposedDropdownMenu: native('Dropdown'),
    DropdownMenuItem: compound('MenuItem', ['Text']),
    TextField: native('TextField'),
    ListItem: compound('ComposeListItem', ['HeadlineContent', 'TrailingContent']),
    AnimatedVisibility: native('AnimatedVisibility'),
    Icon: native('Icon'),
    EnterTransition: { expandVertically: () => transition, fadeIn: () => transition },
    ExitTransition: { shrinkVertically: () => transition, fadeOut: () => transition },
    useNativeState(value) {
      const state = useRef(null);
      if (!state.current)
        state.current = {
          value,
          set(next) {
            this.value = next;
          },
        };
      return state.current;
    },
  };
  const mocks = {
    '@expo/ui': universal,
    '@expo/ui/jetpack-compose': compose,
    '@expo/ui/jetpack-compose/modifiers': modifiers,
    '@expo/ui/swift-ui': {
      ...universal,
      Picker: native('Picker'),
      List: native('List'),
      VStack: native('VStack'),
      HStack: native('HStack'),
      DisclosureGroup: compound('DisclosureGroup', ['Label']),
    },
    '@expo/ui/swift-ui/modifiers': modifiers,
    '@expo/material-symbols/keyboard_arrow_down.xml': 'chevron',
    '@/hooks/use-color-scheme': { useColorScheme: (scheme) => scheme ?? 'light' },
    '@/context/layout-direction.context': { useLayoutDirection: () => 'ltr' },
  };
  const load = createSourceLoader(mocks);
  mocks['@/components/ui/list-item/list-item-appearance'] = load(
    `components/ui/list-item/list-item-appearance.${platform}.tsx`,
  );
  const controls = Object.assign(
    {},
    ...[
      'checkbox',
      'slider',
      'picker',
      'list',
      'field-group',
      'collapsible',
      'segmented-control',
    ].map((name) =>
      load(
        `components/ui/${name}/${name}${['picker', 'segmented-control'].includes(name) || (name === 'field-group' && platform === 'ios') ? `.${platform}` : ''}.tsx`,
      ),
    ),
    load('components/ui/list-item/list-item.tsx'),
  );
  return {
    ...controls,
    UniversalHost: load('components/ui/host/universal-host.tsx').UniversalHost,
    colors: load('constants/colors.ts').default,
  };
}

for (const platform of ['android', 'ios']) {
  test(`${platform}: switching the owning Host theme retains selection and blocks disabled changes`, () => {
    const s = setup(platform);
    let setScheme, setDisabled, values;
    function Screen() {
      const [scheme, changeScheme] = useState('light');
      const [disabled, changeDisabled] = useState(false);
      const [checked, setChecked] = useState(false);
      const [amount, setAmount] = useState(0);
      const [selection, setSelection] = useState(1);
      setScheme = changeScheme;
      setDisabled = changeDisabled;
      values = { checked, amount, selection };
      return h(
        s.UniversalHost,
        { colorScheme: scheme },
        h(s.Checkbox, {
          value: checked,
          label: 'Keep recipe',
          onValueChange: setChecked,
          disabled,
          testID: 'checkbox',
        }),
        h(s.Slider, {
          value: amount,
          min: 0,
          max: 100,
          step: 10,
          onValueChange: setAmount,
          disabled,
        }),
        h(
          s.Picker,
          {
            selectedValue: selection,
            onValueChange: setSelection,
            enabled: !disabled,
            testID: 'picker',
          },
          h(
            Fragment,
            null,
            h(s.Picker.Item, { label: 'Numeric one', value: 1 }),
            h(s.Picker.Item, { label: 'String one', value: '1' }),
          ),
          h('Ignored'),
        ),
      );
    }
    const view = renderFixture(h(Screen));
    const checkbox = () => view.findAll('Checkbox')[0];
    const slider = () => view.findAll('Slider')[0];
    view.flush(() => checkbox().props.onValueChange(true));
    view.flush(() => slider().props.onValueChange(30));
    if (platform === 'android') {
      view.flush(() => view.findAll('DropdownBox')[0].props.onExpandedChange(true));
      assert.equal(view.findAll('MenuItem').length, 2);
      view.flush(() => view.findAll('MenuItem')[1].props.onClick());
      assert.equal(view.findAll('Dropdown')[0].props.expanded, false);
      assert.equal(view.findAll('TextField')[0].props.value.value, 'String one');
    } else view.flush(() => view.findAll('Picker')[0].props.onSelectionChange('1'));
    assert.deepEqual(values, { checked: true, amount: 30, selection: '1' });
    const checkboxInstance = checkbox();
    for (const scheme of ['dark', 'light']) {
      view.flush(() => setScheme(scheme));
      assert.equal(checkbox(), checkboxInstance);
      assert.deepEqual(values, { checked: true, amount: 30, selection: '1' });
      const host = view.findAll('Host')[0];
      assert.equal(host.props.colorScheme, scheme);
      assert.equal(host.props.seedColor, s.colors[scheme].tint);
      assert.equal(checkbox().props.colors, undefined);
      assert.equal(slider().props.colors, undefined);
    }
    view.flush(() => setDisabled(true));
    assert.equal(checkbox().props.disabled, true);
    assert.equal(slider().props.disabled, true);
    view.flush(() => {
      checkbox().props.onValueChange(false);
      slider().props.onValueChange(80);
    });
    if (platform === 'android') {
      assert.equal(view.findAll('DropdownBox')[0].props.onExpandedChange, undefined);
      assert.ok(view.findAll('MenuItem').every((item) => !item.props.onClick));
    } else view.flush(() => view.findAll('Picker')[0].props.onSelectionChange(1));
    assert.deepEqual(values, { checked: true, amount: 30, selection: '1' });
    view.unmount();
  });

  test(`${platform}: compound rows and field sections preserve slots, ordering and native interactions`, () => {
    const s = setup(platform);
    let selected, expanded, selectedSegment;
    function Screen() {
      const [open, setOpen] = useState(false);
      const [segment, setSegment] = useState('a');
      expanded = open;
      selectedSegment = segment;
      return h(
        s.UniversalHost,
        { colorScheme: 'dark' },
        h(s.SegmentedControl, {
          selectedValue: segment,
          onValueChange: setSegment,
          options: [
            { value: 'a', label: 'A', testID: 'a' },
            { value: 'b', label: 'B', testID: 'b' },
          ],
        }),
        h(
          s.List,
          null,
          h(
            s.ListItem,
            {
              onPress: () => {
                selected = 'row';
              },
              supportingText: 'Supporting',
              testID: 'row',
            },
            'Headline',
            h(s.ListItem.Leading, null, 'Icon'),
          ),
        ),
        h(
          s.FieldGroup,
          null,
          h(Fragment, null, h('DirectRow', { key: 'first' })),
          h(
            s.FieldGroup.Section,
            { title: 'Settings' },
            h(s.FieldGroup.SectionHeader, null, h('CustomHeader')),
            h('SettingRow'),
            h(s.FieldGroup.SectionFooter, null, h('CustomFooter')),
          ),
          h('LastRow'),
        ),
        h(s.Collapsible, { label: 'Details', isOpen: open, onOpenChange: setOpen }, h('Detail')),
      );
    }
    const view = renderFixture(h(Screen));
    const row = view.findAll('ListItem')[0];
    view.flush(() => row.props.onPress());
    assert.equal(selected, 'row');
    assert.equal(view.findAll('CustomHeader').length, 1);
    assert.equal(view.findAll('CustomFooter').length, 1);
    for (const type of ['DirectRow', 'SettingRow', 'LastRow'])
      assert.equal(view.findAll(type).length, 1);
    assert.equal(row.props.colors, undefined);
    if (platform === 'android')
      view.flush(() => view.findAll('SegmentedButton')[1].props.onClick());
    else view.flush(() => view.findAll('Picker')[0].props.onSelectionChange('b'));
    view.flush(() => view.findAll('Collapsible')[0].props.onOpenChange(true));
    assert.equal(view.findAll('Collapsible')[0].props.isOpen, true);
    assert.equal(selectedSegment, 'b');
    assert.equal(expanded, true);
    view.unmount();
  });
}

for (const platform of ['ios', 'android']) {
  test(`${platform}: the shared row retains slots, caller overrides and actions across live Host themes`, () => {
    const s = setup(platform);
    let setScheme;
    let presses = 0;
    const customModifier = { name: 'custom' };
    const richSupporting = h('RichSupporting');
    function Screen() {
      const [scheme, changeScheme] = useState('light');
      setScheme = changeScheme;
      return h(
        s.UniversalHost,
        { colorScheme: scheme },
        h(
          s.ListItem,
          {
            supportingText: richSupporting,
            leading: 0,
            trailing: 'Open',
            colors: { trailingContentColor: '#123456' },
            modifiers: [customModifier],
            testID: 'shared-row',
            onPress: () => presses++,
          },
          h(
            Fragment,
            null,
            'Headline',
            h(Fragment, null, h(s.ListItem.Supporting, null, 0)),
            h(s.ListItem.Leading, null, 'Badge'),
            h(s.ListItem.Trailing, null, h('RichTrailing')),
          ),
        ),
      );
    }
    const view = renderFixture(h(Screen));
    const instance = view.findAll('ListItem')[0];
    for (const scheme of ['light', 'dark', 'light']) {
      view.flush(() => setScheme(scheme));
      const row = view.findAll('ListItem')[0];
      assert.equal(row, instance);
      assert.equal(row.props.testID, 'shared-row');
      assert.equal(row.props.supportingText, richSupporting);
      assert.ok(row.props.modifiers.includes(customModifier));
      assert.equal(row.props.colors.trailingContentColor, '#123456');
      assert.equal(row.props.leading, 0);
      assert.equal(row.props.trailing, 'Open');
      if (platform === 'android') assert.equal(row.props.modifiers.at(-1).args[0], 'shared-row');
      const supporting = view.findAll('ListItem.Supporting')[0];
      assert.equal(supporting.props.children, 0);
      assert.equal(view.findAll('RichTrailing').length, 1);
      view.flush(row.props.onPress);
    }
    assert.equal(presses, 3);
    view.unmount();
  });
}

test('list refresh coalesces overlapping native requests and releases them after completion', async () => {
  const s = setup('android');
  let finish,
    calls = 0;
  const pending = new Promise((resolve) => {
    finish = resolve;
  });
  const view = renderFixture(
    h(
      s.UniversalHost,
      { colorScheme: 'light' },
      h(s.List, {
        onRefresh: () => {
          calls++;
          return pending;
        },
      }),
    ),
  );
  let first;
  view.flush(() => {
    first = view.findAll('List')[0].props.onRefresh();
  });
  view.flush(() => view.findAll('List')[0].props.onRefresh());
  await Promise.resolve();
  assert.equal(calls, 1);
  finish();
  await first;
  await new Promise(setImmediate);
  view.flush(() => {});
  await view.findAll('List')[0].props.onRefresh();
  assert.equal(calls, 2);
  view.unmount();
});
