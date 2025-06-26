import { auth } from '@/firebase/firebaseConfig';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const forgetPWScreen = () => {
    const [email, setEmail] = useState('');
    const router = useRouter();

    const getEmail = async () => {
        if (!email) {
            Alert.alert("Please enter your email.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Reset link sent, Please check your inbox for steps to reset your password.");
            router.replace('/');
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                Alert.alert("Email not found. Not account associated with this email.");
            } else {
                Alert.alert("Error: ", error.message);
            }
        }
    };
    return (
        <SafeAreaView style={{flex: 1, justifyContent:'flex-start', padding: 20, marginTop: -30}}>
            <TextInput 
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 20,
                }}
                placeholder='Enter your email'
                keyboardType='email-address'
                autoCapitalize='none'
                value={email}
                onChangeText={setEmail}
            />
            <TouchableOpacity 
                onPress={getEmail}
                style={{
                    backgroundColor:'#007aff',
                    padding: 15,
                    borderRadius: 8,
                    alignItems:'center'
                }}
            >
                <Text style={{color: '#fff', fontWeight: 'bold'}}>Send reset link</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default forgetPWScreen;