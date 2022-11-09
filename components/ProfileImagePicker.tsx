import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import images from '../assets/images';
import colors from '../constants/colors';
import RegularText from './RegularText';

type ProfileImagePickerProps = {
  selectedImage: string | unknown;
  onPress: () => any;
  errorMsg?: string | unknown;
};

const ProfileImagePicker = (props: ProfileImagePickerProps) => {
  const { selectedImage, onPress, errorMsg } = props;

  const combinedStyle = useMemo(
    () =>
      StyleSheet.compose(
        styles.container as ViewStyle,
        selectedImage ? null : { paddingTop: 5 },
      ),
    [selectedImage],
  );

  const imgSrc = useMemo(
    () => (selectedImage ? { uri: selectedImage } : images.ic_user),
    [selectedImage],
  );

  return (
    <View style={styles.top}>
      <Pressable style={styles.root} onPress={onPress}>
        <View style={combinedStyle}>
          <Image source={imgSrc} style={styles.container} resizeMode="cover" />
        </View>
        <View style={styles.editImgContainer}>
          <Image source={images.ic_edit} style={styles.editImg} />
        </View>
      </Pressable>
      {errorMsg && typeof errorMsg === 'string' ? (
        <RegularText style={{ color: colors.red }}>{errorMsg}</RegularText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  top: {
    alignSelf: 'center',
    marginVertical: 10
  },
  root: {
    height: 70,
    width: 70,
    alignSelf: 'center',
  },
  container: {
    height: 70,
    width: 70,
    borderRadius: 35,
    borderWidth: 1,
    alignSelf: 'center',
    overflow: 'hidden',
    // paddingTop: 5,
  },
  img: {
    height: 70,
    width: 70,
    borderRadius: 35,
    overflow: 'hidden',
  },
  editImgContainer: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -10,
    borderWidth: 1,
    borderRadius: 12,
    top: 24,
    backgroundColor: colors.white,
  },
  editImg: {
    height: 16,
    width: 16,
  },
});

export default React.memo(ProfileImagePicker);
