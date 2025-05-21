import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LoginStyles from './LoginPageStyle';


const LoginScreen = () => {
  const navigation = useNavigation();
  const handleLogin = () => {
    Alert.alert('Login pressed');
    //navigation.navigate('Main')
    //else: throw error or wtv
    
  };
  const handleRegister = () => {
    Alert.alert('Register pressed');
    //navigation.navigate("RegisterPage");
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
        <TouchableOpacity style={LoginStyles.button} onPress={handleLogin}>
          <Text style={LoginStyles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={LoginStyles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={LoginStyles.link}>Register</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
