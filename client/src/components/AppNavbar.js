import React, { useContext } from "react";
import { Icon, ThemeContext } from "react-native-elements";
import { connect } from "react-redux";
import { logOut } from "../actions/authActions";
import { View, Text, Platform } from "react-native";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { navigate } from "../RootNavigation";

const AppNavbar = ({
  navigation,
  leftButton,
  title,
  logOut,
  noRightButton
}) => {
  const { theme } = useContext(ThemeContext);

  const LeftButtonComponent = () => {
    switch (leftButton) {
      case "profile":
        return (
          <Icon
            name="menu"
            onPress={() => navigation.openDrawer()}
            color="white"
          />
        );
      case "back":
        return (
          <Icon
            name="arrow-left"
            color="white"
            onPress={() => navigate("Main")}
          />
        );
      default:
        return (
          <Icon
            name="menu"
            onPress={() => navigation.openDrawer()}
            color="white"
          />
        );
    }
  };

  const CenterComponent = () => {
    return (
      <View>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            textAlign: "center"
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
        <View>
          <Icon name="logout" color="white" onPress={() => logOut()} />
        </View>
      );
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      start={[0.25, 1]}
      end={[0.25, 0]}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: Platform.OS === "web" ? 10 : Constants.statusBarHeight,
        paddingHorizontal: 10,
        paddingBottom: 8
      }}
    >
      <LeftButtonComponent />
      <CenterComponent />
      <RightComponent />
    </LinearGradient>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => {
  return {
    logOut: () => dispatch(logOut())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavbar);
