import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from './LoginPage';
import Search from "./Search";
import StallScreen from './StallPage';
export type RootStack = {
  Login: undefined;
  Main: undefined;
  StallInfo: {
    place: {
      id: string; 
      title: string; 
      cuisine: string; 
      rating: number
    };
  };
};

const Stack = createNativeStackNavigator<RootStack>();
export default function Root() {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen 
      name='Login' 
      component={LoginScreen} 
      options={{title: 'Login', 
                headerShown: false,}}
      />
      <Stack.Screen 
      name='Main' 
      component={Search} 
      options={{title: 'Main', 
                gestureEnabled: false, 
                headerShown: false}}
      />      
      <Stack.Screen
      name='StallInfo'
      component={StallScreen}
      options={{title: 'Stall Details',
                headerBackVisible: true}}
      />
    </Stack.Navigator>
    
  );
}
