import React from "react";
import { View } from "react-native";
import AppNavbar from "../AppNavbar";
import JobsListScreen from "./JobsListScreen";
import JobsReadScreen from "./JobsReadScreen";
import JobsPostScreen from "./JobsPostScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const JobsScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <AppNavbar title="Emplois" navigation={navigation} />
      <Stack.Navigator initialRouteName="List" headerMode="screen">
        <Stack.Screen
          name="List"
          component={JobsListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Read"
          component={JobsReadScreen}
          options={({ route }) => ({
            title:
              route.params.job.jobTitle +
              " - " +
              route.params.job.employmentType,
            headerStatusBarHeight: 0
          })}
        />
        <Stack.Screen
          name="Post"
          component={JobsPostScreen}
          options={{
            title: "Poster une offre d'emploi",
            headerStatusBarHeight: 0
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default JobsScreen;
