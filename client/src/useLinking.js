import { useLinking } from "@react-navigation/native";
import { Linking } from "expo";

export default function (containerRef) {
  return useLinking(containerRef, {
    prefixes: [Linking.makeUrl("/")],
    config: {
      Auth: {
        path: "auth",
        screens: {
          LogIn: "login",
          SignUp: "signup",
        },
      },
    },
  });
}
