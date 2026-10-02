declare module "@expo/material-symbols/*.xml" {
  const source: import("react-native").ImageSourcePropType;
  export default source;
}

declare module "*.xml" {
  const source: import("react-native").ImageSourcePropType;
  export default source;
}
