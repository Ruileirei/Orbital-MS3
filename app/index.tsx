import LoginStyles from "@/Components/LoginPageStyle";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { isFirebaseError } from "../firebase/FireBaseErrorChecking";
import { authenticateUser } from "../firebase/userAuth";
//import { signInWithEmailAndPassword } from "firebase/auth";


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
          const user = await authenticateUser(email, password);
          if (user) {
            router.replace('/main');
          } else {
            Alert.alert("Invalid email or password")
          }
        } catch (error: unknown) {
          if (isFirebaseError(error)) {
            if (error.code === "permission-denied") {
              Alert.alert("Access denied", "You do not have permission.");
            } else {
              Alert.alert("Error", error.message);
            }
          } else if (error instanceof Error) {
            Alert.alert("Error", error.message);
          } else {
            Alert.alert("An unknown error occurred");
          }
        } finally {
          setLoading(false);
        }
    };

    const  checkRegister = () => {
        router.replace('/register');
    };

    return (
        <View style={LoginStyles.container}>
      <View style={LoginStyles.loginBox}>
        <Text style={LoginStyles.title}>Login</Text>
        <TextInput
          style={LoginStyles.input}
          placeholder="Email/Phone Number"
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
        <TouchableOpacity style={LoginStyles.button} onPress={checkLogin} disabled={loading}>
          <Text style={LoginStyles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={LoginStyles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={checkRegister}>
            <Text style={LoginStyles.link}>Register</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;