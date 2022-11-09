import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import BoldText from './BoldText';

type TextButtonProps = {
  title: string;
  onPress: () => any;
};

const TextButton = (props: TextButtonProps) => {
  const {title, onPress} = props;
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <BoldText>{title}</BoldText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {marginVertical: 5, padding: 10},
});

export default TextButton;
