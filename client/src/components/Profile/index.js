import React from "react";
import { View } from "react-native";
import ReadProfileScreen from "./ProfileReadScreen";
import EditProfileScreen from "./ProfileEditScreen";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

const ProfileScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="Lobby" headerMode="screen">
        <Stack.Screen
          name="Read"
          component={ReadProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Edit"
          component={EditProfileScreen}
          options={{ title: "Modifier mon compte" }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default ProfileScreen;
