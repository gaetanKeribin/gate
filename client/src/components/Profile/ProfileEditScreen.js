import React, { useState, useContext } from "react";
import { connect } from "react-redux";
import { Icon, Button, Input, ThemeContext } from "react-native-elements";
import { View, ScrollView, Text, TouchableOpacity, Switch } from "react-native";
import {
  updateUser,
  deleteAccount,
  updateUserPassword,
} from "../../actions/authActions";

const ProfileEditScreen = ({
  updateUser,
  deleteAccount,
  auth,
  updateUserPassword,
}) => {
  const { theme } = useContext(ThemeContext);
  const [desc, setDesc] = useState(auth.user.description);
  const [email, setEmail] = useState(auth.user.email);
  const [jobTitle, setJobTitle] = useState(auth.user.jobTitle);
  const [organisation, setOrganisation] = useState(auth.user.organisation);
  const [promo, setPromo] = useState(`${auth.user.promo || ""}`);
  const [alumni, setAlumni] = useState(auth.user.alumni);
  const [professor, setProfessor] = useState(auth.user.professor);
  const [administration, setAdministration] = useState(
    auth.user.administration
  );
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showEditPasswordForm, setShowEditPasswordForm] = useState(false);
  const [showDeleteAccountForm, setShowDeleteAccountForm] = useState(false);
  const [showEditAccountInfoForm, setShowEditAccountInfoForm] = useState(false);

  const onEditProfile = () => {
    updateUser({
      ...auth.user,
      description: desc,
      email,
      jobTitle,
      organisation,
      promo,
      alumni,
      professor,
      administration,
    });
  };

  const onChangePassword = () => {
    if (newPassword.length < 8) {
      return setPasswordError(
        "Choisissez un mot de passe d'au moins 8 caractères."
      );
    } else if (newPassword !== confirmation) {
      return setPasswordError("Les mots de passe ne correspondent pas.");
    }
    updateUserPassword(password, newPassword);
  };

  return (
    <View
      style={{
        flex: 1,
        alignContent: "space-between",
        paddingVertical: 8,
        paddingHorizontal: 8,
        backgroundColor: "white",
      }}
    >
      <ScrollView>
        <View
          style={{
            borderBottomColor: theme.colors.grey4,
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              paddingHorizontal: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
            }}
            onPress={() => setShowEditAccountInfoForm(!showEditAccountInfoForm)}
          >
            <Text style={{ fontSize: 16 }}>Editer mes informations</Text>
            <Icon
              name={!showEditAccountInfoForm ? "chevron-down" : "chevron-up"}
            />
          </TouchableOpacity>
          {showEditAccountInfoForm && (
            <View style={{ marginBottom: 12 }}>
              <View
                style={{
                  marginBottom: 12,
                  flexDirection: "row",
                  display: "flex",
                  height: 40,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.grey3,
                    fontWeight: "bold",
                    paddingLeft: 10,
                    fontSize: 16,
                    flex: 1,
                    textAlignVertical: "center",
                  }}
                >
                  Diplomé
                </Text>
                <Switch
                  value={alumni}
                  onValueChange={(value) => setAlumni(value)}
                />
              </View>
              {alumni && (
                <Input
                  label="Promotion"
                  value={promo}
                  onChangeText={(text) => setPromo(text)}
                  leftIcon={<Icon name="school" />}
                />
              )}
              <View
                style={{
                  marginBottom: 12,
                  flexDirection: "row",
                  display: "flex",
                  height: 40,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.grey3,
                    fontWeight: "bold",
                    paddingLeft: 10,
                    fontSize: 16,
                    flex: 1,
                    textAlignVertical: "center",
                  }}
                >
                  Membre du corps professoral
                </Text>
                <Switch
                  value={professor}
                  onValueChange={(value) => setProfessor(value)}
                />
              </View>
              <View
                style={{
                  marginBottom: 12,
                  flexDirection: "row",
                  display: "flex",
                  height: 40,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.grey3,
                    fontWeight: "bold",
                    paddingLeft: 10,
                    fontSize: 16,
                    flex: 1,
                    textAlignVertical: "center",
                  }}
                >
                  Membre du corps administratif
                </Text>
                <Switch
                  value={administration}
                  onValueChange={(value) => setAdministration(value)}
                />
              </View>
              <Input
                value={organisation}
                label="Organisation"
                onChangeText={(text) => setOrganisation(text)}
                leftIcon={<Icon name="domain" />}
              />
              <Input
                value={jobTitle}
                onChangeText={(text) => setJobTitle(text)}
                label="Profession"
                leftIcon={<Icon name="briefcase" />}
              />
              <Input
                label="Description"
                value={desc}
                multiline
                numberOfLines={8}
                onChangeText={(text) => setDesc(text)}
              />
              <Input
                label="email"
                value={email}
                leftIcon={<Icon name="email" />}
                onChangeText={(text) => setEmail(text)}
              />
              <Button
                title="Valider les changements"
                onPress={() => onEditProfile()}
                buttonStyle={{ backgroundColor: theme.colors.primary }}
              />
            </View>
          )}
        </View>
        <View
          style={{
            borderBottomColor: theme.colors.grey4,
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              paddingHorizontal: 12,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
            onPress={() => setShowEditPasswordForm(!showEditPasswordForm)}
          >
            <Text style={{ fontSize: 16 }}>Changer mon mot de passe</Text>
            <Icon
              name={!showEditPasswordForm ? "chevron-down" : "chevron-up"}
            />
          </TouchableOpacity>
          {showEditPasswordForm && (
            <View style={{ marginBottom: 12 }}>
              <Input
                placeholder="Mot de passe"
                leftIcon={<Icon name="lock" />}
                label="Ancien mot de passe"
                secureTextEntry
                value={password}
                leftIconContainerStyle={{ marginRight: 12 }}
                containerStyle={{ marginBottom: 20, marginTop: 8 }}
                onChangeText={(value) => setPassword(value)}
              />
              <Input
                placeholder="Mot de passe"
                leftIcon={<Icon name="lock" />}
                label="Nouveau mot de passe"
                secureTextEntry
                value={newPassword}
                leftIconContainerStyle={{ marginRight: 12 }}
                containerStyle={{ marginBottom: 20, marginTop: 8 }}
                onChangeText={(value) => {
                  setPasswordError("");
                  setNewPassword(value);
                }}
                errorMessage={passwordError}
              />
              <Input
                placeholder="Mot de passe"
                leftIcon={
                  <Icon
                    name={confirmation === newPassword ? "check" : "close"}
                    color={confirmation === newPassword ? "green" : "red"}
                  />
                }
                label="Confirmation"
                secureTextEntry
                value={confirmation}
                leftIconContainerStyle={{ marginRight: 12 }}
                containerStyle={{ marginBottom: 40, marginTop: 8 }}
                onChangeText={(value) => setConfirmation(value)}
              />
              <Button
                title="Valider"
                onPress={() => onChangePassword()}
                buttonStyle={{ backgroundColor: theme.colors.primary }}
                loading={auth.isUpdatingPassword}
              />
            </View>
          )}
        </View>
        <View>
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              paddingHorizontal: 12,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
            onPress={() => setShowDeleteAccountForm(!showDeleteAccountForm)}
          >
            <Text style={{ fontSize: 16 }}>Supprimer mon compte</Text>
            <Icon
              name={!showDeleteAccountForm ? "chevron-down" : "chevron-up"}
            />
          </TouchableOpacity>
          {showDeleteAccountForm && (
            <View style={{ marginBottom: 12 }}>
              <Input
                placeholder="Mot de passe"
                leftIcon={<Icon name="lock" />}
                label="Mot de passe"
                secureTextEntry
                value={password}
                leftIconContainerStyle={{ marginRight: 12 }}
                containerStyle={{ marginBottom: 20, marginTop: 8 }}
                onChangeText={(value) => setPassword(value)}
              />
              <Button
                title="Valider"
                disabled={!password}
                onPress={(password) => deleteAccount(password)}
                buttonStyle={{ backgroundColor: theme.colors.error }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (user) => dispatch(updateUser(user)),
    deleteAccount: (password) => dispatch(deleteAccount(password)),
    updateUserPassword: (password, newPassword) =>
      dispatch(updateUserPassword(password, newPassword)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreen);
