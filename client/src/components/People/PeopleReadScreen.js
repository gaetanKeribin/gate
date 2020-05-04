import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, ScrollView } from "react-native";
import { Avatar, Divider, Icon, Button } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../../Theme.json";
import _ from "lodash";
import { showOverlay } from "../../actions/overlayAction";
import { startPrivateConversation } from "../../actions/chatActions";

const PeopleScreen = ({ route, navigation }) => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { item } = route.params;
  const fullname =
    _.capitalize(item?.firstname) + " " + _.capitalize(item?.lastname);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
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
              borderRadius: 5,
            }}
          >
            <View
              style={{
                flex: 1,
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20, color: theme.colors.grey5 }}>
                {_.capitalize(item?.firstname)}
              </Text>
              <Text
                style={{ fontSize: 30, color: "white", fontWeight: "bold" }}
              >
                {_.capitalize(item?.lastname)}
              </Text>
            </View>
            {item?.avatar ? (
              <Avatar
                size="xlarge"
                containerStyle={{
                  borderColor: "white",
                  borderWidth: 3,
                }}
                source={{
                  uri: `https://siee-gate.herokuapp.com/api/files/avatar/${item?.avatar?.filename}`,
                }}
              />
            ) : (
              <Avatar
                size="xlarge"
                containerStyle={{
                  borderColor: "white",
                  borderWidth: 3,
                }}
                title={item?.firstname
                  .charAt(0)
                  .concat(item?.lastname.charAt(0))
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
                flex: 1,
              }}
            >
              {item?.jobTitle} chez {item?.organisation}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icon name="school" size={20} color="grey" />
            <Text
              style={{
                textAlignVertical: "bottom",
                marginHorizontal: 8,
                flex: 1,
              }}
            >
              Promotion {item?.promo}
            </Text>
          </View>
          <Divider
            style={{
              marginVertical: 20,
              backgroundColor: "grey",
              borderWidth: 1,
              width: 20,
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <Text style={{ textAlign: "justify", flex: 1, marginEnd: 8 }}>
              {item?.description}
            </Text>
          </View>
          <Divider
            style={{
              marginVertical: 20,
              backgroundColor: "grey",
              borderWidth: 1,
              width: 20,
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <Icon name="at" size={20} color="grey" />
            <Text
              style={{ textAlignVertical: "bottom", marginStart: 8, flex: 1 }}
            >
              {item?.email}
            </Text>
          </View>
        </ScrollView>
        <Button
          title="Contacter"
          onPress={() => {
            let a = auth.user.privateConversations.filter(
              (c) => c.interlocutor_id == item._id
            );
            if (a.length > 0) {
              navigation.navigate("Messages", {
                screen: "Room",
                params: {
                  title: fullname,
                  conversation_id: a[0].conversation_id,
                },
              });
            } else
              dispatch(
                showOverlay({
                  form: {
                    action: startPrivateConversation,
                    inputName: "text",
                    actionParams: { recipient: item?._id },
                    message:
                      "Demarrer une conversation avec " +
                      _.capitalize(item?.firstname) +
                      " " +
                      _.capitalize(item?.lastname),
                  },
                  redirect: "Messages",
                })
              );
          }}
        />
      </View>
    </View>
  );
};

export default PeopleScreen;
