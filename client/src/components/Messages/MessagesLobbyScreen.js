import React, { useState, useEffect, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from "react-native";
import { Avatar, ThemeContext, Button, Icon } from "react-native-elements";
import _ from "lodash";
import "moment/locale/fr";
import moment from "moment";
import { fetchUsers } from "../../actions/usersActions";
import { fetchConversations } from "../../actions/chatActions";
import { apiConfig } from "../../config";

const Item = ({ item, navigation, auth }) => {
  const listParticipants = () => {
    _.remove(
      item.participants,
      (participant) => participant._id === auth?.user._id
    );

    if (item.participants?.length > 1) {
      const participantsList = item.participants?.map((participant) =>
        _.capitalize(participant.firstname)
      );
      return participantsList.toString().replace(",", ", ");
    } else if (item.participants?.length === 1) {
      return _.capitalize(item.participants[0]?.firstname).concat(
        " ",
        _.capitalize(item.participants[0]?.lastname)
      );
    } else {
      return "Compte supprimé";
    }
  };

  const title = listParticipants();

  const incoming = item.lastMessage?.sender !== auth?.user._id;

  if (!item) return null;

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Room", {
          title,
          conversation_id: item._id,
        })
      }
    >
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 8,
          borderBottomColor: "white",
          borderBottomWidth: 3,
          backgroundColor: "white",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              alignContent: "center",
              justifyContent: "center",
              paddingRight: 8,
            }}
          >
            {item.participants[0]?.avatar ? (
              <Avatar
                source={{
                  uri: `${apiConfig.baseUrl}/api/files/avatars/${item.participants[0]?.avatar}`,
                }}
                size="medium"
              />
            ) : (
              <Avatar
                size="medium"
                title={item.participants[0]?.firstname[0]
                  .concat(item.participants[0]?.lastname[0])
                  .toUpperCase()}
              />
            )}
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  textAlignVertical: "bottom",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {title}
              </Text>
              <Text
                color="grey"
                style={{
                  color: "grey",
                  fontSize: 10,
                  textAlignVertical: "bottom",
                }}
              >
                {_.capitalize(
                  moment(item.messages[0].sentAt).locale("fr").fromNow()
                )}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  textAlignVertical: "center",
                  fontSize: 14,
                  flex: 1,
                  fontWeight: item.messages[0] && incoming ? 100 : 800,
                }}
              >
                {item.messages[0].sender === auth?.user._id && "Vous: "}
                {item.messages[0].text}
                {item.readAck.message_id === messages[0]._id &&
                  !incoming &&
                  `Lu il y a ${moment(item.readAck.timestamp)
                    .locale("fr")
                    .fromNow()}`}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ChatLobbyScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { chat, auth } = useSelector((state) => state);

  useEffect(() => {
    function fetchData() {
      dispatch(fetchConversations());
    }
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchConversations());
    setRefreshing(false);
  }, [refreshing]);

  return (
    <View style={{ flex: 1 }}>
      {chat.isLoaded ? (
        chat.conversations.length > 0 ? (
          <FlatList
            data={chat.conversations}
            renderItem={({ item }) => (
              <Item
                item={item}
                auth={auth}
                navigation={navigation}
                theme={theme}
                dispatch={dispatch}
              />
            )}
            keyExtractor={(item) => item._id}
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
            <Text style={{ textAlign: "center", color: theme.colors.grey3 }}>
              Aucune conversation
            </Text>
            <Button
              title="Rafraichir"
              type="clear"
              onPress={() => dispatch(fetchConversations())}
            />
          </View>
        )
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
  );
};

export default ChatLobbyScreen;
