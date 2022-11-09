import React, { useCallback, useMemo, useState } from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import BoldText from './BoldText';

import colors from '../constants/colors';
import images from '../assets/images';
import RegularText from './RegularText';

type DataObj = {
  label: string,
  value: string,
}

type DropDownButtonProps = {
  title?: string;
  options: DataObj[];
  placeholder: string;
  onSelect: (selectedOption: string) => any;
  errorMsg: string | unknown;
  style?: ViewStyle;
};

const DropDownButton = (props: DropDownButtonProps) => {
  const { title, options, placeholder, onSelect, style, errorMsg } = props;

  const [value, setValue] = useState(null);

  const renderRightIcon = useMemo(
    () => () =>
      <Image source={images.ic_down_arrow} style={styles.downArrow} />,
    [],
  );

  const onChangeHandler = useCallback(
    (item: any) => {
      onSelect(item.value);
      setValue(item);
    },
    [onSelect],
  );

  return (
    // <View style={styles.root}>
    //   <BoldText>{title}</BoldText>
    //   <Pressable style={styles.container} onPress={onSelect}>
    //     <RegularText style={styles.placeholder}>{placeholder}</RegularText>
    //     <Image source={images.ic_down_arrow} style={styles.downArrow} />
    //   </Pressable>
    // </View>
    <View style={[styles.root, style]}>
      {title ? <BoldText>{title}</BoldText> : null}
      <Dropdown
        style={[styles.dropdown]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        placeholder={placeholder}
        data={options}
        maxHeight={250}
        labelField="label"
        valueField="value"
        value={value}
        statusBarIsTranslucent={false}
        onChange={onChangeHandler}
        renderRightIcon={renderRightIcon}
      />
      {errorMsg && typeof errorMsg === 'string' ? (
        <RegularText style={{ color: colors.red }}>{errorMsg}</RegularText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {},
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: colors.purple,
    borderWidth: 1,
    paddingHorizontal: 8,
    marginTop: 2,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.lightPurple,
  },
  selectedTextStyle: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.purple,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  downArrow: { height: 18, width: 18, marginHorizontal: 10 },
});

export default React.memo(DropDownButton);
