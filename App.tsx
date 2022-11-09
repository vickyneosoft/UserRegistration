/**
 * "User Registration" React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import MainNavigation from './navigation/MainNavigation';
import { Provider } from 'react-redux'
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <MainNavigation />
    </Provider>
  );
};

export default App;
