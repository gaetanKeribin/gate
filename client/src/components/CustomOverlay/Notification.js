import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";

const Notification = ({ notification, theme }) => {
  return (
    <View style={styles.root}>
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
            : notification.variant === "info"
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

export default Notification;

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 1,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
});
