import React, { useState, useRef } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { Icon, Button, ThemeContext } from "react-native-elements";

const SmallForm = ({ form, dispatchRedirectReset, theme, dispatch }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <View style={styles.root}>
      {form.message && (
        <Text
          style={{
            fontSize: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            marginTop: 8,
          }}
        >
          {form.message}
        </Text>
      )}
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
          style={[theme.TextInput]}
          textAlignVertical="top"
        />
        <Button
          style={{}}
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

export default SmallForm;

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
  input: {
    height: 40,
    textAlign: "center",
    marginHorizontal: 8,
  },
});
