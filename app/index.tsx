import LoginStyles from "@/Components/LoginPageStyle";
import { useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const LoginScreen = () => {
    const router = useRouter();

    const checkLogin = () => {
        router.replace('/main');
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
        />
        <TextInput
          style={LoginStyles.input}
          placeholder="Password"
          secureTextEntry
        />
        <TouchableOpacity style={LoginStyles.button} onPress={checkLogin}>
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