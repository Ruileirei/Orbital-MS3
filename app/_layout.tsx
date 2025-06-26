import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="forgetPW" options={{title:'Forget Password'}}/>
          <Stack.Screen name="main" options={{ headerShown: false }} />
          <Stack.Screen name="stall/[id]"/>
          <Stack.Screen name="group/[id]"/>
          <Stack.Screen name="searchOptions" options={{title: "Search", presentation:'modal'}}/>
          <Stack.Screen name="filter" options={{ title: "Filter", headerShown: false }} />
          <Stack.Screen name="search" options={{headerShown: false}}/>
          <Stack.Screen name="user" options={{ title: "User Profile", headerShown: false }} />
          <Stack.Screen name="userSavedStalls" options={{title: "Your Saved Stalls"}}/>
          <Stack.Screen name="Map" options={{ title: "Map", headerShown: true }} />
          <Stack.Screen name="register" options={{headerShown: false}}/>
          <Stack.Screen name="nearby" options={{headerShown: false}}/>
          <Stack.Screen name="filterNearby" options={{headerShown: false}}/>
          <Stack.Screen name="editProfile" options={{title: 'Edit Profile'}}/>
        </Stack>
        <Toast/>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
