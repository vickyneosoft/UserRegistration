import React, { useMemo } from "react";
import { View, StyleSheet, Image, Pressable } from 'react-native'

// Components
import RegularText from "./RegularText";
import BoldText from "./BoldText";

// Constants
import colors from "../constants/colors";
import { qualificationObj } from "../data";
import { EducationOptions } from "../types";

type UserItemProps = {
    avatar: string,
    displayName: string
    education: EducationOptions
    onPress: () => any
}

/**
 * To render User Item in Flat list
 */
const UserItem: React.FC<UserItemProps> = (props) => {
    const { avatar, displayName, education, onPress } = props

    const userAvatar = useMemo(() => ({ uri: avatar }), [avatar])

    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Image
                source={userAvatar}
                style={styles.avatar}
            />
            <View style={styles.userDetailsContainer}>
                <BoldText numberOfLines={1} style={styles.displayNameTxt}>{displayName}</BoldText>
                <RegularText numberOfLines={1} style={styles.educationTxt}>{qualificationObj[education]}</RegularText>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.lightPurple
    },
    avatar: {
        height: 60,
        width: 60,
        borderRadius: 40,
        overflow: 'hidden',
        marginHorizontal: 10
    },
    userDetailsContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    displayNameTxt: {
        fontSize: 16,
        color: colors.black
    },
    educationTxt: {
        marginTop: 3,
        fontSize: 14,
        color: colors.black
    },
})

function arePropsEqual(prevProps: UserItemProps, nextProps: UserItemProps) {
    const { avatar, displayName, education } = prevProps
    const { avatar: nextAvatar, displayName: nextDisplayName, education: nextEducation } = nextProps

    return avatar === nextAvatar && displayName === nextDisplayName && education === nextEducation
}

export default React.memo(UserItem, arePropsEqual)
