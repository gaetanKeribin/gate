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
import {
  SearchBar,
  Avatar,
  ThemeContext,
  Button,
  Icon,
} from "react-native-elements";
import _ from "lodash";
import "moment/locale/fr";
import moment from "moment";
import { fetchUsers } from "../../actions/usersActions";
import { fetchConversations } from "../../actions/chatActions";
import { apiConfig } from "../../config";
import { showOverlay } from "../../actions/overlayAction";

const SearchResultItem = ({ item, theme, navigation, chat, dispatch }) => {
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const fullName =
    _.capitalize(item?.firstname) + " " + _.capitalize(item?.lastname);

  return (
    <TouchableOpacity
      onPress={
        chat.interlocutorsIds.includes(item?._id)
          ? () =>
              navigation.navigate("Room", {
                title: fullName,
                conversation: chat.convIdsWithPartsIds
                  .filter(
                    (element) =>
                      element.participants.includes(item?._id) === true
                  )
                  .filter((conv) => conv.participants.length === 2)[0],
              })
          : () =>
              dispatch(
                showOverlay({
                  form: {
                    action: sendMessage,
                    inputName: "text",
                    actionParams: { recipients: [item?._id] },
                    message: "Demarrer une conversation avec " + fullName,
                  },
                })
              )
      }
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderBottomColor: theme.colors.grey5,
          borderBottomWidth: 1,
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
              size="small"
            />
          ) : (
            <Avatar
              size="small"
              title={item?.firstname[0].concat(item?.lastname[0]).toUpperCase()}
            />
          )}
        </View>
        {!showMessageForm ? (
          <Text style={{ paddingLeft: 12 }}>{fullName}</Text>
        ) : (
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
              marginTop: 8,
            }}
          >
            <TextInput
              value={newMessage}
              multiline
              placeholder="Ecrivez ici."
              placeholderTextColor="grey"
              onChangeText={(text) => setNewMessage(text)}
              style={{
                backgroundColor: theme.colors.grey5,
                borderColor: theme.colors.grey4,
                borderWidth: 1,
                borderRadius: 5,
                paddingVertical: 2,
                paddingHorizontal: 4,
                maxHeight: 80,
              }}
            />
            <Button
              containerStyle={{ height: 30 }}
              icon={
                <Icon
                  name="send"
                  size={20}
                  color={newMessage ? theme.colors.primary : theme.colors.grey2}
                />
              }
              disabled={!newMessage}
              type="clear"
              onPress={() => {
                onSendMessage(newMessage, item?._id);
                setNewMessage("");
                setShowMessageForm(false);
              }}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const Item = ({ item, navigation, auth, theme, dispatch }) => {
  const listParticipants = () => {
    _.remove(
      item?.participants,
      (participant) => participant._id === auth.user._id
    );

    if (item?.participants?.length > 1) {
      const participantsList = item?.participants?.map((participant) =>
        _.capitalize(participant.firstname)
      );
      return participantsList.toString().replace(",", ", ");
    } else if (item?.participants?.length === 1) {
      return _.capitalize(item?.participants[0]?.firstname).concat(
        " ",
        _.capitalize(item?.participants[0]?.lastname)
      );
    } else {
      return "Compte supprimé";
    }
  };

  const title = listParticipants();
  const participants = listParticipants(item);

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
            {item?.participants[0]?.avatar ? (
              <Avatar
                source={{
                  uri: `${apiConfig.baseUrl}/files/avatar/${item?.participants[0]?.avatar?.filename}`,
                }}
                size="medium"
              />
            ) : (
              <Avatar
                size="medium"
                title={item?.participants[0]?.firstname[0]
                  .concat(item?.participants[0]?.lastname[0])
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
                {participants}
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
                  moment(item?.lastMessage?.sentAt).locale("fr").fromNow()
                )}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{ alignContent: "center", justifyContent: "center" }}
              >
                {item?.lastMessage?.sender === auth.user._id ? (
                  <Icon
                    name="arrow-top-right"
                    color={theme.colors.grey1}
                    size={14}
                  />
                ) : (
                  <Icon
                    name="arrow-bottom-left"
                    color={theme.colors.grey3}
                    size={14}
                  />
                )}
              </View>
              <Text
                style={{
                  textAlignVertical: "center",
                  fontSize: 14,
                  flex: 1,
                }}
              >
                {item?.lastMessage?.text}
              </Text>
              {/* <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name="dots-horizontal"
                  style={{ alignSelf: "flex-end" }}
                  onPress={() =>
                    dispatch(
                      showOverlay({
                        menu: {
                          buttons: [
                            {
                              title: "Supprimer la conversation",
                              action: deleteConversation,
                              actionParams: [item?._id],
                            },
                          ],
                        },
                      })
                    )
                  }
                />
              </View> */}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ChatLobbyScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { chat, users, auth } = useSelector((state) => state);

  useEffect(() => {
    function fetchData() {
      dispatch(fetchConversations());
      dispatch(fetchUsers());
    }
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchConversations());
    setRefreshing(false);
  }, [refreshing]);

  const searchProcess = () => {
    const searchResults = [];
    users.users?.forEach((user) => {
      if (user._id !== auth.user._id) {
        if (
          user.firstname.includes(search.toLowerCase()) === true ||
          user.lastname.includes(search.toLowerCase())
        ) {
          searchResults.push(user);
        }
      }
    });
    return searchResults;
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <View style={{ backgroundColor: "white", paddingVertical: 4 }}>
        <SearchBar
          placeholder="Chercher un alumni ici..."
          onChangeText={setSearch}
          value={search}
          platform="android"
          containerStyle={{
            paddingTop: 0,
            height: 40,
          }}
        />
        {users.isLoaded && (
          <FlatList
            data={search && searchProcess()}
            renderItem={({ item }) => (
              <SearchResultItem
                item={item}
                theme={theme}
                chat={chat}
                navigation={navigation}
                dispatch={dispatch}
              />
            )}
            keyExtractor={(item) => item?._id}
          />
        )}
        {!users.isLoaded && (
          <View
            style={{
              flex: 1,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="small" />
          </View>
        )}
      </View> */}
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
