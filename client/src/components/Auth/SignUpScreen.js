import React, { useState } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import { signUp } from "../../actions/authActions";

const SignUpScreen = ({ signUp, auth }) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({});

  const handleSignUp = async () => {
    if (!firstname) {
      return setErrors({ firstname: "Prénom manquant." });
    } else if (!lastname) {
      return setErrors({ lastname: "Nom manquant." });
    } else if (!email) {
      return setErrors({ mail: "Mél manquant." });
    } else if (password.length < 8 === true) {
      return setErrors({ password: "Mot de passe manquant." });
    } else if (password !== confirmation) {
      return setErrors({
        confirmation: "Veuillez retaper la confirmation de votre mot de passe.",
      });
    }
    setErrors({});
    signUp({ email, password, firstname, lastname, code });
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
      }}
    >
      <Input
        placeholder="Prénom"
        value={firstname}
        onChangeText={(value) => setFirstname(value)}
        label="Prénom"
        errorMessage={errors.firstname}
      />
      <Input
        placeholder="Nom"
        value={lastname}
        onChangeText={(value) => setLastname(value)}
        label="Nom"
        errorMessage={errors.lastname}
      />
      <Input
        placeholder="Email"
        leftIcon={<Icon name="email" type="material-community" />}
        value={email}
        onChangeText={(value) => setEmail(value)}
        label="Email"
        errorMessage={errors.email}
      />
      <Input
        placeholder="Mot de passe"
        leftIcon={<Icon name="lock" />}
        label="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={(value) => setPassword(value)}
        errorMessage={errors.password}
      />
      <Input
        placeholder="Mot de passe"
        leftIcon={
          <Icon
            name={
              confirmation !== password || password.length < 8
                ? "close"
                : "check"
            }
            color={
              confirmation !== password || password.length < 8 ? "red" : "green"
            }
          />
        }
        label="Confirmation"
        secureTextEntry
        value={confirmation}
        leftIconContainerStyle={{ marginRight: 12 }}
        containerStyle={{ marginBottom: 40, marginTop: 8 }}
        onChangeText={(value) => setConfirmation(value)}
        errorMessage={errors.confirmation}
      />
      <Input
        placeholder="Code"
        leftIcon={<Icon name="code-tags" type="material-community" />}
        value={code}
        onChangeText={(value) => setCode(value)}
        label="Email"
        errorMessage={errors.code}
      />
      <Button
        title="S'inscrire"
        onPress={handleSignUp}
        loading={auth.isSigningUp}
        containerStyle={{ marginBottom: 20, marginTop: 8 }}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (credentials) => dispatch(signUp(credentials)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);
