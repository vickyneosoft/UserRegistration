import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import colors from '../constants/colors';

type AppLoaderProps = {
  isVisible: boolean;
};

const AppLoader = (props: AppLoaderProps) => {
  const { isVisible } = props;
  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      presentationStyle="overFullScreen"
      statusBarTranslucent={true}>
      <View style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={'large'} color={colors.black} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000040',
  },
  loaderContainer: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
  },
});

export default AppLoader;
