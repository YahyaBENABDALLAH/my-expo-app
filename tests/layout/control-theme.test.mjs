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
      'refreshable',
      'scrollContentBackground',
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
    Checkbox: native('Checkbox'),
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
    ].map((name) => load(`components/ui/${name}/${name}.${platform}.tsx`)),
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
    view.flush(() =>
      platform === 'android'
        ? checkbox().props.onCheckedChange(true)
        : checkbox().props.onValueChange(true),
    );
    view.flush(() => slider().props.onValueChange(platform === 'android' ? 27 : 30));
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
      const color = s.colors[scheme].controlActive;
      if (platform === 'android') {
        assert.equal(checkbox().props.colors.checkedColor, color);
        assert.equal(slider().props.colors.activeTrackColor, color);
        assert.equal(
          view.findAll('Dropdown')[0].props.containerColor,
          s.colors[scheme].controlSurface,
        );
      } else {
        for (const node of [checkbox(), slider(), view.findAll('Picker')[0]]) {
          assert.equal(node.props.modifiers.find((m) => m.name === 'tint').args[0], color);
        }
      }
    }
    view.flush(() => setDisabled(true));
    if (platform === 'android') {
      assert.equal(checkbox().props.enabled, false);
      assert.equal(checkbox().props.onCheckedChange, undefined);
      assert.equal(slider().props.onValueChange, undefined);
      assert.equal(view.findAll('DropdownBox')[0].props.onExpandedChange, undefined);
      assert.ok(view.findAll('MenuItem').every((item) => !item.props.onClick));
    } else
      view.flush(() => {
        checkbox().props.onValueChange(false);
        slider().props.onValueChange(80);
        view.findAll('Picker')[0].props.onSelectionChange(1);
      });
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
    if (platform === 'android') {
      assert.equal(row.props.colors.containerColor, s.colors.dark.controlSurface);
      assert.equal(view.findAll('ComposeListItem').length, 4); // Three form rows and one disclosure header.
      view.flush(() => view.findAll('SegmentedButton')[1].props.onClick());
      const header = view.findAll('ComposeListItem').at(-1);
      view.flush(() => header.props.modifiers.find((m) => m.name === 'clickable').args[0]());
      assert.equal(view.findAll('AnimatedVisibility')[0].props.visible, true);
    } else {
      assert.equal(
        row.props.modifiers.find((m) => m.name === 'listRowSeparatorTint').args[0],
        s.colors.dark.divider,
      );
      assert.equal(view.findAll('FieldGroup.Section').length, 3);
      view.flush(() => view.findAll('Picker')[0].props.onSelectionChange('b'));
      view.flush(() => view.findAll('DisclosureGroup')[0].props.onIsExpandedChange(true));
    }
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
      if (platform === 'android') {
        assert.equal(row.props.colors.containerColor, s.colors[scheme].controlSurface);
        assert.equal(row.props.colors.contentColor, s.colors[scheme].text);
        assert.equal(row.props.colors.trailingContentColor, '#123456');
        assert.equal(row.props.modifiers.at(-1).args[0], 'shared-row');
        assert.equal(row.props.leading, 0);
      } else {
        assert.equal(
          row.props.modifiers.find((m) => m.name === 'listRowBackground').args[0],
          s.colors[scheme].controlSurface,
        );
        const supporting = row.props.children.find(
          (child) => child?.type === s.ListItem.Supporting,
        );
        assert.equal(supporting.props.children.props.children, 0);
        assert.equal(supporting.props.children.props.modifiers[0].args[0], s.colors[scheme].muted);
        const trailing = row.props.children.find((child) => child?.type === s.ListItem.Trailing);
        assert.equal(trailing.props.children.props.children.type, 'RichTrailing');
        assert.equal(trailing.props.children.props.modifiers[0].args[0], s.colors[scheme].muted);
      }
      view.flush(row.props.onPress);
    }
    assert.equal(presses, 3);
    view.unmount();
  });
}

test('Android list refresh coalesces overlapping native requests and clears its indicator', async () => {
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
    first = view.findAll('PullToRefreshBox')[0].props.onRefresh();
  });
  view.flush(() => view.findAll('PullToRefreshBox')[0].props.onRefresh());
  assert.equal(calls, 1);
  assert.equal(view.findAll('PullToRefreshBox')[0].props.isRefreshing, true);
  finish();
  await first;
  await new Promise(setImmediate);
  view.flush(() => {});
  assert.equal(view.findAll('PullToRefreshBox')[0].props.isRefreshing, false);
  view.unmount();
});
