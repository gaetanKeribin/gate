import React from "react";
import { connect } from "react-redux";
import { View, Text, ScrollView } from "react-native";
import { Avatar, Divider, Icon, Button } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../../Theme.json";
import _ from "lodash";

const PeopleScreen = ({ route }) => {
  const { user } = route.params;

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <View
        style={{
          flex: 1,
          alignContent: "space-between",
          paddingVertical: 10,
          paddingHorizontal: 8,
          backgroundColor: "white"
        }}
      >
        <ScrollView
          style={{
            flex: 1
          }}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={[0.25, 1]}
            end={[0, 0]}
            style={{
              flexDirection: "row",
              marginBottom: 20,
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 5
            }}
          >
            <View
              style={{
                flex: 1,
                alignContent: "center",
                justifyContent: "center"
              }}
            >
              <Text style={{ fontSize: 20, color: theme.colors.grey5 }}>
                {_.capitalize(user.firstname)}
              </Text>
              <Text
                style={{ fontSize: 30, color: "white", fontWeight: "bold" }}
              >
                {_.capitalize(user.lastname)}
              </Text>
            </View>
            {user.avatar ? (
              <Avatar
                size="xlarge"
                containerStyle={{
                  borderColor: "white",
                  borderWidth: 3
                }}
                source={{
                  uri: `https://siee-gate.herokuapp.com/api/files/avatar/${user.avatar?.filename}`
                }}
              />
            ) : (
              <Avatar
                size="xlarge"
                containerStyle={{
                  borderColor: "white",
                  borderWidth: 3
                }}
                title={user.firstname
                  .charAt(0)
                  .concat(user.lastname.charAt(0))
                  .toUpperCase()}
              />
            )}
          </LinearGradient>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="briefcase" size={20} color="grey" />
            <Text
              style={{
                textAlignVertical: "bottom",
                marginHorizontal: 8,
                flex: 1
              }}
            >
              {user.jobTitle} chez {user.organisation}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Icon name="school" size={20} color="grey" />
            <Text
              style={{
                textAlignVertical: "bottom",
                marginHorizontal: 8,
                flex: 1
              }}
            >
              Promotion {user.promo}
            </Text>
          </View>
          <Divider
            style={{
              marginVertical: 20,
              backgroundColor: "grey",
              borderWidth: 1,
              width: 20
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <Text style={{ textAlign: "justify", flex: 1, marginEnd: 8 }}>
              {user.description}
            </Text>
          </View>
          <Divider
            style={{
              marginVertical: 20,
              backgroundColor: "grey",
              borderWidth: 1,
              width: 20
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <Icon name="at" size={20} color="grey" />
            <Text
              style={{ textAlignVertical: "bottom", marginStart: 8, flex: 1 }}
            >
              {user.email}
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PeopleScreen);
