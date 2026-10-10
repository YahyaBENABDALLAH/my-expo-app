import { Icon } from '@expo/ui';

export const authInputIcons = {
  person: Icon.select({ ios: 'person', android: require('@expo/material-symbols/person.xml') }),
  email: Icon.select({ ios: 'envelope', android: require('@expo/material-symbols/mail.xml') }),
  password: Icon.select({ ios: 'lock', android: require('@expo/material-symbols/lock.xml') }),
  showPassword: Icon.select({
    ios: 'eye',
    android: require('@expo/material-symbols/visibility.xml'),
  }),
  hidePassword: Icon.select({
    ios: 'eye.slash',
    android: require('@expo/material-symbols/visibility_off.xml'),
  }),
};
