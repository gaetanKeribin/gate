import React, { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, FlatList } from "react-native";
import { connect } from "react-redux";
import { ThemeContext, Button, Icon } from "react-native-elements";
import { sendMessage, fetchConversation } from "../../actions/chatActions";
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

const RoomScreen = ({ chat, sendMessage, route, auth, fetchConversation }) => {
  const conversation_id = route.params.conversation._id;
  const [newMessage, setNewMessage] = useState("");
  const { theme } = useContext(ThemeContext);
  const conversation = chat.conversations.filter(
    (conv) => conv._id === conversation_id
  )[0];

  useEffect(() => {
    function fetchData() {
      fetchConversation(conversation_id);
    }
    fetchData();
  }, []);

  const onSendMessage = () => {
    if (!newMessage) {
      return;
    }
    sendMessage({
      text: newMessage,
      conversation_id,
    });
    setNewMessage("");
  };

  return (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      <FlatList
        data={conversation.messages}
        renderItem={({ item }) => (
          <Message
            message={item}
            incoming={item.sender !== auth.user._id}
            theme={theme}
          />
        )}
        keyExtractor={(item) => item._id}
        inverted={true}
      />
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
