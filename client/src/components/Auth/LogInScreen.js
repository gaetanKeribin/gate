import React, { useState, useContext } from "react";
import { connect } from "react-redux";
import { View, Image } from "react-native";
import { Input, Button, Icon, ThemeContext } from "react-native-elements";
import { logIn } from "../../actions/authActions";
import { LinearGradient } from "expo-linear-gradient";

const logInScreen = ({ auth, logIn, navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleLogIn = async () => {
    if (!email) {
      return setErrors({ email: "Mél invalide." });
    } else if (!password) {
      return setErrors({ password: "Mot de passe invalide." });
    }

    setErrors({});
    logIn({ email, password });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
        backgroundColor: "white",
      }}
    >
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={[0.25, 1]}
        end={[0, 0]}
        style={{
          flexDirection: "row",
          marginBottom: 20,
          height: 150,
          width: 150,
          borderRadius: 100,
        }}
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={{
            height: 150,
            width: 150,
            borderRadius: 100,
          }}
        />
      </LinearGradient>
      <Input
        placeholder="Email"
        leftIcon={<Icon name="email" type="material-community" />}
        value={email}
        onChangeText={(value) => setEmail(value)}
        label="Email"
        errorStyle={{ color: "red" }}
        errorMessage={errors.email}
      />
      <Input
        placeholder="Mot de passe"
        leftIcon={<Icon name="lock" />}
        label="Mot de passe"
        secureTextEntry
        value={password}
        containerStyle={{ marginBottom: 30, marginTop: 8 }}
        onChangeText={(value) => setPassword(value)}
        errorStyle={{ color: "red" }}
        errorMessage={errors.password}
      />
      <Button
        title="Se connecter"
        onPress={handleLogIn}
        loading={auth.isLoggingIn}
        containerStyle={{ marginBottom: 20, marginTop: 8 }}
      />
      <Button
        title="Nouveau? Je m'enregistre."
        type="clear"
        onPress={() => navigation.navigate("SignUp")}
        containerStyle={{ marginBottom: 30 }}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: (credentials) => dispatch(logIn(credentials)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(logInScreen);
