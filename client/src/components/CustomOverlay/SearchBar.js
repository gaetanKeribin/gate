import React, { useState } from "react";
import { apiConfig } from "../../config";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import { Dimensions } from "react-native";

const SearchBar = ({ searchBar, dispatchRedirectReset, theme }) => {
  const [value, setValue] = useState(searchBar.initialValue);
  const [suggestions, setSuggestions] = useState([]);

  const search = "cities";
  const searchIn = { firstname: ["bonjour"], lastname: ["ldskfjs"] };

  const handleChangeText = async (text) => {
    setValue(text);
    if (text === "") {
      return setSuggestions([]);
    }

    const { data } = await axios.get(
      `${apiConfig.baseUrl}/api/complete/${searchBar.searchFor}/${text}`
    );
    setSuggestions(data);
  };

  const SuggestionItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          searchBar.onPressSuggestion([item.value, item.title]);
          dispatchRedirectReset();
        }}
        style={styles.suggestion}
      >
        <Text>
          {item.title}
          {item.other?.map((o) => " - " + o)}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.root}>
      {searchBar.searchFor && (
        <TextInput
          autoFocus={true}
          value={value}
          placeholder={searchBar.placeholder}
          placeholderTextColor="grey"
          onChangeText={(text) => handleChangeText(text)}
          style={[
            theme.TextInput,
            { height: 40, width: Dimensions.get("window").width - 100 },
          ]}
        />
      )}
      <ScrollView style={styles.suggestionsContainer}>
        {suggestions.map((s, i) => (
          <SuggestionItem item={s} key={i} />
        ))}
        {searchBar.selectFrom?.map((s, i) => (
          <SuggestionItem item={s} key={i} />
        ))}
      </ScrollView>
    </View>
  );
};

export default SearchBar;

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
  suggestionsContainer: {
    height: 200,
  },
  suggestion: {
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
});
