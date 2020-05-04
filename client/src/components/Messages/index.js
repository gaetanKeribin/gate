import React from "react";
import { View } from "react-native";
import AppNavbar from "../AppNavbar";
import { createStackNavigator } from "@react-navigation/stack";
import Lobby from "./MessagesLobbyScreen";
import Room from "./MessagesRoomScreen";
import _ from "lodash";

const Stack = createStackNavigator();

const MessagesScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <AppNavbar title="Messagerie" navigation={navigation} />
      <Stack.Navigator initialRouteName="Lobby" headerMode="screen">
        <Stack.Screen
          name="Lobby"
          component={Lobby}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Room"
          component={Room}
          options={({ route }) => {
            const { title } = route.params;
            if (!title) {
              return {
                title: "Compte supprimé",
                headerStatusBarHeight: 0,
              };
            } else {
              return {
                title: title,
                headerStatusBarHeight: 0,
              };
            }
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default MessagesScreen;
