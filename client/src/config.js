import { Platform } from "react-native";

const apiConfig = {
  clientId: "1",
  clientSecret: "xc34jamesDevV41XwKbWhrsGgHvR3hjwG8",
};

if (process.env.NODE_ENV === "development") {
  if (Platform.OS === "web") {
    apiConfig.baseUrl = "http://localhost:8080/api/";
  } else if (Platform.OS === "android") {
    apiConfig.baseUrl = "http://10.0.2.2:8080/api/";
  }
} else {
  apiConfig.baseUrl = "https://siee-gate.herokuapp.com/api/";
}

export { apiConfig };
