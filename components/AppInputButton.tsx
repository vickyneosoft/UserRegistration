import React, {
    useMemo,
} from 'react';
import {
    Pressable,
    StyleProp,
    StyleSheet,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import colors from '../constants/colors';
import BoldText from './BoldText';
import RegularText from './RegularText';

type AppInputButtonProp = {
    title: string
    errorMsg: string | undefined
    style?: ViewStyle
    placeholder: string
    onPress: () => any
};

/*
 * Custom Input Button component with advance APIs
 */
const AppInputButton = (props: AppInputButtonProp) => {
    const {
        title,
        errorMsg,
        style,
        placeholder,
        onPress
    } = props;

    // * combine prop styles and default component styles
    const combinedStyles = useMemo<StyleProp<TextStyle>>(
        () => StyleSheet.compose(styles.root as ViewStyle, style),
        [style],
    );

    return (
        <Pressable onPress={onPress} style={combinedStyles}>
            {title ? <BoldText>{title}</BoldText> : null}
            <View style={styles.container}>
                <RegularText style={styles.placeholderTxt}>{placeholder}</RegularText>
            </View>
            {errorMsg && typeof errorMsg === 'string' ? (
                <RegularText style={styles.errorTxt}>{errorMsg}</RegularText>
            ) : null}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    root: {
        minHeight: 73,
        marginVertical: 10,
    },
    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.purple,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
        paddingLeft: 10
    },
    logo: {
        height: 20,
        width: 20,
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
    errorTxt: {
        color: colors.red
    },
    placeholderTxt: {
        color: colors.lightPurple,
        fontStyle: "italic",
        fontSize: 14
    }
});

export default AppInputButton;
