import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Dimensions, StyleSheet } from "react-native";
import { ThemeContext } from "react-native-elements";
import { resetOverlay } from "../../actions/overlayAction";
import * as RootNavigation from "../../RootNavigation.js";
import { TouchableOpacity } from "react-native-gesture-handler";

import SearchBar from "./SearchBar";
import DateInput from "./DateInput";
import Notification from "./Notification";
import SmallForm from "./SmallForm";
import Menu from "./Menu";

const CustomOverlay = () => {
  const overlay = useSelector((state) => state.overlay);
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  if (overlay.show === false) return null;

  const dispatchRedirectReset = () => {
    dispatch(resetOverlay());
    Array.isArray(overlay.callbacks) &&
      overlay.callbacks.forEach((d) => {
        dispatch(d());
      });
    overlay.redirect &&
      RootNavigation.navigate(overlay.redirect, overlay.redirectOpts);
  };

  overlay.timeout &&
    setTimeout(() => {
      dispatchRedirectReset();
    }, overlay.timeout);

  return (
    <View style={[styles.root]}>
      <TouchableOpacity
        containerStyle={styles.sides}
        style={styles.sides}
        onPress={() => {
          overlay.notification
            ? dispatchRedirectReset()
            : dispatch(resetOverlay());
        }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          containerStyle={styles.sides}
          style={styles.sides}
          onPress={() => {
            overlay.notification
              ? dispatchRedirectReset()
              : dispatch(resetOverlay());
          }}
        />
        {overlay.notification && (
          <Notification
            notification={overlay.notification}
            dispatchRedirectReset={dispatchRedirectReset}
            theme={theme}
          />
        )}
        {overlay.form && (
          <SmallForm
            form={overlay.form}
            dispatchRedirectReset={dispatchRedirectReset}
            dispatch={dispatch}
            theme={theme}
          />
        )}
        {overlay.menu && (
          <Menu
            menu={overlay.menu}
            dispatchRedirectReset={dispatchRedirectReset}
            dispatch={dispatch}
          />
        )}
        {overlay.searchBar && (
          <SearchBar
            searchBar={overlay.searchBar}
            dispatchRedirectReset={dispatchRedirectReset}
            theme={theme}
          />
        )}
        {overlay.dateInput && (
          <DateInput
            dateInput={overlay.dateInput}
            dispatchRedirectReset={dispatchRedirectReset}
            theme={theme}
          />
        )}
        <TouchableOpacity
          containerStyle={styles.sides}
          style={styles.sides}
          onPress={() => {
            overlay.notification
              ? dispatchRedirectReset()
              : dispatch(resetOverlay());
          }}
        />
      </View>
      <TouchableOpacity
        containerStyle={styles.sides}
        style={styles.sides}
        onPress={() => {
          overlay.notification
            ? dispatchRedirectReset()
            : dispatch(resetOverlay());
        }}
      />
    </View>
  );
};

export default CustomOverlay;

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "rgba(200,200,200,0.5)",
  },
  sides: { flex: 1, minHeight: 12 },
});
