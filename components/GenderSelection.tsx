import React, {useCallback, useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import images from '../assets/images';
import colors from '../constants/colors';
import {Gender} from '../types';
import BoldText from './BoldText';
import RegularText from './RegularText';

type GenderSelectionProps = {
  errorMsg?: string | unknown;
  onChange: (selectedGender: any) => any;
};

type RadioButtonProps = {
  id: Gender;
  text: string;
  checked: Gender | unknown;
  onChange: () => any;
};

const RadioButton = (props: RadioButtonProps) => {
  const {id, checked, text, onChange} = props;

  return (
    <Pressable
      onPress={onChange}
      style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
      <Image
        source={
          id === checked ? images.ic_radio_checked : images.ic_radio_unchecked
        }
        style={styles.icon}
      />
      <RegularText style={{marginLeft: 2}}>{text}</RegularText>
    </Pressable>
  );
};

const GenderSelection = (props: GenderSelectionProps) => {
  const {errorMsg, onChange} = props;

  const [checked, setChecked] = useState<Gender>();

  const onBtnPressHandler = useCallback(
    (senderId: Gender) => {
      setChecked(senderId);
      onChange(senderId);
    },
    [onChange],
  );

  return (
    <View style={{marginVertical: 10}}>
      <BoldText>{'Gender'}</BoldText>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <RadioButton
          id={Gender.MALE}
          text={'Male'}
          checked={checked}
          onChange={onBtnPressHandler.bind(null, Gender.MALE)}
        />
        <RadioButton
          id={Gender.FEMALE}
          text={'Female'}
          checked={checked}
          onChange={onBtnPressHandler.bind(null, Gender.FEMALE)}
        />
      </View>
      {errorMsg && typeof errorMsg === 'string' ? (
        <RegularText style={{color: colors.red}}>{errorMsg}</RegularText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {height: 24, width: 24},
});

export default GenderSelection;
