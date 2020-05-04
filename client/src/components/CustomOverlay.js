import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Text, View, Dimensions, TextInput } from "react-native";
import { Icon, ThemeContext, Button } from "react-native-elements";
import { resetOverlay } from "../actions/overlayAction";
import * as RootNavigation from "../RootNavigation.js";
import { TouchableOpacity } from "react-native-gesture-handler";

const Notifier = ({ notification, theme }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        elevation: 8,
      }}
    >
      <Icon
        containerStyle={{ marginBottom: 8 }}
        size={30}
        name={
          notification.variant === "success"
            ? "check-circle-outline"
            : notification.variant === "warning"
            ? "alert-circle-outline"
            : notification.variant === "error"
            ? "close-circle-outline"
            : notification.icon
        }
        color={
          notification.variant === "success"
            ? "green"
            : notification.variant === "warning"
            ? "yellow"
            : notification.variant === "error"
            ? "red"
            : notification.variant === "error"
            ? "blue"
            : theme.colors.grey1
        }
      />
      {notification.message && (
        <Text style={{ fontSize: 14 }}>{notification.message}</Text>
      )}
    </View>
  );
};

const InputForm = ({ form, dispatchRedirectReset, theme, dispatch }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        elevation: 8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          marginTop: 8,
        }}
      >
        {form.message && <Text style={{ fontSize: 14 }}>{form.message}</Text>}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "stretch",
          marginTop: 8,
        }}
      >
        <TextInput
          value={inputValue}
          multiline
          placeholder="Ecrivez ici."
          placeholderTextColor="grey"
          onChangeText={(text) => setInputValue(text)}
          style={{
            backgroundColor: theme.colors.grey5,
            borderColor: theme.colors.grey4,
            borderWidth: 1,
            borderRadius: 5,
            height: 60,
            paddingHorizontal: 4,
            paddingVertical: 4,
            flex: 1,
          }}
          textAlignVertical="top"
        />
        <Button
          buttonStyle={{
            height: 60,
            alignItems: "center",
            justifyContent: "center",
          }}
          icon={
            <Icon
              name="send"
              size={20}
              color={inputValue ? theme.colors.primary : theme.colors.grey2}
            />
          }
          disabled={!inputValue}
          type="clear"
          onPress={() => {
            dispatch(
              form.action({
                [form.inputName]: inputValue,
                ...form.actionParams,
              })
            );
            dispatchRedirectReset();
          }}
        />
      </View>
    </View>
  );
};

const Menu = ({ menu, dispatchRedirectReset, dispatch }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        elevation: 8,
      }}
    >
      {menu.buttons?.map((button, i) => {
        return (
          <Button
            title={button.title}
            key={i}
            containerStyle={{ height: 30 }}
            onPress={() => {
              dispatch(button.action(...button.actionParams));
              dispatchRedirectReset();
            }}
          />
        );
      })}
    </View>
  );
};

const CustomOverlay = () => {
  const overlay = useSelector((state) => state.overlay);
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  if (overlay.show === false) return null;

  const dispatchRedirectReset = () => {
    dispatch(resetOverlay());
    typeof overlay.callbacks === "array" &&
      overlay.callbacks.forEach((d) => {
        dispatch(d());
      });
    overlay.redirect && RootNavigation.navigate(overlay.redirect, {});
  };

  overlay.timeout &&
    setTimeout(() => {
      dispatchRedirectReset();
    }, overlay.timeout);

  return (
    <View
      style={{
        position: "absolute",
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        backgroundColor: theme.colors.grey6,
        alignContent: "center",
        justifyContent: "center",
        alignItems: "stretch",
      }}
    >
      <TouchableOpacity
        containerStyle={{ flex: 1, minHeight: 12 }}
        style={{
          flex: 1,
          minHeight: 12,
        }}
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
          containerStyle={{ flex: 1, minWidth: 12 }}
          style={{
            flex: 1,
            minWidth: 12,
          }}
          onPress={() => {
            overlay.notification
              ? dispatchRedirectReset()
              : dispatch(resetOverlay());
          }}
        />
        {overlay.notification && (
          <Notifier
            notification={overlay.notification}
            dispatchRedirectReset={dispatchRedirectReset}
            theme={theme}
          />
        )}
        {overlay.form && (
          <InputForm
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
        <TouchableOpacity
          containerStyle={{ flex: 1, minWidth: 12 }}
          style={{
            flex: 1,
            minWidth: 12,
          }}
          onPress={() => {
            overlay.notification
              ? dispatchRedirectReset()
              : dispatch(resetOverlay());
          }}
        />
      </View>
      <TouchableOpacity
        containerStyle={{ flex: 1, minHeight: 12 }}
        style={{
          flex: 1,
          minHeight: 12,
        }}
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
