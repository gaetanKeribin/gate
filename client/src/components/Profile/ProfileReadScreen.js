import React, { useState, useContext } from "react";
import { connect } from "react-redux";
import {
  Avatar,
  Divider,
  Icon,
  Button,
  ThemeContext,
} from "react-native-elements";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadFile, deleteFile } from "../../actions/filesActions";
import { LinearGradient } from "expo-linear-gradient";
import _ from "lodash";
import AppNavbar from "../AppNavbar";

const ReadProfileScreen = ({ uploadFile, auth, navigation, deleteFile }) => {
  const [showAvatarForm, setShowAvatarForm] = useState(false);
  const { theme } = useContext(ThemeContext);

  const editAvatar = () => {
    const selectPicture = async () => {
      await ImagePicker.requestCameraRollPermissionsAsync();

      const picture = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
      });

      !picture.cancelled && uploadFile(picture, "avatar");
    };
    selectPicture();
    setShowAvatarForm(false);
  };

  const { user } = auth;
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <AppNavbar
        navigation={navigation}
        title="Mon profil"
        leftButton="back"
        noRightButton={true}
      />
      {auth.user ? (
        <View
          style={{
            flex: 1,
            alignContent: "space-between",
            backgroundColor: "white",
          }}
        >
          <ScrollView
            style={{
              paddingTop: 40,
              flex: 1,
              paddingHorizontal: 12,
            }}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              start={[0.25, 1]}
              end={[0, 0]}
              style={{
                flexDirection: "row",
                marginBottom: 20,
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20, color: theme.colors.grey5 }}>
                  {_.capitalize(user.firstname)}
                </Text>
                <Text
                  style={{ fontSize: 30, color: "white", fontWeight: "bold" }}
                >
                  {_.capitalize(user.lastname)}
                </Text>
                {user.professor && <Text>Professeur</Text>}
                {user.administration && (
                  <Text>Membre du corps administratif</Text>
                )}
              </View>
              {user.avatar ? (
                <Avatar
                  size="xlarge"
                  containerStyle={{
                    borderColor: "white",
                    borderWidth: 3,
                  }}
                  source={{
                    uri: `https://siee-gate.herokuapp.com/api/files/avatar/${user.avatar?.filename}`,
                  }}
                  onPress={() => setShowAvatarForm(!showAvatarForm)}
                />
              ) : (
                <Avatar
                  size="xlarge"
                  containerStyle={{
                    borderColor: "white",
                    borderWidth: 3,
                  }}
                  title={user.firstname
                    .charAt(0)
                    .concat(user.lastname.charAt(0))
                    .toUpperCase()}
                  onPress={() => setShowAvatarForm(!showAvatarForm)}
                />
              )}
              {showAvatarForm && (
                <View
                  style={{
                    paddingHorizontal: 4,
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    icon={<Icon name="pencil" color={theme.colors.grey4} />}
                    onPress={() => editAvatar()}
                    buttonStyle={{
                      backgroundColor: theme.colors.primaryLight,
                      width: 40,
                      height: 40,
                      borderRadius: 40,
                    }}
                  />
                  <Button
                    icon={<Icon name="delete" color={theme.colors.grey4} />}
                    buttonStyle={{
                      backgroundColor: theme.colors.grey0,
                      width: 40,
                      height: 40,
                      borderRadius: 40,
                    }}
                    onPress={() => deleteFile("avatar", user.avatar?.filename)}
                  />
                </View>
              )}
            </LinearGradient>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="briefcase" size={20} color="grey" />
              <Text
                style={{
                  textAlignVertical: "bottom",
                  marginHorizontal: 8,
                  flex: 1,
                }}
              >
                {user.jobTitle} chez {user.organisation}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon name="school" size={20} color="grey" />
              <Text
                style={{
                  textAlignVertical: "bottom",
                  marginHorizontal: 8,
                  flex: 1,
                }}
              >
                Promotion {user.promo}
              </Text>
            </View>
            <Divider
              style={{
                marginVertical: 20,
                backgroundColor: "grey",
                borderWidth: 1,
                width: 20,
              }}
            />
            <View style={{ flexDirection: "row" }}>
              <Text style={{ textAlign: "justify", flex: 1, marginEnd: 8 }}>
                {user.description}
              </Text>
            </View>
            <Divider
              style={{
                marginVertical: 20,
                backgroundColor: "grey",
                borderWidth: 1,
                width: 20,
              }}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="at" size={20} color="grey" />
              <Text
                style={{ textAlignVertical: "bottom", marginStart: 8, flex: 1 }}
              >
                {user.email}
              </Text>
            </View>
          </ScrollView>
          <View>
            <Button
              title="Editer"
              onPress={() => navigation.navigate("Edit")}
            />
          </View>
        </View>
      ) : (
        <View
          style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => {
  return {
    uploadFile: (file, type) => dispatch(uploadFile(file, type)),
    deleteFile: (bucketName, id) => dispatch(deleteFile(bucketName, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReadProfileScreen);
