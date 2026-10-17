/* eslint-disable no-undef */
// Mock react-native-screens
try {
  const screens = require('react-native-screens');
  if (screens && screens.enableScreens) {
    screens.enableScreens(false);
  }
} catch (e) {
  // ignore
}

// Mock bottom-tabs to avoid async unhandled timers in test environment
jest.mock('@react-navigation/bottom-tabs', () => {
  const React = require('react');
  return {
    createBottomTabNavigator: () => ({
      Navigator: ({ children }) => React.createElement(React.Fragment, null, children),
      Screen: ({ component: Component }) =>
        Component
          ? React.createElement(Component, {
              navigation: { navigate: jest.fn(), setOptions: jest.fn(), popToTop: jest.fn(), goBack: jest.fn() },
              route: { params: {} },
            })
          : null,
    }),
  };
});
