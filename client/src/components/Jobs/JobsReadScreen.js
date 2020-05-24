import React from "react";
import "moment/locale/fr";
import moment from "moment";
import _ from "lodash";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import theme from "../../Theme.json";

const JobsReadScreen = ({ route, navigation }) => {
  const { job } = route.params;
  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <Text style={styles.title}>{route.params.job.jobTitle}</Text>
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
      <View style={styles.actionMenu}>
        <TouchableOpacity
          onPress={navigation.goBack}
          containerStyle={styles.actionButton}
        >
          <Icon name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JobsReadScreen;

const styles = StyleSheet.create({
  container: {
    minWidth:
      Dimensions.get("window").width < 500
        ? Dimensions.get("window").width
        : 500,
    maxWidth: 1000,
    alignSelf: "center",
  },
  actionMenu: {
    borderRadius: 50,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    position: "absolute",
    opacity: 0.8,
    alignSelf: "center",
    flexDirection: "row",
    top: 8,
  },
  actionButton: { margin: 8 },
  title: {
    fontSize: 20,
  },
});
