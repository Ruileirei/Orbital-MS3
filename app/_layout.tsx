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
          <Stack.Screen name="main" options={{ headerShown: false, animation:'slide_from_bottom' }} />
          <Stack.Screen name="stall/[id]" options={{headerShown: false}}/>
          <Stack.Screen name="group/[id]" options={{headerShown: false}}/>
          <Stack.Screen name="searchOptions" options={{headerShown: false, presentation:'modal', animation:'fade', gestureDirection:'horizontal'}}/>
          <Stack.Screen name="filter" options={{ title: "Filter", headerShown: false, animation:'fade', gestureDirection:'horizontal' }} />
          <Stack.Screen name="search" options={{headerShown: false}}/>
          <Stack.Screen name="user" options={{ title: "User Profile", headerShown: false, animation:'slide_from_bottom' }} />
          <Stack.Screen name="userSavedStalls" options={{title: "Your Saved Stalls"}}/>
          <Stack.Screen name="Map" options={{ headerShown: false, animation:'slide_from_bottom' }} />
          <Stack.Screen name="register" options={{headerShown: false, animation: 'flip', gestureDirection:'horizontal'}}/>
          <Stack.Screen name="nearby" options={{headerShown: false, animation:'slide_from_bottom' }}/>
          <Stack.Screen name="filterNearby" options={{headerShown: false, animation:'fade', gestureDirection:'horizontal'}}/>
          <Stack.Screen name="editProfile" options={{title: 'Edit Profile'}}/>
        </Stack>
        <Toast/>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
