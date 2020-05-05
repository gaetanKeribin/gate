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
      Root: {
        path: "root",
        screens: {
          Main: {
            path: "main",
            screens: {
              Jobs: {
                path: "emplois",
                screens: {
                  List: "emplois",
                  Read: "emplois/:id",
                  Post: "emplois/poster",
                },
              },
              People: {
                path: "annuaire",
                screens: {
                  List: "annuaire",
                  Read: "annuaire/:id",
                },
              },
              Messages: {
                path: "messagerie",
                screens: {
                  Lobby: "messagerie",
                  Room: "messagerie/:conversation_id",
                },
              },
            },
          },
          Profile: {
            path: "mon-profil",
            Read: "mon-profil",
            Edit: "mon-profil/modifier",
          },
          MyJobs: {
            path: "mes-offres",
            Read: "mes-offres",
            Edit: "mes-offres/:id",
          },
        },
      },
    },
  });
}
