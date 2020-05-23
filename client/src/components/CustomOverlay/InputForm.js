const InputForm = ({ form, dispatchRedirectReset, theme, dispatch }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        elevation: 8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          marginTop: 8,
        }}
      >
        {form.message && <Text style={{ fontSize: 14 }}>{form.message}</Text>}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "stretch",
          marginTop: 8,
        }}
      >
        <TextInput
          value={inputValue}
          multiline
          placeholder="Ecrivez ici."
          placeholderTextColor="grey"
          onChangeText={(text) => setInputValue(text)}
          style={{
            backgroundColor: theme.colors.grey5,
            borderColor: theme.colors.grey4,
            borderWidth: 1,
            borderRadius: 5,
            height: 60,
            paddingHorizontal: 4,
            paddingVertical: 4,
            flex: 1,
          }}
          textAlignVertical="top"
        />
        <Button
          buttonStyle={{
            height: 60,
            alignItems: "center",
            justifyContent: "center",
          }}
          icon={
            <Icon
              name="send"
              size={20}
              color={inputValue ? theme.colors.primary : theme.colors.grey2}
            />
          }
          disabled={!inputValue}
          type="clear"
          onPress={() => {
            dispatch(
              form.action({
                [form.inputName]: inputValue,
                ...form.actionParams,
              })
            );
            dispatchRedirectReset();
          }}
        />
      </View>
    </View>
  );
};

export default InputForm;
