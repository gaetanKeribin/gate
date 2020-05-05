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

  return (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      {conversation?.messages ? (
        <FlatList
          data={conversation.messages}
          renderItem={({ item }) => (
            <Message
              message={item}
              incoming={item?.sender !== user._id}
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

export default RoomScreen;
