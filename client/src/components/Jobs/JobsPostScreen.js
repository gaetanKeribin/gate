import React, { useState, useContext } from "react";
import { connect, useDispatch } from "react-redux";
import { View, Switch, Text, ScrollView } from "react-native";
import { Input, Button, ThemeContext } from "react-native-elements";
import AppNavbar from "../AppNavbar";
import { createJob } from "../../actions/jobsActions";

const PostScreen = ({}) => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);

  const [errors, setErrors] = useState({});

  // Job
  const [employmentType, setEmploymentType] = useState("");
  const [asap, setAsap] = useState(false);
  const [organisation, setOrganisation] = useState("");
  const [city, setCity] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [salary, setSalary] = useState();
  const [minExp, setMinExp] = useState();
  const [contact, setContact] = useState("");

  const filled =
    !city ||
    !organisation ||
    !employmentType ||
    !jobDesc ||
    !jobTitle ||
    !contact
      ? false
      : true;

  const uploadJobOffer = () => {
    setUploading(true);

    const jobOffer = {
      employmentType,
      asap,
      organisation,
      city,
      salary,
      jobDesc,
      jobTitle,
      minExp,
      contact,
    };

    dispatch(createJob(jobOffer));
    setUploading(false);

    setAsap(false);
    setCity();
    setSalary();
    setContact();
    setErrors({});
    setEmploymentType();
    setOrganisation();
    setJobDesc();
    setJobTitle();
    setUploading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView
          style={{
            paddingHorizontal: 12,
            paddingTop: 20,
            paddingBottom: 100,
          }}
        >
          <Input
            label="Type de contrat*"
            placeholder="CDI, CDD, Apprentissage..."
            value={employmentType}
            onChangeText={(value) => setEmploymentType(value)}
            errorMessage={errors.employmentType}
          />
          <Input
            label="Organisation*"
            placeholder="Deloitte, Engie, EY..."
            value={organisation}
            onChangeText={(value) => setOrganisation(value)}
            errorMessage={errors.organisation}
          />
          <Input
            placeholder="Paris, Shanghai, Lyon..."
            label="Ville*"
            value={city}
            onChangeText={(value) => setCity(value)}
            errorMessage={errors.city}
          />
          <Input
            placeholder="Auditeur des SI, Pentester junior..."
            label="Intitulé du poste*"
            value={jobTitle}
            onChangeText={(value) => setJobTitle(value)}
            errorMessage={errors.jobTitle}
          />
          <Input
            label="Description du poste*"
            multiline
            inputStyle={{ height: 200, textAlignVertical: "top" }}
            placeholder="Les missions, les compétences requises, l'employeur..."
            value={jobDesc}
            onChangeText={(value) => setJobDesc(value)}
            errorMessage={errors.jobDesc}
          />
          <Input
            label="Expérience"
            placeholder="Années passées dans un poste similaire"
            value={minExp}
            keyboardType="numeric"
            onChangeText={(value) => setMinExp(value)}
            errorMessage={errors.minExp}
          />
          <Input
            label="Rémunération"
            placeholder="En €"
            value={salary}
            onChangeText={(value) => setSalary(value)}
            showSoftInputOnFocus={false}
            errorMessage={errors.salary}
          />
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
              Poste à pourvoir dès que possible
            </Text>
            <Switch value={asap} onValueChange={(value) => setAsap(value)} />
          </View>
          <Input
            label="Contact*"
            placeholder="Email"
            value={contact}
            onChangeText={(value) => setContact(value)}
            errorMessage={errors.contact}
          />
          <Button
            title={
              filled
                ? "Poster l'offre d'emploi"
                : "Veuillez remplir tous les champs obligatoires"
            }
            loading={uploading}
            disabled={!filled}
            buttonStyle={{ height: 50, marginBottom: 12 }}
            onPress={() => uploadJobOffer()}
          />
          <View style={{ height: 20 }}></View>
        </ScrollView>
      </View>
    </View>
  );
};

export default PostScreen;
