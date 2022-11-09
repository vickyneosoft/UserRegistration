import {Platform, ToastAndroid} from 'react-native';

export const SuccessToast = (message: string, timeout = 1500) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, timeout);
  } else {
    console.log(message);
  }
};

export const ErrorToast = (message: string, timeout = 1500) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, timeout);
  } else {
    console.log(message);
  }
};
