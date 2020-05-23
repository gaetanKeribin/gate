import React, { useState, useContext } from "react";
import { View, Text, SectionList, TouchableOpacity } from "react-native";
import { ThemeContext, SearchBar, Icon } from "react-native-elements";
import CustomInput from "./CustomInput";

const SearchResultItem = ({ item, theme }) => {
  return (
    <TouchableOpacity onPress={() => setFilter()}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderBottomColor: theme.colors.grey5,
          borderBottomWidth: 1,
        }}
      >
        <Text style={{ paddingLeft: 12 }}>{item?.value}</Text>
        <Text style={{ paddingLeft: 12, color: theme.colors.grey2 }}>
          {item?.occurence}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const FilterBar = ({ data, keys, setFilter }) => {
  const { theme } = useContext(ThemeContext);
  const [search, setSearch] = useState("");

  const [suggestions, setSuggestions] = useState([]);

  setSuggestions(data.filter((d) => d.value.search(search) > -1));

  return (
    <View
      style={{
        borderRadius: 0,
        shadowOffset: { width: 10, height: 10 },
        shadowColor: "black",
        shadowOpacity: 0.3,
        elevation: 2,
        marginBottom: 10,
        backgroundColor: "white",
      }}
    >
      <CustomInput
        searchIn={data} // [{key: "lastname", value: "doe" }]
        placeholder="promo 18, Doe, KPMG..."
        value={seach}
        onChangeText={setSearch}
      />
      {search !== "" && (
        <SectionList
          sections={results}
          style={{
            backgroundColor: "white",
            paddingRight: 8,
            paddingLeft: 16,
            shadowOffset: { width: 10, height: 10 },
            shadowColor: "black",
            shadowOpacity: 0.3,
            elevation: 3,
            paddingVertical: 4,
          }}
          keyExtractor={(item, index) => item?.value + index}
          renderItem={({ item }) => (
            <SearchResultItem item={item} theme={theme} />
          )}
          renderSectionHeader={({ section: { title } }) => {
            const arr = title.split("/");
            return (
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Icon name={arr[2]} size={16} color={theme.colors.grey2} />
                <Text
                  style={{
                    fontSize: 12,
                    paddingLeft: 4,
                    color: theme.colors.grey2,
                  }}
                >
                  {arr[1]}
                </Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default FilterBar;
