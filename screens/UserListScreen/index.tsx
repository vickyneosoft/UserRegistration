import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useLayoutEffect, useMemo } from "react";
import { View, StyleSheet, FlatList, ListRenderItemInfo, InteractionManager } from 'react-native'
import { useDispatch } from "react-redux";
import AppButton from "../../components/AppButton";

// Components
import BoldText from "../../components/BoldText";
import RegularText from "../../components/RegularText";
import TextButton from "../../components/TextButton";
import UserItem from "../../components/UserItem";

// Constants
import colors from "../../constants/colors";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { getUsersThunk } from "../../store/slices/usersSlice";

// Types
import { UserPayload } from "../../types";

// Misc
import { customLog, keyExtractorHandler } from "../../utils/MiscUtils";

const UserListScreen: React.FC<NativeStackScreenProps<any, any>> = (props: any) => {
    const { navigation } = props

    const dispatch = useAppDispatch()
    const { isLoading, data: registeredUsers } = useAppSelector(state => state.users)

    const onRegisterBtnPress = useCallback(() => {
        navigation.navigate('register')
    }, [navigation])

    const onUserItemPressHandler = useCallback((userId: string) => {
        customLog('open details for user : ', userId)
    }, [])

    const renderUsersHandler = useCallback((itemObject: ListRenderItemInfo<UserPayload>) => {
        try {
            const { item } = itemObject
            const { id, firstName, lastName, profilePhoto, qualification } = item
            return (
                <UserItem
                    avatar={profilePhoto}
                    displayName={`${firstName} ${lastName}`}
                    education={qualification}
                    onPress={onUserItemPressHandler.bind(null, id)}
                />
            )
        } catch (err: any) {
            customLog('[UserListScreen - renderUsersHandler] Error : ', err?.message)
            return null
        }
    }, [])

    const renderListEmptyComponentHandler = useMemo(() => {
        return (
            <View style={[styles.rootContainer, { alignItems: 'center', justifyContent: 'center' }]}>
                <BoldText style={{ fontSize: 20 }}>
                    {"No users available"}
                </BoldText>
            </View>
        )
    }, [onRegisterBtnPress])

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            dispatch(getUsersThunk())
        })
    }, [dispatch])

    return (
        <>
            <FlatList
                data={registeredUsers}
                renderItem={renderUsersHandler}
                keyExtractor={keyExtractorHandler}
                ListEmptyComponent={renderListEmptyComponentHandler}
                style={styles.rootContainer}
                contentContainerStyle={styles.listContainerStyle}
            />
            <AppButton
                text="Register"
                onPress={onRegisterBtnPress}
            />
        </>
    )
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: colors.white
    },
    listContainerStyle: {
        minHeight: "100%",
    }
})

export default UserListScreen
