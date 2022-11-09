import * as React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../constants/colors';

const withKeyboardHandling = (
  WrappedComponent: React.FC<any>,
): React.FC<any> => {
  return (props: any) => {
    const {style, dismissKeyboardAvoiding} = props;

    if (dismissKeyboardAvoiding) {
      return (
        <SafeAreaView style={styles.root}>
          <WrappedComponent {...props} />
        </SafeAreaView>
      );
    }

    const combinedRootStyle = React.useMemo(
      () => StyleSheet.compose(styles.root, style),
      [style],
    );

    return (
      // <SafeAreaView style={combinedRootStyle}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={styles.container}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={styles.flexGrow}>
          <View style={styles.flexGrow}>
            <WrappedComponent {...props} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
      // </SafeAreaView>
    );
  };
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flexGrow: 1, // this will fix scroll view scroll issue by passing parent view width and height to it
  },
  flexGrow: {
    flexGrow: 1,
  },
});

export default withKeyboardHandling;
