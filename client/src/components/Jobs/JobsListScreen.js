import React, { useState, useEffect, useCallback } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import "moment/locale/fr";
import moment from "moment";
import _ from "lodash";
import {
  View,
  FlatList,
  Text,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Icon, Button } from "react-native-elements";
import theme from "../../Theme.json";
import { TouchableOpacity } from "react-native-gesture-handler";
import { fetchJobs } from "../../actions/jobsActions";
import CustomInput from "../CustomInput";

const Item = ({ item, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Read", {
          job: item,
          id: item._id,
        })
      }
    >
      <View style={styles.itemContainer}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              textAlignVertical: "bottom",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {item?.jobTitle} en {item?.employmentType}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="briefcase" size={20} color="grey" />
            <Text style={{ textAlignVertical: "bottom", marginStart: 8 }}>
              {item?.organisation}
            </Text>
          </View>
          <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
            <Icon name="map-marker" size={20} />
            <Text
              style={{ textAlignVertical: "bottom", marginStart: 8, flex: 1 }}
            >
              {_.capitalize(item?.city)}
            </Text>
            <Text
              color="grey"
              style={{
                color: "grey",
                fontSize: 10,
                textAlignVertical: "bottom",
              }}
            >
              {_.capitalize(moment(item?.publishedAt).locale("fr").fromNow())}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const JobsListScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const { jobs } = useSelector((state) => state);

  const [search, setSearch] = useState("");
  const searchableKeys = ["jobTitle", "organisation", "city", "country"];

  useEffect(() => {
    function fetchData() {
      dispatch(fetchJobs());
    }
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchJobs();
    setRefreshing(false);
  }, [refreshing]);

  const data = jobs?.jobs?.filter((u) => {
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
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <CustomInput
            onChangeText={setSearch}
            placeholder="John, Doe, Paris, KPMG..."
            value={search}
            leftIcon="magnify"
          />
        </View>
        {jobs.isLoaded ? (
          <FlatList
            style={styles.FlatList}
            data={data}
            renderItem={({ item }) => (
              <Item item={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item?._id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
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
        <Button
          containerStyle={styles.addButton}
          buttonStyle={{ borderRadius: 60 }}
          icon={<Icon name="plus" size={40} color="white" />}
          onPress={() => navigation.navigate("Post")}
        />
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
};

export default JobsListScreen;

const styles = StyleSheet.create({
  container: {
    width:
      Dimensions.get("window").width < 500
        ? Dimensions.get("window").width
        : 500,
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
  addButton: {
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    position: "absolute",
    alignSelf: "center",
    bottom: 20,
  },
  itemContainer: {
    paddingTop: 8,
    paddingHorizontal: 20,
    marginVertical: 4,
    marginHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey4,
    paddingVertical: 12,
    flexDirection: "row",
  },
});
