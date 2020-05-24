import React, { useContext } from "react";
import { Icon, ThemeContext } from "react-native-elements";
import { connect, useDispatch } from "react-redux";
import { logOut } from "../actions/authActions";
import { View, Text, Platform, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { navigate } from "../RootNavigation";

const AppNavbar = ({ navigation, leftButton, title, noRightButton }) => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();

  const LeftButtonComponent = () => {
    switch (leftButton) {
      case "profile":
        return (
          <Icon
            name="menu"
            onPress={() => navigation.openDrawer()}
            color={theme.colors.grey0}
          />
        );
      case "back":
        return (
          <Icon
            name="arrow-left"
            color={theme.colors.grey0}
            onPress={() => navigate("Main")}
          />
        );
      default:
        return (
          <Icon
            name="menu"
            onPress={() => navigation.openDrawer()}
            color={theme.colors.grey0}
          />
        );
    }
  };

  const CenterComponent = () => {
    return (
      <View>
        <Text
          style={{
            color: theme.colors.grey0,
            fontSize: 20,
            textAlign: "center",
          }}
        >
          {title}
        </Text>
      </View>
    );
  };

  const RightComponent = () => {
    if (noRightButton) {
      return <View></View>;
    } else {
      return (
        <View style={{ flexDirection: "row" }}>
          {Platform.OS === "web" && (
            <>
              <Icon
                name={
                  title === "Annuaire"
                    ? "account-group"
                    : "account-group-outline"
                }
                color={theme.colors.grey0}
                containerStyle={{ marginHorizontal: 8 }}
                onPress={() => navigate("People")}
              />
              <Icon
                name={title === "Emplois" ? "briefcase" : "briefcase-outline"}
                color={theme.colors.grey0}
                containerStyle={{ marginHorizontal: 8 }}
                onPress={() => navigate("Jobs")}
              />
              <Icon
                name={title === "Messagerie" ? "forum" : "forum-outline"}
                color={theme.colors.grey0}
                containerStyle={{ marginHorizontal: 8 }}
                onPress={() => navigate("Messages")}
              />
            </>
          )}
          <Icon
            name="logout"
            color={theme.colors.grey0}
            containerStyle={{ marginHorizontal: 8 }}
            onPress={() => dispatch(logOut())}
          />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <LeftButtonComponent />
        <View style={{ flex: 1 }} />
        <CenterComponent />
        <View style={{ flex: 1 }} />
        <RightComponent />
      </View>
    </View>
  );
};

export default AppNavbar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  contentContainer: {
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 1000,
    flex: 1,
  },
  logo: {
    height: 60,
    width: 160,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
  },
  buttonContainer: {
    marginHorizontal: 6,
    paddingVertical: 17,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
});
