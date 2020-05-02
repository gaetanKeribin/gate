import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import "moment/locale/fr";
import moment from "moment";
import _ from "lodash";
import { View, Text, ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import theme from "../../Theme.json";
import { fetchJobs } from "../../actions/jobsActions";

const JobsReadScreen = ({ route }) => {
  const { job } = route.params;
  return (
    <View
      style={{
        flex: 1,
        alignContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 8,
        backgroundColor: "white",
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 12,
        }}
      >
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              color: "grey",
              fontSize: 12,
              textAlignVertical: "bottom",
            }}
          >
            {_.capitalize(moment(job.publishedAt).locale("fr").fromNow())}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="briefcase" size={25} color="grey" />
          <Text
            style={{
              textAlignVertical: "bottom",
              marginStart: 8,
              fontSize: 20,
            }}
          >
            {job.organisation}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="map-marker" size={25} color={theme.colors.grey2} />
          <Text
            style={{
              textAlignVertical: "bottom",
              marginStart: 8,
              fontSize: 20,
            }}
          >
            {_.capitalize(job.city)}
          </Text>
        </View>
        <Text
          style={{
            color: theme.colors.grey3,
            fontWeight: "bold",
            fontSize: 16,
            marginTop: 8,
          }}
        >
          Description
        </Text>
        <Text style={{ marginBottom: 4, textAlign: "justify", fontSize: 16 }}>
          {job.jobDesc}
        </Text>
        {job.salary && (
          <Text>Rémunération à hauteur de {job.salary} brut.</Text>
        )}
        {job.asap && (
          <Text style={{ color: theme.colors.primary }}>
            Poste à pourvoir dès que possible.
          </Text>
        )}
        <Text
          style={{
            color: theme.colors.grey3,
            fontWeight: "bold",
            fontSize: 16,
            marginTop: 8,
          }}
        >
          Contact
        </Text>
        <Text>{job.contact}</Text>
      </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(JobsReadScreen);
