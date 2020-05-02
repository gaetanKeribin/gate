import React, { useContext, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Icon, ThemeContext } from "react-native-elements";
import { connect } from "react-redux";
import _ from "lodash";
import AppNavbar from "../AppNavbar";
import "moment/locale/fr";
import moment from "moment";
import { fetchMyJobs } from "../../actions/jobsActions";

const Item = ({ item, navigation }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Edit", { job: item })}
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
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
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

const MyJobsScreen = ({ auth, navigation, fetchMyJobs }) => {
  useEffect(() => {
    function fetchData() {
      fetchMyJobs();
    }
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <AppNavbar
        title="Mes offres d'emploi"
        navigation={navigation}
        noRightButton={true}
        leftButton="back"
      />
      <FlatList
        data={auth.user.jobs}
        renderItem={({ item }) => <Item item={item} navigation={navigation} />}
        keyExtractor={(item) => item?._id}
      />
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    jobs: state.jobs,
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMyJobs: () => dispatch(fetchMyJobs()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyJobsScreen);
