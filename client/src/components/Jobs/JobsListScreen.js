import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import "moment/locale/fr";
import moment from "moment";
import _ from "lodash";
import {
  View,
  FlatList,
  Text,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Icon, Button } from "react-native-elements";
import theme from "../../Theme.json";
import { TouchableOpacity } from "react-native-gesture-handler";
import { fetchJobs } from "../../actions/jobsActions";

const Item = ({ item, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Read", {
          job: item,
        })
      }
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

const JobsListScreen = ({ navigation, fetchJobs, jobs }) => {
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    function fetchData() {
      fetchJobs();
    }
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchJobs();
    setRefreshing(false);
  }, [refreshing]);

  return (
    <View style={{ flex: 1 }}>
      {jobs.isLoaded ? (
        <FlatList
          style={{
            borderRadius: 0,
            shadowOffset: { width: 10, height: 10 },
            shadowColor: "black",
            shadowOpacity: 0.3,
            elevation: 2,
            backgroundColor: "white",
          }}
          data={jobs.jobs}
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
        containerStyle={{
          position: "absolute",
          bottom: 0,
          left: 10,
        }}
        buttonStyle={{
          borderRadius: 50,
        }}
        icon={<Icon name="plus" size={30} color="white" />}
        onPress={() => navigation.navigate("Post")}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  jobs: state.jobs,
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchJobs: () => dispatch(fetchJobs()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(JobsListScreen);
