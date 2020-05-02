import React from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Read from "./MyJobsReadScreen";
import Edit from "./MyJobsEditScreen";

const Stack = createStackNavigator();

const MyJobsScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="Read" headerMode="screen">
        <Stack.Screen
          name="Read"
          component={Read}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Edit"
          component={Edit}
          options={{ title: "Modifier" }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default MyJobsScreen;
