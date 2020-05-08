import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar,
  Divider,
  Icon,
  Button,
  ThemeContext,
} from "react-native-elements";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  uploadFile,
  deleteFile,
  dataURLtoBlob,
} from "../../actions/filesActions";
import { LinearGradient } from "expo-linear-gradient";
import _ from "lodash";
import AppNavbar from "../AppNavbar";

const ReadProfileScreen = ({ navigation }) => {
  const [showAvatarForm, setShowAvatarForm] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const editAvatar = () => {
    const selectPicture = async () => {
      await ImagePicker.requestCameraRollPermissionsAsync();

      const file = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
      });

      if (file.cancelled) return;

      if (Platform.OS === "web") {
        let blob = dataURLtoBlob(file.uri);
        console.log("selectPicture -> blob", blob);
        dispatch(uploadFile(blob, "avatars"));
      } else {
        let res = await fetch(file.uri);
        console.log("selectPicture -> res", res);
        let blob = await res.blob();
        console.log("selectPicture -> blob", blob);
        dispatch(uploadFile(blob, "avatars"));
      }
    };
    selectPicture();
    setShowAvatarForm(false);
  };

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
      {user ? (
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
                {user.professor && (
                  <Text style={{ color: theme.colors.grey4, paddingLeft: 4 }}>
                    Professeur
                  </Text>
                )}
                {user.administration && (
                  <Text style={{ color: theme.colors.grey4, paddingLeft: 4 }}>
                    Membre du corps administratif
                  </Text>
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
                    uri: `http://localhost:8080/api/files/avatars/${user.avatar}`,
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
              <View
                style={{
                  marginLeft: -40,
                  justifyContent: "space-between",
                }}
              >
                <Button
                  icon={<Icon name="pencil" color={theme.colors.secondary} />}
                  onPress={() => editAvatar()}
                  buttonStyle={{
                    elevation: 10,
                    backgroundColor: theme.colors.primaryLight,
                    width: 40,
                    height: 40,
                    borderRadius: 40,
                  }}
                />
                {user.avatar && (
                  <Button
                    icon={<Icon name="delete" color={theme.colors.grey4} />}
                    buttonStyle={{
                      backgroundColor: theme.colors.grey0,
                      width: 40,
                      height: 40,
                      borderRadius: 40,
                    }}
                    onPress={() => dispatch(deleteFile("avatars", user.avatar))}
                  />
                )}
              </View>
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
          <View style={{ paddingHorizontal: 20 }}>
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

export default ReadProfileScreen;
