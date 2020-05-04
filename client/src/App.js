import React from "react";
import "react-native-gesture-handler";
import { Provider, useSelector, shallowEqual, useDispatch } from "react-redux";
import { SafeAreaView, Platform, StatusBar } from "react-native";
import { store, persistor } from "./store/index";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ThemeProvider, Icon } from "react-native-elements";
import { SplashScreen } from "expo";

import MyJobs from "./components/MyJobs";
import Jobs from "./components/Jobs";
import Profile from "./components/Profile";
import People from "./components/People";
import Messages from "./components/Messages";
import Auth from "./components/Auth";
import CustomOverlay from "./components/CustomOverlay";
import theme from "./Theme.json";
import { navigationRef, isMountedRef } from "./RootNavigation";
import { verifyToken } from "./actions/authActions";
import useLinking from "./useLinking";

const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Switch = createStackNavigator();

const MainStack = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="People"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Jobs":
              iconName = "briefcase";
              break;
            case "People":
              iconName = "account-group";
              break;
            case "Messages":
              iconName = "forum";
              break;
            default:
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: theme.colors.primary,
        inactiveTintColor: "gray",
      }}
    >
      <BottomTab.Screen
        name="People"
        component={People}
        options={{ title: "Annuaire" }}
      />
      <BottomTab.Screen
        name="Jobs"
        component={Jobs}
        options={{ title: "Emplois" }}
      />
      <BottomTab.Screen
        name="Messages"
        component={Messages}
        options={{ title: "Messages" }}
      />
    </BottomTab.Navigator>
  );
};

const DrawerStack = () => {
  return (
    <Drawer.Navigator initialRouteName="Main" headerMode="screen">
      <Drawer.Screen
        name="Main"
        component={MainStack}
        options={{ title: "Accueil" }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{ title: "Mon profil" }}
      />
      <Drawer.Screen
        name="MyJobs"
        component={MyJobs}
        options={{ title: "Mes offres d'emplois" }}
      />
    </Drawer.Navigator>
  );
};

const AppStack = () => {
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const dispatch = useDispatch();

  const userToken = useSelector((state) => state.auth.token, shallowEqual);
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      if (userToken !== null) {
        dispatch(verifyToken());
      }
    };
    bootstrapAsync();
  }, []);

  const linking = {
    prefixes: ["https://mychat.com", "mychat://"],
    config: {
      Home: "feed/:sort",
    },
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      initialState={initialNavigationState}
    >
      <Switch.Navigator headerMode="none">
        {userToken && <Switch.Screen name="Root" component={DrawerStack} />}
        {!userToken && <Switch.Screen name="Auth" component={Auth} />}
      </Switch.Navigator>
      <CustomOverlay />
    </NavigationContainer>
  );
};

const App = () => {
  React.useEffect(() => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <SafeAreaView
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {Platform.OS === "ios" && <StatusBar barStyle="default" />}
            <AppStack />
          </SafeAreaView>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
