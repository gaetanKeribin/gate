import React, { useContext } from "react";
import { Icon, ThemeContext } from "react-native-elements";
import { connect } from "react-redux";
import { logOut } from "../actions/authActions";
import { View, Text, Platform } from "react-native";
import Constants from "expo-constants";
import { navigate } from "../RootNavigation";

const AppNavbar = ({
  navigation,
  leftButton,
  title,
  logOut,
  noRightButton,
}) => {
  const { theme } = useContext(ThemeContext);

  const LeftButtonComponent = () => {
    switch (leftButton) {
      case "profile":
        return (
          <Icon
            name="menu"
            onPress={() => navigation.openDrawer()}
            color={theme.colors.primary}
          />
        );
      case "back":
        return (
          <Icon
            name="arrow-left"
            color={theme.colors.primary}
            onPress={() => navigate("Main")}
          />
        );
      default:
        return (
          <Icon
            name="menu"
            onPress={() => navigation.openDrawer()}
            color={theme.colors.primary}
          />
        );
    }
  };

  const CenterComponent = () => {
    return (
      <View>
        <Text
          style={{
            color: theme.colors.primary,
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
          <Icon
            name="logout"
            color={theme.colors.grey0}
            containerStyle={{ marginHorizontal: 8 }}
            onPress={() => logOut()}
          />
        </View>
      );
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: Platform.OS === "web" ? 10 : Constants.statusBarHeight,
        paddingHorizontal: 10,
        paddingBottom: 8,
        backgroundColor: "white",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 1,
      }}
    >
      <LeftButtonComponent />
      <CenterComponent />
      <RightComponent />
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch(logOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavbar);
