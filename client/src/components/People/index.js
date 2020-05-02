import React from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import AppNavbar from "../AppNavbar";
import PeopleListScreen from "./PeopleListScreen";
import PeopleReadScreen from "./PeopleReadScreen";
const Stack = createStackNavigator();

const PeopleScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <AppNavbar title="Annuaire" navigation={navigation} />
      <Stack.Navigator initialRouteName="List" headerMode="screen">
        <Stack.Screen
          name="List"
          component={PeopleListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Read"
          component={PeopleReadScreen}
          options={{ headerStatusBarHeight: 0, title: "" }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default PeopleScreen;
