import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Image,
  ImageRequireSource,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';
import images from '../assets/images';
import colors from '../constants/colors';
import BoldText from './BoldText';
import RegularText from './RegularText';

export type AppInputAPIs = {
  setText: (value: string) => void;
  getText: () => string;
  focus: () => void;
};

type AppInputProps = {
  logo?: ImageRequireSource;
  title?: string;
  errorMsg?: string | unknown;
  secure?: boolean;
  textInputStyle?: TextStyle;
  onChangeText: (inputId: string, enteredText: string) => void;
  onSubmitEditing: (inputId: string) => void;
};

/*
 * Custom Input component with advance APIs
 */
const AppInput = forwardRef(
  (props: AppInputProps & TextInputProps, ref: any) => {
    const {
      title,
      logo,
      secure,
      onChangeText,
      onSubmitEditing,
      errorMsg,
      style,
      defaultValue,
      textInputStyle,
    } = props;

    const [value, setValue] = useState<string>(defaultValue ?? '');
    const [secureTextEntry, setSecureTextEntry] = useState<boolean>(
      secure || false,
    );

    const textInputRef = useRef<TextInput>(null);

    // * To set state value from parent component
    const setText = useCallback((enteredText: string) => {
      setValue(enteredText);
    }, []);

    // * To get state value in parent component
    const getText = useCallback(() => {
      return value;
    }, [value]);

    // * To focus input from parent
    const focus = useCallback(() => {
      textInputRef.current?.focus();
    }, []);

    // * manage component state from parent component using ref
    const initHandler = useCallback(
      () => ({ setText, getText, focus }),
      [setText, getText, focus],
    );

    // * manage text input changes
    const onChangeTextHandler = useCallback(
      (enteredText: string) => {
        onChangeText(enteredText);
        setText(enteredText);
      },
      [onChangeText, setText],
    );

    // * manage text input submit
    const onSubmitEditingHandler = useCallback(onSubmitEditing, [
      onSubmitEditing,
    ]);

    // * bind ref with component APIs
    useImperativeHandle(ref, initHandler);

    // * combine prop styles and default component styles
    const combinedStyles = useMemo<StyleProp<TextStyle>>(
      () => StyleSheet.compose(styles.root as TextStyle, style),
      [style],
    );

    const onPasswordEyePressHandler = useCallback(() => {
      setSecureTextEntry(prevState => !prevState);
    }, []);

    const renderPasswordEyeHandler = useMemo(
      () =>
        secure ? (
          <Pressable style={styles.eyeBtn} onPress={onPasswordEyePressHandler}>
            <Image
              source={
                secureTextEntry
                  ? images.ic_show_password
                  : images.ic_hide_password
              }
              style={styles.logo}
              resizeMode="cover"
            />
          </Pressable>
        ) : null,
      [onPasswordEyePressHandler, secure, secureTextEntry],
    );

    const renderLogoHandler = useMemo(() => {
      return logo ? (
        <Image source={logo} style={styles.logo} resizeMode="cover" />
      ) : null;
    }, [logo]);

    const combinedInputStyles = useMemo(
      () => StyleSheet.compose(styles.input as TextStyle, textInputStyle),
      [textInputStyle],
    );

    return (
      <View style={combinedStyles}>
        {title ? <BoldText>{title}</BoldText> : null}
        <View style={styles.container}>
          {renderLogoHandler}
          <TextInput
            returnKeyType="next"
            keyboardType="default"
            blurOnSubmit={false}
            maxLength={50}
            {...props}
            autoCapitalize={'none'}
            autoComplete={'off'}
            secureTextEntry={secureTextEntry}
            autoCorrect={false}
            placeholderTextColor={colors.lightPurple}
            ref={textInputRef}
            underlineColorAndroid="transparent"
            value={value}
            onChangeText={onChangeTextHandler}
            onSubmitEditing={onSubmitEditingHandler}
            style={combinedInputStyles}
          />
          {renderPasswordEyeHandler}
        </View>
        {errorMsg && typeof errorMsg === 'string' ? (
          <RegularText style={{ color: colors.red }}>{errorMsg}</RegularText>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  root: { marginBottom: 10 },
  container: {
    borderWidth: 1,
    borderColor: colors.purple,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  logo: {
    height: 24,
    width: 24,
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    color: colors.purple,
    fontStyle: 'italic',
    minHeight: 50,
  },
  eyeBtn: {
    paddingVertical: 10,
  },
});

export default AppInput;
