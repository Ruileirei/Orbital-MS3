import LoginStyles from "@/Components/LoginPageStyle";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
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
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
        <View style={LoginStyles.background}>

          
          <Text style={LoginStyles.shutter}> shutter </Text>
          <Image source={require('../assets/images/FoodFindrLogo.jpg')} 
            style={LoginStyles.foodfindrLogo}/>

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

            <View style={LoginStyles.buttonContainer}>
              <TouchableOpacity style={LoginStyles.button} onPress={checkLogin} disabled={loading}>
                <Text style={LoginStyles.buttonText}>Login</Text>
              </TouchableOpacity>

            </View>
            

          </View>

          <View style={{flex: 1}}></View>


          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={LoginStyles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={checkRegister}>
              <Text style={LoginStyles.link}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
  );
};

export default LoginScreen;