import React, { useContext, useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { ThemeContext, Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import { showOverlay } from "../actions/overlayAction";

import "moment/locale/fr";
import moment from "moment";

const CustomInput = ({
  value,
  placeholder,
  onChangeText,
  searchBar,
  select,
  clear,
  leftIcon,
  label,
  accept,
  date,
  secureTextEntry = false,
}) => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);

  if (date && value) value = moment(value).format("Do MMMM YYYY");

  const handleChangeText = async (text) => {
    if (accept && !accept?.includes(value)) {
      setError(true);
    } else {
      setError(false);
    }

    onChangeText(text);
  };

  return (
    <View style={[styles.root]}>
      <View style={styles.content}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={styles.inputContainer}>
          {leftIcon && (
            <Icon name={leftIcon} containerStyle={styles.iconContainer} />
          )}
          {searchBar || select || date ? (
            <TouchableOpacity
              containerStyle={[styles.TextInput, { height: 60 }]}
              style={[
                styles.TextInput,
                { alignItems: "flex-start", justifyContent: "center" },
              ]}
              onPress={() => {
                if (date)
                  return dispatch(
                    showOverlay({
                      dateInput: { onChangeText },
                    })
                  );
                dispatch(
                  showOverlay({
                    searchBar: {
                      initialValue: value,
                      searchFor: searchBar,
                      selectFrom: select,
                      onPressSuggestion: onChangeText,
                      placeholder,
                    },
                  })
                );
              }}
            >
              <Text style={{ color: value ? "black" : "grey" }}>
                {value || placeholder}
              </Text>
            </TouchableOpacity>
          ) : (
            <TextInput
              style={styles.TextInput}
              value={value}
              placeholder={placeholder}
              placeholderTextColor="grey"
              onChangeText={(text) => {
                handleChangeText(text);
              }}
              secureTextEntry={secureTextEntry}
            />
          )}
          {select && (
            <Icon
              name="chevron-down"
              containerStyle={styles.iconContainer}
              size={25}
              onPress={() =>
                dispatch(
                  showOverlay({
                    searchBar: {
                      initialValue: value,
                      searchFor: searchBar,
                      selectFrom: select,
                      onPressSuggestion: onChangeText,
                      placeholder,
                    },
                  })
                )
              }
            />
          )}
          {(searchBar || clear) && (
            <Icon
              name="close"
              containerStyle={styles.iconContainer}
              size={20}
              onPress={() => onChangeText("")}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  root: { marginBottom: 12, flexDirection: "row", alignSelf: "stretch" },
  iconContainer: { marginHorizontal: 4 },
  content: { flex: 1, width: 300 },
  labelContainer: { marginBottom: 4 },
  sides: { flex: 1, backgroundColor: "blue" },
  label: { color: "darkgrey" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "grey",
    height: 40,
    backgroundColor: "rgba(250,250,250,1)",
  },
  TextInput: { paddingHorizontal: 4, flex: 1 },
});
