/* eslint-disable no-undef */
// Mock react-native-screens
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const screens = require('react-native-screens');
  if (screens && screens.enableScreens) {
    screens.enableScreens(false);
  }
} catch (e) {
  // ignore
}
