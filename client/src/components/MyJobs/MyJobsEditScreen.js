import React, { useContext, useState } from "react";
import { View, Text, Switch, ScrollView } from "react-native";
import { Input, Icon, ThemeContext, Button } from "react-native-elements";
import { connect } from "react-redux";
import { updateJob, deleteJob, fetchMyJobs } from "../../actions/jobsActions";

const MyJobsEditScreen = ({
  updateJob,
  deleteJob,
  route,
  fetchMyJobs,
  navigation
}) => {
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { job } = route.params;
  const { theme } = useContext(ThemeContext);
  const [employmentType, setEmploymentType] = useState(job.employmentType);
  const [asap, setAsap] = useState(job.asap);
  const [organisation, setOrganisation] = useState(job.organisation);
  const [city, setCity] = useState(job.city);
  const [salary, setSalary] = useState(job.salary);
  const [jobTitle, setJobTitle] = useState(job.jobTitle);
  const [jobDesc, setJobDesc] = useState(job.jobDesc);
  const [minExp, setMinExp] = useState(`${job.minExp}`);
  const [contact, setContact] = useState(job.contact);
  const [errors, setErrors] = useState({});

  const onEditJob = () => {
    {
      if (!employmentType) {
        return setErrors({
          employmentType: "Ce champs est obligatoire."
        });
      } else if (!organisation) {
        return setErrors({
          organisation: "Ce champs est obligatoire."
        });
      } else if (!city) {
        return setErrors({
          city: "Ce champs est obligatoire."
        });
      } else if (!jobDesc) {
        return setErrors({
          jobDesc: "Ce champs est obligatoire."
        });
      } else if (!jobTitle) {
        return setErrors({
          jobTitle: "Ce champs est obligatoire."
        });
      } else if (!minExp) {
        return setErrors({
          minExp: "Ce champs est obligatoire."
        });
      }
    }

    updateJob({
      ...job,
      employmentType,
      asap,
      organisation,
      city,
      salary,
      jobDesc,
      jobTitle,
      minExp,
      contact
    });

    {
      setAsap(false);
      setCity();
      setSalary();
      setContact();
      setErrors({});
      setEmploymentType();
      setOrganisation();
      setJobDesc();
      setJobTitle();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignContent: "space-between",
        paddingVertical: 8,
        paddingHorizontal: 8,
        backgroundColor: "white"
      }}
    >
      <ScrollView>
        <Input
          label="Type de contrat*"
          placeholder="CDI, CDD, Apprentissage..."
          value={employmentType}
          onChangeText={value => setEmploymentType(value)}
          errorMessage={errors.employmentType}
        />
        <Input
          label="Organisation*"
          placeholder="Deloitte, Engie, EY..."
          value={organisation}
          onChangeText={value => setOrganisation(value)}
          errorMessage={errors.organisation}
        />
        <Input
          placeholder="Paris, Shanghai, Lyon..."
          label="Ville*"
          value={city}
          onChangeText={value => setCity(value)}
          errorMessage={errors.city}
        />
        <Input
          placeholder="Auditeur des SI, Pentester junior..."
          label="Intitulé du poste*"
          value={jobTitle}
          onChangeText={value => setJobTitle(value)}
          errorMessage={errors.jobTitle}
        />
        <Input
          label="Description du poste*"
          multiline
          inputStyle={{ height: 200, textAlignVertical: "top" }}
          placeholder="Les missions, les compétences requises, l'employeur..."
          value={jobDesc}
          onChangeText={value => setJobDesc(value)}
          errorMessage={errors.jobDesc}
        />
        <Input
          label="Expérience*"
          placeholder="Années passées dans un poste similaire"
          value={minExp}
          keyboardType="number-pad"
          onChangeText={value => setMinExp(value)}
          errorMessage={errors.minExp}
        />
        <Input
          label="Rémunération"
          placeholder="En €"
          keyboardType="decimal-pad"
          value={salary}
          onChangeText={value => setSalary(value)}
          showSoftInputOnFocus={false}
          errorMessage={errors.salary}
        />
        <View
          style={{
            marginBottom: 12,
            flexDirection: "row",
            display: "flex",
            height: 40
          }}
        >
          <Text
            style={{
              color: theme.colors.grey3,
              fontWeight: "bold",
              paddingLeft: 10,
              fontSize: 16,
              flex: 1,
              textAlignVertical: "center"
            }}
          >
            Poste à pourvoir dès que possible
          </Text>
          <Switch
            trackColor={{
              false: theme.colors.grey4,
              true: theme.colors.primarySoft
            }}
            thumbColor={asap ? theme.colors.primary : theme.colors.grey2}
            value={asap}
            onValueChange={value => setAsap(value)}
          />
        </View>
        <Input
          label="Contact"
          placeholder="Email"
          value={contact}
          onChangeText={value => setContact(value)}
          errorMessage={errors.contact}
        />
      </ScrollView>
      <View style={{ paddingTop: 8 }}>
        <Button
          title="Valider les changements"
          loading={updating}
          onPress={() => {
            setUpdating(true);
            onEditJob();
            setUpdating(false);
            fetchMyJobs();
            navigation.navigate("Read");
          }}
          buttonStyle={{ backgroundColor: theme.colors.primary }}
        />
        <Button
          title="Supprimer l'offre"
          loading={deleting}
          onPress={async () => {
            setDeleting(true);
            await deleteJob(job._id);
            setDeleting(false);
            fetchMyJobs();
            navigation.navigate("Read");
          }}
          buttonStyle={{ backgroundColor: theme.colors.error }}
        />
      </View>
    </View>
  );
};

const mapStateToProps = state => {
  return { jobs: state.jobs, auth: state.auth };
};

const mapDispatchToProps = dispatch => {
  return {
    updateJob: job => dispatch(updateJob(job)),
    deleteJob: id => dispatch(deleteJob(id)),
    fetchMyJobs: () => dispatch(fetchMyJobs())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyJobsEditScreen);
