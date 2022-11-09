import React, { useCallback } from "react";
import { View, StyleSheet } from 'react-native'
import BoldText from "../../components/BoldText";
import TextButton from "../../components/TextButton";

const UserListScreen = (props: any) => {
    const { navigation } = props

    const onRegisterBtnPress = useCallback(() => {
        navigation.navigate('register')
    }, [navigation])

    return (
        <View style={styles.rootContainer}>
            <TextButton
                title="Go to register"
                onPress={onRegisterBtnPress}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default UserListScreen
