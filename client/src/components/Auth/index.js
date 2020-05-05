import React from "react";
import { View } from "react-native";
import LogInScreen from "./LogInScreen";
import SignUpScreen from "./SignUpScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="LogIn" headerMode="screen">
        <Stack.Screen
          name="LogIn"
          component={LogInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            title: "S'inscrire",
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default AuthNavigator;
