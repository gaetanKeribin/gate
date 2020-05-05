import React from "react";
import { Provider, useSelector, shallowEqual, useDispatch } from "react-redux";
import { SafeAreaView, Platform, StatusBar, View } from "react-native";
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
import useLinking from "./useLinking";

import { navigationRef, isMountedRef } from "./RootNavigation";

import { verifyToken } from "./actions/authActions";
import { fetchJobs, fetchMyJobs } from "./actions/jobsActions";
import { fetchUsers } from "./actions/usersActions";
import { fetchConversations } from "./actions/chatActions";

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
  const dispatch = useDispatch();
  React.useEffect(() => {
    function fetchData() {
      dispatch(fetchJobs());
      dispatch(fetchMyJobs());
      dispatch(fetchUsers());
      dispatch(fetchConversations());
    }

    fetchData();
  }, []);
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

const AppStack = (props) => {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(navigationRef);
  const dispatch = useDispatch();

  const userToken = useSelector((state) => state.auth.token, shallowEqual);

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      if (userToken !== null) {
        dispatch(verifyToken());
      }
      try {
        SplashScreen.preventAutoHide();

        setInitialNavigationState(await getInitialState());
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View
        style={{
          maxWidth: 500,
          flex: 1,
        }}
      >
        <NavigationContainer
          ref={navigationRef}
          initialState={initialNavigationState}
        >
          <Switch.Navigator headerMode="none">
            {userToken && <Switch.Screen name="Root" component={DrawerStack} />}
            {!userToken && <Switch.Screen name="Auth" component={Auth} />}
          </Switch.Navigator>
          <CustomOverlay />
        </NavigationContainer>
      </View>
    );
  }
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
