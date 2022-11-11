import { Alert } from 'react-native';
import { openSettings } from 'react-native-permissions';

export function openAppSettingsPrompt(title: string, message: string) {
  Alert.alert(title, message, [
    {
      text: 'Open Settings',
      style: 'default',
      onPress: openSettings,
    },
  ]);
}

export function containsNumbers(str: string) {
  return /\d/.test(str);
}

export function hasOnlyNumbers(str: string) {
  return /^[0-9]+$/.test(str);
}

export function hasOnlyCharacters(str: string) {
  return /^[a-zA-Z]+$/.test(str);
}

export function hasOnlyAlphanumeric(str: string) {
  return /^[a-zA-Z0-9]+$/.test(str);
}

export function isValidPassword(passwordStr: string) {
  return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/.test(
    passwordStr,
  );
}

export function isValidEmail(inputText: string) {
  const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return inputText.match(mailFormat);
}

export const customLog = (...params: any[]) => {
  if (__DEV__) {
    console.log(...params)
  }
}

export const keyExtractorHandler = (item: any, index: number) => {
  return item?.id ?? index.toString()
}