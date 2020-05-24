import React from "react";
import { View, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Button, Icon } from "react-native-elements";
import AppNavbar from "../AppNavbar";
import PeopleListScreen from "./PeopleListScreen";
import PeopleReadScreen from "./PeopleReadScreen";
const Stack = createStackNavigator();

const PeopleScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <AppNavbar title="Annuaire" navigation={navigation} />
      <Stack.Navigator initialRouteName="List" headerMode="none">
        <Stack.Screen
          name="List"
          component={PeopleListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Read"
          component={PeopleReadScreen}
          options={{
            headerStatusBarHeight: 0,
            title: "",
            header: ({ scene, previous, navigation }) => {
              return (
                <View
                  style={{
                    maxWidth: 1000,
                    alignSelf: "center",
                    width: Dimensions.get("window").width,
                    backgroundColor: "white",
                    borderRadius: 50,
                  }}
                >
                  <Button
                    buttonStyle={{
                      borderRadius: 20,
                      shadowColor: "black",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 12,
                      position: "absolute",
                      left: 8,
                      top: 8,
                    }}
                    icon={<Icon name="arrow-left" color="white" />}
                    onPress={navigation.goBack}
                  />
                </View>
              );
            },
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default PeopleScreen;
