import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext, Button, Icon } from "react-native-elements";
import {
  sendPrivateMessage,
  fetchConversation,
  sendReadAck,
} from "../../actions/chatActions";
import _ from "lodash";
import "moment/locale/fr";
import moment from "moment";

const Message = ({ message, incoming, theme, i, readAck }) => {
  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      {!incoming && <View style={{ flex: 1 }}></View>}
      <View
        style={{
          backgroundColor: incoming ? "white" : theme.colors.primary,
          borderTopLeftRadius: !incoming ? 10 : 0,
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: incoming ? 10 : 0,
          maxWidth: "80%",
          paddingHorizontal: 8,
          paddingVertical: 8,
          marginBottom: 8,
          marginHorizontal: 8,
        }}
      >
        <Text
          selectable
          style={{
            color: !incoming ? "white" : "black",
            textAlign: incoming ? "left" : "right",
          }}
        >
          {message.text}
        </Text>
        {readAck.message_id === item._id && (
          <Text>
            Lu il y a {moment(readAck.timestamp).locale("fr").fromNow()}
          </Text>
        )}
      </View>
      {incoming && <View style={{ flex: 1 }}></View>}
    </View>
  );
};

const RoomScreen = ({ route }) => {
  const { conversation_id } = route.params;
  const [newMessage, setNewMessage] = useState("");
  const { theme } = useContext(ThemeContext);

  const { user } = useSelector((state) => state.auth);
  const conversation = useSelector(
    (state) =>
      state.chat.conversations.filter((conv) => conv._id === conversation_id)[0]
  );

  const dispatch = useDispatch();
  useEffect(() => {
    function fetchData() {
      dispatch(fetchConversation(conversation_id));
      if (conversation.lastMessage.read === false)
        dispatch(sendReadAck(conversation_id));
    }
    fetchData();
  }, []);

  const onSendMessage = () => {
    const interlocutors = conversation?.participants.filter(
      (p) => p._id != user._id
    );
    dispatch(
      sendPrivateMessage({
        text: newMessage,
        conversation_id,
        recipient: interlocutors[0],
      })
    );
    setNewMessage("");
  };

  // is something triggered from here when reveiving a message that isn't triggered outside of this screen

  return (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      {conversation?.messages ? (
        <FlatList
          data={conversation.messages}
          renderItem={({ item }, i) => (
            <Message
              i={i}
              message={item}
              incoming={item?.sender !== user._id}
              theme={theme}
              readAck={conversation.readAck}
            />
          )}
          keyExtractor={(item) => item?._id}
          inverted={true}
        />
      ) : (
        <ActivityIndicator />
      )}
      <View>
        {conversation.read && conversation.lastMessage.sender !== user._id && (
          <Text style={{ flex: 1, textAlign: "right" }}>
            Vu à {conversation.read.sentAt}
          </Text>
        )}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            paddingVertical: 8,
            paddingHorizontal: 16,
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <TextInput
            style={{
              height: 40,
              flex: 1,
            }}
            onChangeText={(text) => setNewMessage(text)}
            value={newMessage}
            multiline
            placeholder="Ecrivez votre message ici."
          />
          <Button
            icon={
              <Icon
                name="send"
                size={20}
                color={newMessage ? theme.colors.primary : theme.colors.grey2}
              />
            }
            disabled={!newMessage}
            type="clear"
            onPress={() => onSendMessage()}
          />
        </View>
      </View>
    </View>
  );
};

export default RoomScreen;
