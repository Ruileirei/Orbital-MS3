import { signIn } from "@/services/firebaseAuthService";
import LoginStyles from "@/src/styles/LoginPageStyle";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const checkLogin = async () => {
        if (!email || !password) {
          Alert.alert("Please enter your email and password")
          return;
        } 
        setLoading(true);
        try {
          const userCredential = await signIn(email, password);
          const user = userCredential.user;
          console.log("User logged in: ", user);
          router.replace('/main');
        } catch (error: unknown) {
          if (
            typeof error === "object" && 
            error !== null &&
            'code' in error && 
            'message' in error
          ) {
            const firebaseError = error as {code: string; message: string};
            if (firebaseError.code === "auth/user-not-found" || firebaseError.code === "auth/wrong-password") {
              Alert.alert("Invalid email or password");
            } else if (firebaseError.code === "auth/too-many-requests") {
              Alert.alert("Too many attempts. Please try again later.");
            } else {
              Alert.alert("Error", firebaseError.message);
            }
          } else if (error instanceof Error) {
            Alert.alert("Error", error.message);
          } else {
            Alert.alert("An unknwon error has occured");
          }
        } finally {
          setLoading(false);
        }
    };

    const  checkRegister = () => {
        router.replace('/register');
    };

    return (
        <SafeAreaView style={LoginStyles.background} edges={['left', 'right', 'bottom']} >
          <StatusBar translucent backgroundColor="transparent"/>
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, backgroundColor: '#f0f2f5'}}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={require('../assets/images/storeShutter.png')}
              style={{width: '101%', height: 110}}
              resizeMode="cover"
            />
            <View style={{paddingBottom: 50, paddingTop: 120, alignItems: 'center', paddingHorizontal: 60, }}>
              <Image source={require('../assets/images/FoodFindrLogoRMBG.png')} 
                    style={LoginStyles.foodfindrLogo}
                    resizeMode="contain"
              />

              <View style={LoginStyles.loginBox}>

                <TextInput
                  style={LoginStyles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  style={LoginStyles.input}
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => router.push('/forgetPW')}>
                  <Text style={{color: '#007aff', marginLeft: 4, marginTop: -5, marginBottom: -5}}>Forgot Password?</Text>
                </TouchableOpacity>

                <View style={LoginStyles.buttonContainer}>
                  <TouchableOpacity style={LoginStyles.button} onPress={checkLogin} disabled={loading}>
                    <Text style={LoginStyles.buttonText}>Login</Text>
                  </TouchableOpacity>

                </View>

              </View>
            </View>
          </ScrollView>
          <View style={LoginStyles.bottomRegister}>
                <Text style={LoginStyles.registerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={checkRegister}>
                  <Text style={LoginStyles.link}>Register</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
  );
};

export default LoginScreen;
