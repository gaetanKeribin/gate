const Menu = ({ menu, dispatchRedirectReset, dispatch }) => {
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
      {menu.buttons?.map((button, i) => {
        return (
          <Button
            title={button.title}
            key={i}
            containerStyle={{ height: 30 }}
            onPress={() => {
              dispatch(button.action(...button.actionParams));
              dispatchRedirectReset();
            }}
          />
        );
      })}
    </View>
  );
};

export default Menu;
