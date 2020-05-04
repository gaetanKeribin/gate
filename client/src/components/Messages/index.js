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
            const { conversation } = route.params;
            if (!route.params.title) {
              let title;
              if (conversation?.participants?.length > 1) {
              } else if (conversation?.participants?.length === 1) {
                title =
                  _.capitalize(conversation?.participants[0]?.firstname) +
                  " " +
                  _.capitalize(conversation?.participants[0]?.lastname);
              } else {
                return {
                  title: "Compte supprimé",
                  headerStatusBarHeight: 0,
                };
              }
              return {
                title,
                headerStatusBarHeight: 0,
              };
            } else {
              return {
                title: route.params.title,
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
