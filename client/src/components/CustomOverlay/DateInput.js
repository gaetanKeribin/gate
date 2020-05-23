import React, { useState, useRef } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const DateInput = ({ dateInput, dispatchRedirectReset, theme }) => {
  const [day, setDay] = useState(dateInput.initialValue?.getDate() || "");
  const [month, setMonth] = useState(
    dateInput.initialValue?.getMonth() + 1 || ""
  );
  const [year, setYear] = useState(dateInput.initialValue?.getYear() || "");

  const dayInputRef = useRef();
  const monthInputRef = useRef();
  const yearInputRef = useRef();

  if (day.length === 2) {
    monthInputRef.current.focus();
  }
  if (month.length === 2) {
    if (day.length < 2) {
      dayInputRef.current.focus();
    } else {
      yearInputRef.current.focus();
    }
  }
  if (year.length === 4) {
    if (day.length < 2) {
      dayInputRef.current.focus();
    } else if (month.length < 2) {
      month.current.focus();
    } else {
      dateInput.onChangeText(new Date(year, month - 1, day));
      dispatchRedirectReset();
    }
  }

  return (
    <View style={styles.root}>
      <TextInput
        autoFocus={true}
        ref={dayInputRef}
        value={day}
        style={[theme.TextInput, styles.input, { width: 40 }]}
        placeholder="DD"
        placeholderTextColor="grey"
        onChangeText={(text) => setDay(text)}
      />
      <Text>/</Text>
      <TextInput
        value={month}
        ref={monthInputRef}
        placeholder="MM"
        placeholderTextColor="grey"
        onChangeText={(text) => setMonth(text)}
        style={[theme.TextInput, styles.input, { width: 40 }]}
      />
      <Text>/</Text>
      <TextInput
        value={year}
        ref={yearInputRef}
        placeholder="YYYY"
        placeholderTextColor="grey"
        onChangeText={(text) => setYear(text)}
        style={[theme.TextInput, styles.input, { width: 80 }]}
      />
    </View>
  );
};

export default DateInput;

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
