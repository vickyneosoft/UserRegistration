import React, { useRef, useCallback, useMemo, useState } from "react";
import { View, StyleSheet, Keyboard, Platform } from 'react-native'
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ImagePicker from 'react-native-image-crop-picker'
import { PERMISSIONS } from 'react-native-permissions'
import { useFormik } from 'formik'

// Components
import withKeyboardHandling from "../../HOC/withKeyboardHandling";
import ImagePickerPrompt from "../../components/ImagePickerPrompt";
import AppInput, { AppInputAPIs } from "../../components/AppInput";
import ProfileImagePicker from "../../components/ProfileImagePicker";
import GenderSelection from "../../components/GenderSelection";
import DropDownButton from "../../components/DropDownButton";
import AppInputButton from "../../components/AppInputButton";
import AppButton from "../../components/AppButton";

// Utils
import {
    hasOnlyCharacters,
    hasOnlyNumbers,
    isValidEmail,
    isValidPassword,
    openAppSettingsPrompt
} from "../../utils/MiscUtils";
import { checkSinglePermission, requestSinglePermission } from "../../utils/PermissionUtils";

// Types
import { AddUserPayload, Gender, ImagePickerActions, PermissionResult } from "../../types";

// Constants
import colors from "../../constants/colors";
import images from "../../assets/images";
import data from "../../data";

// Redux
import { registerNewUser } from "../../store/slices/usersSlice";
import { useAppDispatch } from "../../hooks/redux";

enum FormFieldIds {
    PROFILE_PHOTO = 'profilePhoto',
    FIRST_NAME = 'firstName',
    LAST_NAME = 'lastName',
    PHONE_NUMBER = 'mobileNumber',
    EMAIL = 'email',
    GENDER = 'gender',
    PASSWORD = 'password',
    CONF_PASSWORD = 'confirmPassword',
    QUALIFICATION = 'qualification',
    DOB = 'dob'
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
    qualification: string;
    dob: Date | undefined
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
    qualification: string;
    dob: string
};

let hasSubmitted = false

const RegisterScreen: React.FC<NativeStackScreenProps<any, any>> = (props) => {
    const { navigation } = props

    const dispatch = useAppDispatch()

    const [isDatePickerVisible, setDatePickerVisible] = useState(false);

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
            qualification: '',
            dob: undefined
        }),
        [],
    );

    const onSubmit = useCallback(
        (formValues: FormFieldValueTypes) => {
            console.log('formValues : ', formValues)
            if (!formValues.dob) {
                return
            }
            const dataToBeStored: AddUserPayload = {
                ...formValues,
                dob: new Date(formValues.dob).getTime()
            }
            dispatch(registerNewUser(dataToBeStored))
            navigation.goBack()
        },
        [navigation, dispatch],
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
            qualification,
            dob
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
            qualification: '',
            dob: ''
        };

        if (!firstName.trim()) {
            validationErrors.firstName = 'First name required.';
        } else if (!hasOnlyCharacters(firstName.trim())) {
            validationErrors.firstName =
                'Only character values are allowed in first name.';
        } else if (firstName.trim().length <= 3) {
            validationErrors.firstName =
                'First name should contain more than 3 characters.';
        }

        if (!lastName.trim()) {
            validationErrors.lastName = 'Last name required.';
        } else if (!hasOnlyCharacters(lastName.trim())) {
            validationErrors.lastName =
                'Only character values are allowed in last name.';
        } else if (lastName.trim().length <= 3) {
            validationErrors.lastName =
                'Last name should contain more than 3 characters.';
        }

        if (!email.trim()) {
            validationErrors.email = 'Email address required.';
        } else if (!isValidEmail(email.trim())) {
            validationErrors.email = 'Please enter a valid email address.';
        }

        if (!password.trim()) {
            validationErrors.password = 'Password required.';
        } else if (!isValidPassword(password.trim())) {
            validationErrors.password =
                'Password should contain characters, number(s) and special symbols with min 7 length and max 15 length.';
        }

        if (!confirmPassword.trim()) {
            validationErrors.confirmPassword = 'Confirm password required.';
        } else if (password.trim() !== confirmPassword.trim()) {
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
                'Mobile number field should contain exact 10 digits of input.';
        }

        if (!profilePhoto) {
            validationErrors.profilePhoto = 'Please select profile picture.';
        }

        if (!gender) {
            validationErrors.gender = 'Please select gender.';
        }

        if (!qualification) {
            validationErrors.qualification = 'Select your qualification.';
        }

        if (!dob) {
            validationErrors.dob = 'Select your Date of Birth.';
        }

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
    } = useFormik<FormFieldValueTypes>({
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
        (fieldId: FormFieldIds, enteredText: string | Date | undefined) => {
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

    const onSelectDOBPressHandler = useCallback(() => {
        setDatePickerVisible(true)
    }, [])

    const onDateChangeHandler = useCallback((date: Date) => {
        console.log(date?.getTime())
        setDatePickerVisible(false);
        onChangeTextHandler(FormFieldIds.DOB, date)
    }, [])

    const yesterdayDate = useMemo(() => {
        const currDate = new Date()
        currDate.setDate(currDate.getDate() - 1)
        return currDate
    }, [])

    return (
        <View style={styles.rootContainer}>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                maximumDate={yesterdayDate}
                onConfirm={onDateChangeHandler}
                onCancel={setDatePickerVisible.bind(null, false)}
            />
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
                maxLength={25}
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
                maxLength={25}
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
                maxLength={10}
                errorMsg={errors.mobileNumber}
            />
            <AppInput
                ref={emailRef}
                logo={images.ic_email}
                title="Email*"
                placeholder="Your email goes here"
                onChangeText={onChangeTextHandler.bind(null, FormFieldIds.EMAIL)}
                onSubmitEditing={onSubmitEditingHandler.bind(null, FormFieldIds.EMAIL)}
                keyboardType="email-address"
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
            <AppInputButton
                title="Date Of Birth"
                placeholder="Select Your Date Of Birth"
                value={values.dob}
                onPress={onSelectDOBPressHandler}
                errorMsg={errors.dob}
            />
            <AppButton
                text="REGISTER"
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
