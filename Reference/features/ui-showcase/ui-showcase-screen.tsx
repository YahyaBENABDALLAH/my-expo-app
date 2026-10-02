import { BottomSheet } from "@/components/Universal/bottom-sheet";
import { Button } from "@/components/Universal/button";
import { Checkbox } from "@/components/Universal/checkbox";
import { Collapsible } from "@/components/Universal/collapsible";
import { DateTimePicker } from "@/components/Universal/date-time-picker";
import { FieldGroup } from "@/components/Universal/field-group";
import { Host } from "@/components/Universal/host";
import { Icon, icons } from "@/components/Universal/icon";
import {
  Column,
  Row,
  Spacer,
  ScrollView as UniversalScrollView,
} from "@/components/Universal/layout";
import { List, ListItem } from "@/components/Universal/list";
import { MenuView } from "@/components/Universal/menu-view";
import { Picker } from "@/components/Universal/picker";
import { RNHostView } from "@/components/Universal/rn-host-view";
import { SegmentedControl } from "@/components/Universal/segmented-control";
import { Slider } from "@/components/Universal/slider";
import { Switch } from "@/components/Universal/switch";
import { Text } from "@/components/Universal/text";
import {
  TextInput,
  useNativeState,
} from "@/components/Universal/text-input";
import { useAlert } from "@/components/ui/alert";
import { useState, type ReactNode } from "react";
import {
  Pressable,
  Text as RNText,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const menuActions = [
  { id: "edit", title: "Edit" },
  { id: "share", title: "Share" },
  { id: "delete", title: "Delete", attributes: { destructive: true } },
] as const;

export default function UniversalComponentCatalog() {
  const alert = useAlert();
  const inputValue = useNativeState("Foodiya");
  const [checked, setChecked] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [switchValue, setSwitchValue] = useState(true);
  const [sliderValue, setSliderValue] = useState(40);
  const [pickerValue, setPickerValue] = useState("breakfast");
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [sheetPresented, setSheetPresented] = useState(false);
  const [lastAction, setLastAction] = useState("None");

  // ── Bottom sheet internal states ──
  const [sheetSwitch, setSheetSwitch] = useState(false);
  const [sheetChecked, setSheetChecked] = useState(false);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1">Expo Universal UI</Text>
        <Text semantic="muted">
          One Android and iOS catalog for every approved component.
        </Text>

        <Section title="Text">
          <Text variant="h2">Themed heading</Text>
          <Text semantic="primary">Primary semantic text</Text>
          <Text semantic="success">Success semantic text</Text>
        </Section>

        <Section title="TextInput">
          <TextInput
            value={inputValue}
            label="Recipe name"
            placeholder="Enter a name"
            helperText="Expo ObservableState with shared field tokens"
            leftIcon={{ icon: icons.food }}
          />
        </Section>

        <Section title="Button · Variants">
          <Button label="Filled (primary)" onPress={() => {}} />
          <Button
            label="Outlined"
            variant="outlined"
            semantic="secondary"
            onPress={() => {}}
          />
          <Button
            label="Text button"
            variant="text"
            semantic="primary"
            onPress={() => {}}
          />
        </Section>

        <Section title="Button · Loading state">
          <Button label="Loading…" loading onPress={() => {}} />
          <Button
            label="Loading outlined"
            variant="outlined"
            loading
            onPress={() => {}}
          />
          <Button
            label="Loading text"
            variant="text"
            loading
            onPress={() => {}}
          />
        </Section>

        <Section title="Button · Sizes">
          <Button label="Small" size="sm" onPress={() => {}} />
          <Button label="Medium (default)" size="md" onPress={() => {}} />
          <Button label="Large" size="lg" onPress={() => {}} />
        </Section>

        <Section title="Button · Semantics">
          <Button label="Primary" semantic="primary" onPress={() => {}} />
          <Button
            label="Destructive"
            semantic="destructive"
            onPress={() => {}}
          />
          <Button label="Success" semantic="success" onPress={() => {}} />
          <Button label="Warning" semantic="warning" onPress={() => {}} />
          <Button label="Info" semantic="info" onPress={() => {}} />
          <Button label="Default" semantic="default" onPress={() => {}} />
        </Section>

        <Section title="Alert · Native dialogs">
          <Button
            label="Success alert"
            semantic="success"
            onPress={() =>
              alert.success("Saved", "Your changes are ready.")
            }
          />
          <Button
            label="Validation alert"
            semantic="destructive"
            onPress={() =>
              alert.error("Invalid request", [
                "Email: This field is invalid.",
                "Password: This field is invalid.",
              ])
            }
          />
        </Section>

        <Section title="Button · Shapes">
          <Button label="Rounded" shape="rounded" onPress={() => {}} />
          <Button label="Pill" shape="pill" onPress={() => {}} />
          <Button label="Square" shape="square" onPress={() => {}} />
        </Section>

        <Section title="Button · Full width & Disabled">
          <Button label="Full width button" fullWidth onPress={() => {}} />
          <Button label="Disabled" disabled onPress={() => {}} />
          <Button
            label="Disabled outlined"
            variant="outlined"
            disabled
            onPress={() => {}}
          />
        </Section>

        <Section title="Checkbox">
          <Checkbox
            label="Include optional ingredients"
            value={checked}
            onValueChange={setChecked}
          />
        </Section>

        <Section title="Collapsible">
          <Collapsible
            isOpen={expanded}
            label="Cooking details"
            onOpenChange={setExpanded}
          >
            <Text semantic="muted">Native collapsible content.</Text>
          </Collapsible>
        </Section>

        <Section title="Host · Column · Row · Spacer · Icon">
          <Host matchContents={{ vertical: true }}>
            <Column spacing={12} style={{ padding: 12, width: 320 }}>
              <Text weight="bold">Native layout tree</Text>
              <Row alignment="center" spacing={10}>
                <Icon name={icons.checkCircle} />
                <Text>Row content</Text>
                <Spacer flexible />
                <Text semantic="primary">End</Text>
              </Row>
            </Column>
          </Host>
        </Section>

        <Section title="FieldGroup">
          <Host style={styles.fieldGroupHost}>
            <FieldGroup>
              <FieldGroup.Section title="Preferences">
                <ListItem trailing={<Text>On</Text>}>Notifications</ListItem>
                <ListItem supportingText="Follows your app theme">
                  Appearance
                </ListItem>
              </FieldGroup.Section>
            </FieldGroup>
          </Host>
        </Section>

        <Section title="List · ListItem">
          <Host style={styles.listHost}>
            <List>
              <ListItem supportingText="Universal native row">Breakfast</ListItem>
              <ListItem trailing={<Text>12</Text>}>Favorites</ListItem>
            </List>
          </Host>
        </Section>

        <Section title="Picker">
          <Host matchContents>
            <Picker
              selectedValue={pickerValue}
              onValueChange={setPickerValue}
            >
              <Picker.Item label="Breakfast" value="breakfast" />
              <Picker.Item label="Lunch" value="lunch" />
              <Picker.Item label="Dinner" value="dinner" />
            </Picker>
          </Host>
        </Section>

        <Section title="Slider">
          <Text semantic="muted">{`Value: ${sliderValue}`}</Text>
          <Host matchContents>
            <Column style={{ width: 320 }}>
              <Slider
                min={0}
                max={100}
                step={5}
                value={sliderValue}
                onValueChange={setSliderValue}
              />
            </Column>
          </Host>
        </Section>

        <Section title="Switch">
          <Switch value={switchValue} onValueChange={setSwitchValue} />
        </Section>

        <Section title="Universal ScrollView">
          <Host style={styles.universalScrollHost}>
            <UniversalScrollView showsIndicators>
              <Column spacing={8} style={{ padding: 12 }}>
                <Text>Native scroll row 1</Text>
                <Text>Native scroll row 2</Text>
                <Text>Native scroll row 3</Text>
                <Text>Native scroll row 4</Text>
                <Text>Native scroll row 5</Text>
              </Column>
            </UniversalScrollView>
          </Host>
        </Section>

        <Section title="RNHostView">
          <Host matchContents>
            <RNHostView matchContents>
              <View style={styles.rnHostedContent}>
                <RNText style={styles.rnHostedText}>
                  React Native content inside the native Expo tree
                </RNText>
              </View>
            </RNHostView>
          </Host>
        </Section>

        <Section title="DateTimePicker · Date">
          <Button
            label={showDatePicker ? "Close date picker" : "Open date picker"}
            variant={showDatePicker ? "outlined" : "filled"}
            onPress={() => setShowDatePicker((v) => !v)}
          />
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              presentation="inline"
              onValueChange={(_event, date) => setSelectedDate(date)}
            />
          )}
        </Section>

        <Section title="DateTimePicker · Time (Hours)">
          <Button
            label={showTimePicker ? "Close time picker" : "Pick hours"}
            variant={showTimePicker ? "outlined" : "filled"}
            onPress={() => setShowTimePicker((v) => !v)}
          />
          {showTimePicker && (
            <>
              <Text semantic="muted">
                {`Selected time: ${selectedDate.getHours().toString().padStart(2, "0")}:${selectedDate.getMinutes().toString().padStart(2, "0")}`}
              </Text>
              <DateTimePicker
                value={selectedDate}
                mode="time"
                onValueChange={(_event, date) => setSelectedDate(date)}
              />
            </>
          )}
        </Section>

        <Section title="DateTimePicker · DateTime">
          <Button
            label={showDateTimePicker ? "Close datetime picker" : "Pick date & time"}
            variant={showDateTimePicker ? "outlined" : "filled"}
            onPress={() => setShowDateTimePicker((v) => !v)}
          />
          {showDateTimePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="datetime"
              onValueChange={(_event, date) => setSelectedDate(date)}
            />
          )}
        </Section>

        <Section title="SegmentedControl">
          <SegmentedControl
            values={["Recipes", "Chefs", "Tags"]}
            selectedIndex={segmentIndex}
            onChange={(event) =>
              setSegmentIndex(event.nativeEvent.selectedSegmentIndex)
            }
          />
        </Section>

        <Section title="Menu">
          <MenuView
            title="Recipe actions"
            actions={[...menuActions]}
            onPressAction={(event) => setLastAction(event.nativeEvent.event)}
          >
            <View style={styles.menuTrigger}>
              <RNText style={styles.menuTriggerText}>Open menu</RNText>
            </View>
          </MenuView>
          <Text semantic="muted">{`Last action: ${lastAction}`}</Text>
        </Section>

        <Section title="BottomSheet">
          <Button
            label="Open bottom sheet"
            onPress={() => setSheetPresented(true)}
          />
        </Section>
      </ScrollView>

      <BottomSheet
        contentPadding={0}
        isPresented={sheetPresented}
        onDismiss={() => setSheetPresented(false)}
        showDragIndicator
        snapPoints={["half", "full"]}
      >
        <UniversalScrollView showsIndicators>
          <RNHostView matchContents>
            <View style={styles.sheetContent}>
              {/* ── Header ── */}
              <RNText style={styles.sheetTitle}>Component Showcase</RNText>
              <RNText style={styles.sheetBody}>
                A rich bottom sheet with a big list of interactive components.
              </RNText>

              {/* ── List section: Popular recipes ── */}
              <RNText style={styles.sheetSectionTitle}>
                Popular recipes
              </RNText>
              {[
                { emoji: "🥗", name: "Caesar Salad", sub: "Quick & easy" },
                {
                  emoji: "🍝",
                  name: "Spaghetti Carbonara",
                  sub: "30 min prep",
                },
                {
                  emoji: "🍕",
                  name: "Margherita Pizza",
                  sub: "Family favorite",
                },
                {
                  emoji: "🥑",
                  name: "Avocado Toast",
                  sub: "Healthy choice",
                },
                { emoji: "🍰", name: "Tiramisu", sub: "Classic dessert" },
                {
                  emoji: "🥞",
                  name: "Fluffy Pancakes",
                  sub: "Morning boost",
                },
                { emoji: "🍜", name: "Ramen Bowl", sub: "Comfort food" },
                {
                  emoji: "🥩",
                  name: "Steak au Poivre",
                  sub: "Grilled perfection",
                },
                {
                  emoji: "🌮",
                  name: "Tacos al Pastor",
                  sub: "Street food",
                },
                {
                  emoji: "🍣",
                  name: "Salmon Sushi",
                  sub: "Fresh & light",
                },
              ].map((item) => (
                <View key={item.name} style={styles.sheetListItem}>
                  <RNText style={styles.sheetListEmoji}>{item.emoji}</RNText>
                  <View style={styles.sheetListItemText}>
                    <RNText style={styles.sheetListItemTitle}>
                      {item.name}
                    </RNText>
                    <RNText style={styles.sheetListItemSub}>
                      {item.sub}
                    </RNText>
                  </View>
                </View>
              ))}

              {/* ── List section: Categories ── */}
              <RNText style={styles.sheetSectionTitle}>Categories</RNText>
              {[
                { emoji: "🍳", name: "Breakfast", count: 24 },
                { emoji: "🥗", name: "Lunch", count: 18 },
                { emoji: "🍽️", name: "Dinner", count: 32 },
                { emoji: "🍰", name: "Desserts", count: 15 },
                { emoji: "🥤", name: "Drinks", count: 9 },
                { emoji: "🥜", name: "Snacks", count: 12 },
                { emoji: "🍲", name: "Soups", count: 7 },
                { emoji: "🥧", name: "Pastries", count: 11 },
              ].map((cat) => (
                <View key={cat.name} style={styles.sheetListItem}>
                  <RNText style={styles.sheetListEmoji}>{cat.emoji}</RNText>
                  <RNText style={styles.sheetListItemTitle}>
                    {cat.name}
                  </RNText>
                  <View style={{ flex: 1 }} />
                  <View style={styles.sheetBadge}>
                    <RNText style={styles.sheetBadgeText}>
                      {cat.count}
                    </RNText>
                  </View>
                </View>
              ))}

              {/* ── Settings ── */}
              <RNText style={styles.sheetSectionTitle}>Settings</RNText>

              <Pressable
                style={styles.sheetRow}
                onPress={() => setSheetSwitch((v) => !v)}
              >
                <RNText style={styles.sheetRowLabel}>Notifications</RNText>
                <View
                  style={[
                    styles.sheetToggle,
                    sheetSwitch && styles.sheetToggleOn,
                  ]}
                >
                  <View
                    style={[
                      styles.sheetToggleThumb,
                      sheetSwitch && styles.sheetToggleThumbOn,
                    ]}
                  />
                </View>
              </Pressable>

              <Pressable
                style={styles.sheetRow}
                onPress={() => setSheetChecked((v) => !v)}
              >
                <RNText style={styles.sheetRowLabel}>
                  Save preferences
                </RNText>
                <View
                  style={[
                    styles.sheetCheckbox,
                    sheetChecked && styles.sheetCheckboxOn,
                  ]}
                >
                  {sheetChecked && (
                    <RNText style={styles.sheetCheckmark}>✓</RNText>
                  )}
                </View>
              </Pressable>

              {/* ── Quick actions ── */}
              <RNText style={styles.sheetSectionTitle}>Quick actions</RNText>
              <View style={styles.sheetIconRow}>
                {["❤️", "🔗", "⭐", "🔔", "🔍", "⚙️"].map((icon) => (
                  <Pressable key={icon} style={styles.sheetIconBtn}>
                    <RNText style={styles.sheetIconText}>{icon}</RNText>
                  </Pressable>
                ))}
              </View>

              {/* ── Filter pills ── */}
              <RNText style={styles.sheetSectionTitle}>Filter</RNText>
              <View style={styles.sheetPillRow}>
                {[
                  "All",
                  "Vegetarian",
                  "Vegan",
                  "Gluten-free",
                  "Keto",
                  "Halal",
                ].map((label) => (
                  <Pressable key={label} style={styles.sheetPill}>
                    <RNText style={styles.sheetPillText}>{label}</RNText>
                  </Pressable>
                ))}
              </View>

              {/* ── Action buttons ── */}
              <RNText style={styles.sheetSectionTitle}>Actions</RNText>
              <Pressable
                style={styles.sheetActionPrimary}
                onPress={() => setSheetPresented(false)}
              >
                <RNText style={styles.sheetActionPrimaryText}>
                  Apply filters
                </RNText>
              </Pressable>

              <Pressable
                style={styles.sheetActionOutlined}
                onPress={() => {}}
              >
                <RNText style={styles.sheetActionOutlinedText}>Reset</RNText>
              </Pressable>

              <Pressable
                style={styles.sheetActionDestructive}
                onPress={() => {}}
              >
                <RNText style={styles.sheetActionDestructiveText}>
                  Delete all
                </RNText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => setSheetPresented(false)}
                style={styles.sheetClose}
              >
                <RNText style={styles.sheetCloseText}>Close</RNText>
              </Pressable>
            </View>
          </RNHostView>
        </UniversalScrollView>
      </BottomSheet>
    </View>
  );
}

type SectionProps = {
  title: string;
  children: ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text variant="h3">{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 16,
    padding: 16,
    paddingBottom: 48,
  },
  section: {
    gap: 12,
    padding: 16,
  },
  sectionBody: {
    gap: 12,
  },
  fieldGroupHost: {
    height: 220,
  },
  listHost: {
    height: 150,
  },
  universalScrollHost: {
    height: 140,
  },
  rnHostedContent: {
    backgroundColor: "#E0F2FE",
    borderRadius: 12,
    padding: 16,
    width: 320,
  },
  rnHostedText: {
    color: "#075985",
    fontSize: 14,
    fontWeight: "600",
  },
  menuTrigger: {
    alignItems: "center",
    backgroundColor: "#E11D48",
    borderRadius: 12,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  menuTriggerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  sheetContent: {
    gap: 12,
    padding: 24,
    paddingBottom: 48,
  },
  sheetTitle: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "700",
  },
  sheetBody: {
    color: "#4B5563",
    fontSize: 15,
    lineHeight: 22,
  },
  sheetSectionTitle: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },
  sheetListItem: {
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  sheetListEmoji: {
    fontSize: 24,
  },
  sheetListItemText: {
    flex: 1,
    gap: 2,
  },
  sheetListItemTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "600",
  },
  sheetListItemSub: {
    color: "#6B7280",
    fontSize: 13,
  },
  sheetBadge: {
    alignItems: "center",
    backgroundColor: "#E11D48",
    borderRadius: 12,
    justifyContent: "center",
    minWidth: 28,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  sheetBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  sheetRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  sheetRowLabel: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "500",
  },
  sheetToggle: {
    backgroundColor: "#D1D5DB",
    borderRadius: 14,
    height: 28,
    justifyContent: "center",
    paddingHorizontal: 2,
    width: 48,
  },
  sheetToggleOn: {
    backgroundColor: "#E11D48",
  },
  sheetToggleThumb: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    height: 24,
    width: 24,
  },
  sheetToggleThumbOn: {
    alignSelf: "flex-end",
  },
  sheetCheckbox: {
    alignItems: "center",
    borderColor: "#D1D5DB",
    borderRadius: 6,
    borderWidth: 2,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  sheetCheckboxOn: {
    backgroundColor: "#E11D48",
    borderColor: "#E11D48",
  },
  sheetCheckmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  sheetIconRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    paddingVertical: 8,
  },
  sheetIconBtn: {
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  sheetIconText: {
    fontSize: 20,
  },
  sheetPillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sheetPill: {
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  sheetPillText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "600",
  },
  sheetActionPrimary: {
    alignItems: "center",
    backgroundColor: "#E11D48",
    borderRadius: 12,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  sheetActionPrimaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  sheetActionOutlined: {
    alignItems: "center",
    borderColor: "#D1D5DB",
    borderRadius: 12,
    borderWidth: 1.5,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  sheetActionOutlinedText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  sheetActionDestructive: {
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  sheetActionDestructiveText: {
    color: "#E11D48",
    fontSize: 16,
    fontWeight: "600",
  },
  sheetClose: {
    alignItems: "center",
    backgroundColor: "#6B7280",
    borderRadius: 12,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 18,
    marginTop: 8,
  },
  sheetCloseText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
