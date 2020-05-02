import React, { useState, useContext } from "react";
import { View, Text, SectionList, TouchableOpacity } from "react-native";
import { ThemeContext, SearchBar, Icon } from "react-native-elements";

const SearchResultItem = ({ item, theme }) => {
  return (
    <TouchableOpacity onPress={{}}>
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

const FilterBar = ({ data, keys }) => {
  const { theme } = useContext(ThemeContext);
  const [search, setSearch] = useState("");

  const searchProcess = () => {
    const resultsObj = {};
    keys.forEach((key) => {
      const name = key.name + "/" + key.alias + "/" + key.icon;
      resultsObj[name] = {};
      data.forEach((element) => {
        const value = element[key.name];
        if (value.includes(search.toLowerCase())) {
          if (!resultsObj[name][value]) resultsObj[name][value] = 0;
          resultsObj[name][value] = resultsObj[name][value] + 1;
        }
      });
      if (Object.keys(resultsObj[name]).length === 0) delete resultsObj[name];
    });
    const resultsArr = [];
    Object.keys(resultsObj).forEach((key) => {
      let temp = { title: key, data: [] };
      Object.keys(resultsObj[key]).forEach((value) => {
        temp.data.push({ value, occurence: resultsObj[key][value] });
      });
      temp.data.length !== 0 && resultsArr.push(temp);
    });
    return resultsArr;
  };
  const results = searchProcess();

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
        // paddingHorizontal: 8
      }}
    >
      <SearchBar
        placeholder={`Chercher une ville, une profession...`}
        onChangeText={setSearch}
        value={search}
        lightTheme={true}
        platform="android"
        containerStyle={{
          paddingTop: 0,
          height: 40,
          // flex: 1
        }}
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
