import React from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import TextButton from './TextButton';
import colors from '../constants/colors';
import {ImagePickerActions} from '../types';

type ImagePickerPromptProps = {
  isVisible: boolean;
  onDismiss: () => void;
  onAction: (action: ImagePickerActions) => any;
};

const ImagePickerPrompt = (props: ImagePickerPromptProps) => {
  const {isVisible, onDismiss, onAction} = props;
  return (
    <Modal
      isVisible={isVisible}
      animationIn={'fadeIn'}
      animationOut="fadeIn"
      useNativeDriver={true}
      onBackButtonPress={onDismiss}
      onBackdropPress={onDismiss}
      statusBarTranslucent={true}>
      <View style={styles.btnContainer}>
        <TextButton
          title="Capture Image"
          onPress={onAction.bind(null, ImagePickerActions.CAMERA)}
        />
        <TextButton
          title="Choose from gallery"
          onPress={onAction.bind(null, ImagePickerActions.GALLERY)}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  btnContainer: {backgroundColor: colors.white, padding: 10},
});

export default ImagePickerPrompt;
