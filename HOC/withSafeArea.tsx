import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const withSafeArea = (WrappedComp: React.FC<any>): React.FC<any> => {
  return (props: any) => {
    return (
      <SafeAreaView style={styles.container}>
        <WrappedComp {...props} />
      </SafeAreaView>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withSafeArea;
