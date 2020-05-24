import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Avatar, Icon } from "react-native-elements";
import theme from "../../Theme.json";
import { fetchUsers } from "../../actions/usersActions";
import _ from "lodash";
import { apiConfig } from "../../config";
import CustomInput from "../CustomInput";

const Item = ({ item, navigation }) => {
  if (!item) return null;
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Read", { id: item._id, item });
      }}
    >
      <View
        style={{
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.grey4,
          paddingVertical: 16,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          }}
        >
          {item.avatar ? (
            <Avatar
              source={{
                uri: `${apiConfig.baseUrl}/api/files/avatars/${item.avatar}`,
              }}
              size="medium"
            />
          ) : (
            <Avatar
              size="medium"
              title={item.firstname[0].concat(item.lastname[0]).toUpperCase()}
            />
          )}
        </View>
        <View>
          <Text
            style={{
              textAlignVertical: "bottom",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {_.capitalize(item.firstname)} {_.capitalize(item.lastname)}
          </Text>
          {item.jobTitle && (
            <View
              style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
            >
              <Icon name="account-card-details" size={20} />
              <Text style={{ textAlignVertical: "bottom", marginStart: 8 }}>
                {item.jobTitle} - {item.organisation}
              </Text>
            </View>
          )}
          {item.promo && (
            <View
              style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
            >
              <Icon name="school" size={20} />
              <Text style={{ textAlignVertical: "bottom", marginStart: 8 }}>
                SIEE promotion {item.promo}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PeopleScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state);

  useEffect(() => {
    function fetchData() {
      dispatch(fetchUsers());
    }
    fetchData();
  }, []);
  const [search, setSearch] = useState("");

  const searchableKeys = [
    "firstname",
    "lastname",
    "organisation",
    "city",
    "country",
    "jobTitle",
    "promo",
  ];

  const data = users?.users?.filter((u) => {
    let a = false;
    searchableKeys.every((sk, i) => {
      if (`${u[sk]}`.toLowerCase().search(search.toLowerCase()) > -1) a = true;
      if (a === true) return false;
      else return true;
    });
    return a;
  });

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View style={{ flex: 1 }} />
      <View
        style={{
          width:
            Dimensions.get("window").width < 500
              ? Dimensions.get("window").width
              : 500,
        }}
      >
        <View style={styles.searchBarContainer}>
          <CustomInput
            onChangeText={setSearch}
            placeholder="John, Doe, Paris, KPMG..."
            value={search}
            leftIcon="magnify"
          />
        </View>
        {useSelector((state) => state.users.isLoaded) ? (
          <FlatList
            style={styles.FlatList}
            data={data}
            renderItem={({ item }) => (
              <Item item={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
};

export default PeopleScreen;

const styles = StyleSheet.create({
  container: {
    minWidth:
      Dimensions.get("window").width < 500
        ? Dimensions.get("window").width
        : 500,
    maxWidth: 1000,
  },
  searchBarContainer: {
    padding: 8,
    backgroundColor: "white",
    borderColor: "lightgrey",
    margin: 12,
    borderRadius: 4,
    borderWidth: 1,
  },
  FlatList: {
    backgroundColor: "white",
    borderColor: "lightgrey",
    borderWidth: 1,
    margin: 12,
    borderRadius: 4,
  },
});
