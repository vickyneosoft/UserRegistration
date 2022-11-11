import React, { useMemo } from 'react';
import { Pressable, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import colors from '../constants/colors';
import BoldText from './BoldText';

type AppButtonProps = {
  text: string;
  onPress: () => any;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const AppButton = (props: AppButtonProps) => {
  const { text, onPress, style, textStyle } = props;

  const combinedStyles = useMemo(
    () => StyleSheet.compose(styles.container as ViewStyle, style),
    [style],
  );

  const combinedTextStyles = useMemo(
    () => StyleSheet.compose(styles.text as TextStyle, textStyle),
    [textStyle],
  );

  return (
    <Pressable onPress={onPress} style={combinedStyles}>
      <BoldText style={combinedTextStyles}>{text}</BoldText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderWidth: 2,
    borderColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple,
  },
  text: { color: colors.white },
});

export default AppButton;
