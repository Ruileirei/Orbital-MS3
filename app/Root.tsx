import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "./LoginPage";
import MainScreen from "./MainPage";

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Login',
  screens: {
    Login : LoginScreen,
    Main : MainScreen
  },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;