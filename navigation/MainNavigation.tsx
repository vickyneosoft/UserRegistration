import React from "react";
import { NavigationContainer } from '@react-navigation/native'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UserListScreen from "../screens/UserListScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator()

function MainNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerTitleAlign: "center"
                }}
            >
                <Stack.Screen
                    name="usersList"
                    component={UserListScreen}
                    options={{
                        headerTitle: "Users"
                    }}
                />
                <Stack.Screen
                    name="register"
                    component={RegisterScreen}
                    options={{
                        headerTitle: "Register"
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigation
