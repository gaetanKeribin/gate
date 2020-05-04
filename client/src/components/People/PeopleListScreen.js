import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Avatar, Icon } from "react-native-elements";
import theme from "../../Theme.json";
import { fetchUsers } from "../../actions/usersActions";
import _ from "lodash";

const Item = ({ item, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Read", {
          item,
        });
      }}
    >
      <View
        style={{
          paddingTop: 8,
          paddingHorizontal: 20,
          marginVertical: 4,
          marginHorizontal: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.grey4,
          paddingVertical: 12,
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
          {item?.avatar ? (
            <Avatar
              source={{
                uri: `https://siee-gate.herokuapp.com/api/files/avatar/${item?.avatar?.filename}`,
              }}
              size="medium"
            />
          ) : (
            <Avatar
              size="medium"
              title={item?.firstname[0].concat(item?.lastname[0]).toUpperCase()}
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
            {_.capitalize(item?.firstname)} {_.capitalize(item?.lastname)}
          </Text>
          <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
            <Icon name="account-card-details" size={20} />
            <Text style={{ textAlignVertical: "bottom", marginStart: 8 }}>
              {item?.jobTitle} chez {item?.organisation}
            </Text>
          </View>
          <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
            <Icon name="school" size={20} />
            <Text style={{ textAlignVertical: "bottom", marginStart: 8 }}>
              SIEE promotion {item?.promo}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PeopleScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { users, auth } = useSelector((state) => state);
  useEffect(() => {
    function fetchData() {
      dispatch(fetchUsers());
    }
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {users.isLoaded ? (
        <FlatList
          style={{
            borderRadius: 0,
            shadowOffset: { width: 10, height: 10 },
            shadowColor: "black",
            shadowOpacity: 0.3,
            elevation: 2,
            backgroundColor: "white",
          }}
          data={users.users?.filter((user) => user._id !== auth.user._id)}
          renderItem={({ item }) => (
            <Item item={item} navigation={navigation} />
          )}
          keyExtractor={(item) => item?._id}
        />
      ) : (
        <View
          style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

export default PeopleScreen;
