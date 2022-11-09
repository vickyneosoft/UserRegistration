import React, { useRef, useCallback, useMemo, useState } from "react";
import { View, StyleSheet, Keyboard, Platform } from 'react-native'
import AppInput, { AppInputAPIs } from "../../components/AppInput";
import ImagePickerPrompt from "../../components/ImagePickerPrompt";
import ProfileImagePicker from "../../components/ProfileImagePicker";
import colors from "../../constants/colors";
import withKeyboardHandling from "../../HOC/withKeyboardHandling";
import { Gender, ImagePickerActions, PermissionResult } from "../../types";
import { containsNumbers, hasOnlyNumbers, isValidEmail, isValidPassword, openAppSettingsPrompt } from "../../utils/MiscUtils";
import { useFormik } from 'formik'
import { PERMISSIONS } from 'react-native-permissions'

import ImagePicker from 'react-native-image-crop-picker'
import { checkSinglePermission, requestSinglePermission } from "../../utils/PermissionUtils";
import images from "../../assets/images";
import AppButton from "../../components/AppButton";
import GenderSelection from "../../components/GenderSelection";
import DropDownButton from "../../components/DropDownButton";
import data from "../../data";

enum FormFieldIds {
    PROFILE_PHOTO = 'profilePhoto',
    FIRST_NAME = 'firstName',
    LAST_NAME = 'lastName',
    PHONE_NUMBER = 'mobileNumber',
    EMAIL = 'email',
    GENDER = 'gender',
    PASSWORD = 'password',
    CONF_PASSWORD = 'confirmPassword',
    QUALIFICATION = 'qualification'
}

type FormFieldValueTypes = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    mobileNumber: number | undefined;
    profilePhoto: string;
    gender: Gender | unknown;
    qualification: string
};

type FormFieldErrorTypes = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    mobileNumber: string;
    profilePhoto: string;
    gender: string;
    qualification: string
};

let hasSubmitted = false

const RegisterScreen = () => {
    const firstNameRef = useRef<AppInputAPIs>(null);
    const lastNameRef = useRef<AppInputAPIs>(null);
    const phoneNumberRef = useRef<AppInputAPIs>(null);
    const emailRef = useRef<AppInputAPIs>(null);
    const passwordRef = useRef<AppInputAPIs>(null);
    const confirmPasswordRef = useRef<AppInputAPIs>(null);

    const initialValues = useMemo<FormFieldValueTypes>(
        () => ({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            mobileNumber: undefined,
            profilePhoto: '',
            gender: '',
            qualification: ''
        }),
        [],
    );

    const onSubmit = useCallback(
        (_formValues: FormFieldValueTypes) => {
            // const {
            //   firstName,
            //   lastName,
            //   email,
            //   password,
            //   confirmPassword,
            //   mobileNumber,
            //   profilePhoto,
            //   gender,
            // } = _formValues;
            // navigation.navigate('professional');
        },
        [],
    );

    const validate = useCallback((formValues: FormFieldValueTypes) => {
        const {
            firstName,
            lastName,
            email,
            mobileNumber,
            password,
            confirmPassword,
            gender,
            profilePhoto,
        } = formValues;

        const validationErrors: FormFieldErrorTypes = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            mobileNumber: '',
            profilePhoto: '',
            gender: '',
            confirmPassword: '',
            qualification: ''
        };

        if (!firstName) {
            validationErrors.firstName = 'First name required.';
        } else if (containsNumbers(firstName)) {
            validationErrors.firstName =
                'Numeric values are not allowed in first name.';
        } else if (firstName.length <= 3) {
            validationErrors.firstName =
                'First name should contain more than 3 characters.';
        }
        if (!lastName) {
            validationErrors.lastName = 'Last name required.';
        } else if (containsNumbers(lastName)) {
            validationErrors.lastName =
                'Numeric values are not allowed in last name.';
        } else if (lastName.length <= 3) {
            validationErrors.lastName =
                'Last name should contain more than 3 characters.';
        }
        if (!email) {
            validationErrors.email = 'Email address required.';
        } else if (!isValidEmail(email)) {
            validationErrors.email = 'Please enter a valid email address.';
        }
        if (!password) {
            validationErrors.password = 'Password required.';
        } else if (!isValidPassword(password)) {
            validationErrors.password =
                'Password should contain characters, number(s) and special symbols with min 7 length and max 15 length.';
        }
        if (!confirmPassword) {
            validationErrors.confirmPassword = 'Confirm password required.';
        } else if (password !== confirmPassword) {
            validationErrors.confirmPassword =
                'Password and Confirm password does not match.';
        }
        if (!mobileNumber) {
            validationErrors.mobileNumber = 'Mobile number required.';
        } else if (
            typeof mobileNumber === 'string' &&
            !hasOnlyNumbers(mobileNumber)
        ) {
            validationErrors.mobileNumber =
                'Mobile number should only contains digits.';
        } else if (
            typeof mobileNumber !== 'undefined' &&
            mobileNumber.toString().length !== 10
        ) {
            validationErrors.mobileNumber =
                'Mobile number should contain exact 10 digits of input.';
        }
        if (!profilePhoto) {
            validationErrors.profilePhoto = 'Please select profile picture.';
        }
        if (!gender) {
            validationErrors.gender = 'Please select gender.';
        }

        type P = keyof FormFieldErrorTypes;

        const errorKeys = Object.keys(validationErrors).filter(
            (key) => validationErrors[key],
        );

        return errorKeys.length ? validationErrors : undefined;
    }, []);

    const {
        errors,
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        setFieldValue,
        setErrors,
    } = useFormik({
        initialValues,
        onSubmit,
        validate,
        validateOnBlur: false,
        validateOnChange: false,
        validateOnMount: false,
    });

    const [isImagePickerPromptVisible, setImagePickerPromptVisibility] =
        useState(false);

    const onImagePickerHandler = useCallback(() => {
        setImagePickerPromptVisibility(true);
    }, []);

    const onChangeTextHandler = useCallback(
        (fieldId: FormFieldIds, enteredText: string) => {
            if (hasSubmitted) {
                setFieldValue(fieldId, enteredText, true);
            }
            else {
                handleChange(fieldId)(enteredText);
            }
        },
        [setFieldValue, handleChange],
    );

    const onSubmitEditingHandler = useCallback(
        (fieldId: FormFieldIds) => {
            handleBlur(fieldId);
            switch (fieldId) {
                case FormFieldIds.FIRST_NAME:
                    lastNameRef.current?.focus();
                    break;
                case FormFieldIds.LAST_NAME:
                    phoneNumberRef.current?.focus();
                    break;
                case FormFieldIds.PHONE_NUMBER:
                    emailRef.current?.focus();
                    break;
                case FormFieldIds.EMAIL:
                    Keyboard.dismiss();
                    break;
                case FormFieldIds.PASSWORD:
                    confirmPasswordRef.current?.focus();
                    break;
                case FormFieldIds.CONF_PASSWORD:
                    Keyboard.dismiss();
                    handleSubmit();
                    break;
            }
        },
        [handleBlur, handleSubmit],
    );

    const getImageHandler = useCallback(
        async (action: ImagePickerActions) => {
            try {
                if (action === ImagePickerActions.CAMERA) {
                    const imagePickerRes = await ImagePicker.openCamera({
                        width: 200,
                        height: 200,
                        compressImageQuality: 1,
                        mediaType: 'photo',
                        freeStyleCropEnabled: true,
                        cropping: true,
                        multiple: false,
                    });
                    onChangeTextHandler(FormFieldIds.PROFILE_PHOTO, imagePickerRes.path);
                } else {
                    const imagePickerRes = await ImagePicker.openPicker({
                        width: 200,
                        height: 200,
                        compressImageQuality: 1,
                        mediaType: 'photo',
                        freeStyleCropEnabled: true,
                        cropping: true,
                        multiple: false,
                    });
                    onChangeTextHandler(FormFieldIds.PROFILE_PHOTO, imagePickerRes.path);
                }
            } catch (err: any) {
                console.log('[openCameraHandler] Error : ', err.message);
            }
        },
        [onChangeTextHandler],
    );

    const onImagePickerActionHandler = useCallback(
        async (action: ImagePickerActions) => {
            try {
                setImagePickerPromptVisibility(false);
                switch (action) {
                    case ImagePickerActions.CAMERA:
                        {
                            const permissionCheckRes = await checkSinglePermission(
                                Platform.OS === 'android'
                                    ? PERMISSIONS.ANDROID.CAMERA
                                    : PERMISSIONS.IOS.CAMERA,
                            );

                            if (permissionCheckRes === PermissionResult.GRANTED) {
                                getImageHandler(action);
                            } else if (permissionCheckRes === PermissionResult.DENIED) {
                                const permissionRequestRes = await requestSinglePermission(
                                    Platform.OS === 'android'
                                        ? PERMISSIONS.ANDROID.CAMERA
                                        : PERMISSIONS.IOS.CAMERA,
                                );

                                if (permissionRequestRes === PermissionResult.GRANTED) {
                                    getImageHandler(action);
                                } else {
                                    openAppSettingsPrompt(
                                        'Permission Required!',
                                        'Please allow camera permission to continue.',
                                    );
                                }
                            } else {
                                openAppSettingsPrompt(
                                    'Permission Required!',
                                    'Please allow camera permission to continue.',
                                );
                            }
                        }
                        break;
                    case ImagePickerActions.GALLERY:
                        {
                            const permissionCheckRes = await checkSinglePermission(
                                Platform.OS === 'android'
                                    ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
                                    : PERMISSIONS.IOS.PHOTO_LIBRARY,
                            );

                            if (permissionCheckRes === PermissionResult.GRANTED) {
                                getImageHandler(action);
                            } else if (permissionCheckRes === PermissionResult.DENIED) {
                                const permissionRequestRes = await requestSinglePermission(
                                    Platform.OS === 'android'
                                        ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
                                        : PERMISSIONS.IOS.PHOTO_LIBRARY,
                                );

                                if (permissionRequestRes === PermissionResult.GRANTED) {
                                    getImageHandler(action);
                                } else {
                                    openAppSettingsPrompt(
                                        'Permission Required!',
                                        'Please allow camera permission to continue.',
                                    );
                                }
                            } else {
                                openAppSettingsPrompt(
                                    'Permission Required!',
                                    'Please allow camera permission to continue.',
                                );
                            }
                        }
                        break;
                }
            } catch (err: any) {
                setImagePickerPromptVisibility(false);
                console.log('[onImagePickerActionHandler] Error : ', err.message);
            }
        },
        [getImageHandler],
    );

    const onSubmitButtonPressHandler = useCallback(() => {
        hasSubmitted = true;
        handleSubmit();
    }, [handleSubmit]);

    return (
        <View style={styles.rootContainer}>
            <ImagePickerPrompt
                isVisible={isImagePickerPromptVisible}
                onDismiss={setImagePickerPromptVisibility.bind(null, false)}
                onAction={onImagePickerActionHandler}
            />
            <ProfileImagePicker
                selectedImage={values.profilePhoto}
                onPress={onImagePickerHandler}
                errorMsg={errors.profilePhoto}
            />
            <AppInput
                ref={firstNameRef}
                logo={images.ic_username}
                title="First Name*"
                placeholder="Enter your first name here"
                onChangeText={onChangeTextHandler.bind(null, FormFieldIds.FIRST_NAME)}
                onSubmitEditing={onSubmitEditingHandler.bind(
                    null,
                    FormFieldIds.FIRST_NAME,
                )}
                errorMsg={errors.firstName}
            />
            <AppInput
                ref={lastNameRef}
                logo={images.ic_username}
                title="Last Name*"
                placeholder="Enter your last name here"
                onChangeText={onChangeTextHandler.bind(null, FormFieldIds.LAST_NAME)}
                onSubmitEditing={onSubmitEditingHandler.bind(
                    null,
                    FormFieldIds.LAST_NAME,
                )}
                errorMsg={errors.lastName}
            />
            <AppInput
                ref={phoneNumberRef}
                logo={images.ic_phone}
                title="Phone Number*"
                keyboardType="numeric"
                placeholder="Enter your 10 digit phone number"
                onChangeText={onChangeTextHandler.bind(null, FormFieldIds.PHONE_NUMBER)}
                onSubmitEditing={onSubmitEditingHandler.bind(
                    null,
                    FormFieldIds.PHONE_NUMBER,
                )}
                errorMsg={errors.mobileNumber}
            />
            <AppInput
                ref={emailRef}
                logo={images.ic_email}
                title="Email*"
                placeholder="Your email goes here"
                onChangeText={onChangeTextHandler.bind(null, FormFieldIds.EMAIL)}
                onSubmitEditing={onSubmitEditingHandler.bind(null, FormFieldIds.EMAIL)}
                errorMsg={errors.email}
            />
            <GenderSelection
                onChange={onChangeTextHandler.bind(null, FormFieldIds.GENDER)}
                errorMsg={errors.gender}
            />
            <AppInput
                ref={passwordRef}
                logo={images.ic_password}
                title="Password*"
                placeholder="Password"
                secure
                onChangeText={onChangeTextHandler.bind(null, FormFieldIds.PASSWORD)}
                onSubmitEditing={onSubmitEditingHandler.bind(
                    null,
                    FormFieldIds.PASSWORD,
                )}
                errorMsg={errors.password}
            />
            <AppInput
                ref={confirmPasswordRef}
                logo={images.ic_password}
                title="Confirm Password"
                placeholder="Password"
                secure
                onChangeText={onChangeTextHandler.bind(
                    null,
                    FormFieldIds.CONF_PASSWORD,
                )}
                onSubmitEditing={onSubmitEditingHandler.bind(
                    null,
                    FormFieldIds.CONF_PASSWORD,
                )}
                errorMsg={errors.confirmPassword}
                returnKeyType="done"
                blurOnSubmit
            />
            <DropDownButton
                placeholder="Select your qualification"
                title="Select your qualification"
                options={data.educationOptions}
                onSelect={onChangeTextHandler.bind(null, FormFieldIds.QUALIFICATION)}
                errorMsg={errors.qualification}
            />
            <AppButton
                text="NEXT"
                onPress={onSubmitButtonPressHandler}
                style={styles.btn}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        paddingHorizontal: 30,
        backgroundColor: colors.white
    },
    btn: { marginVertical: 10 },
})

export default withKeyboardHandling(RegisterScreen)
