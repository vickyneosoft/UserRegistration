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
import { RootSiblingParent } from 'react-native-root-siblings';

// Navigation
import MainNavigation from './navigation/MainNavigation';

// Redux
import { Provider } from 'react-redux'
import { store } from './store';

function App() {
  return (
    <RootSiblingParent>
      <Provider store={store}>
        <MainNavigation />
      </Provider>
    </RootSiblingParent>
  );
};

export default App;
