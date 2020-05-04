import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { connect, useDispatch, useSelector } from "react-redux";
import { ThemeContext, Button, Icon } from "react-native-elements";
import {
  sendPrivateMessage,
  fetchConversation,
} from "../../actions/chatActions";
import _ from "lodash";

const Message = ({ message, incoming, theme }) => {
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
          style={{
            color: !incoming ? "white" : "black",
            textAlign: incoming ? "left" : "right",
          }}
        >
          {message.text}
        </Text>
      </View>
      {incoming && <View style={{ flex: 1 }}></View>}
    </View>
  );
};

const RoomScreen = ({ route }) => {
  const conversation_id = route.params.conversation_id;
  const [newMessage, setNewMessage] = useState("");
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { chat, auth } = useSelector((state) => state);
  const conversation = chat.conversations.filter(
    (conv) => conv._id === conversation_id
  )[0];
  const interlocutors = conversation.participants.filter(
    (p) => p._id !== auth.user._id
  );

  useEffect(() => {
    function fetchData() {
      dispatch(fetchConversation(conversation_id));
    }
    fetchData();
  }, []);

  const onSendMessage = () => {
    dispatch(
      sendPrivateMessage({
        text: newMessage,
        conversation_id,
        recipient: interlocutors[0],
      })
    );
    setNewMessage("");
  };

  return (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      {conversation?.messages ? (
        <FlatList
          data={conversation.messages}
          renderItem={({ item }) => (
            <Message
              message={item}
              incoming={item?.sender !== auth.user._id}
              theme={theme}
            />
          )}
          keyExtractor={(item) => item?._id}
          inverted={true}
        />
      ) : (
        <ActivityIndicator />
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
  );
};

const mapStateToProps = (state) => {
  return {
    chat: state.chat,
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendMessage: (message) => dispatch(sendMessage(message)),
    fetchConversation: (conversation_id) =>
      dispatch(fetchConversation(conversation_id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RoomScreen);
