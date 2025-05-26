import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LoginStyles from '../Components/LoginPageStyle';
import { RootStack } from './Root';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStack, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const handleLogin = () => {
    navigation.navigate('Main');
    Alert.alert('Login pressed');
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
