import { registerUser, saveUserData } from "@/services/firebaseRegisterService";
import RegisterStyle from "@/src/styles/RegisterStyle";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Register = () => {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !email || !password) {
            Alert.alert("Please fill in all fields");
            return;
        }
        setLoading(true);

        // can add additional password checks here. Firebase has a strict password requirement of 6 characters

        try {
            const userCredential = await registerUser(email, password);
            console.log('Registered:', userCredential.user);
            
            await saveUserData(userCredential.user.uid, {
                username,
                email,
                favourites: [],
                createdAt: new Date(),
            });


            setError('');
            setSuccess(true);
            Alert.alert("Registered successfully! Please Login.");

            router.replace('/');

        } catch (err: any) {
            console.error(err); // log the full error to the console

            let message = 'An unknown error occurred. Please try again';
            
            switch (err.code) {
                case 'auth/email-already-in-use':
                    message = 'This email is already registered.';
                    break;
                case 'auth/invalid-email':
                    message = 'Please enter a valid email address.';
                    break;
                case 'auth/weak-password':
                    message = 'Password should be at least 6 characters.';
                    break;
            }

            setError(message); // Show error message to user on screen
            setSuccess(false);
            
        } finally {
            setLoading(false);
        }
    }
   

    return (
            <SafeAreaView style={RegisterStyle.background} edges={['left', 'right', 'bottom']} >
                <StatusBar translucent backgroundColor="transparent"/>
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                    keyboardShouldPersistTaps='handled'
                >
                    <Image
                        source={require('../assets/images/storeShutter.png')}
                        style={{width: '101%', height: 110}}
                        resizeMode="cover"
                    />
                    <View style={{paddingBottom: 50, paddingTop: 120, alignItems: 'center', paddingHorizontal: 60, }}>
                        <Image source={require('../assets/images/FoodFindrLogoRMBG.png')} 
                            style={RegisterStyle.foodfindrLogo}
                            resizeMode='contain'
                        />
                        <View style={RegisterStyle.registerBox}>
                            <TextInput 
                                style={RegisterStyle.input}
                                placeholder="Username"
                                value={username} 
                                onChangeText={setUsername} 
                                autoCapitalize="none"
                            />

                            <TextInput 
                                placeholder="Email" 
                                style={RegisterStyle.input} 
                                value={email} 
                                onChangeText={setEmail} 
                                keyboardType="email-address" 
                                autoCapitalize="none"
                            />

                            <TextInput 
                                placeholder="Password" 
                                style={RegisterStyle.input} 
                                value={password} 
                                onChangeText={setPassword} 
                                secureTextEntry
                            />

                            <View style={RegisterStyle.buttonContainer}>

                                <TouchableOpacity 
                                    style={RegisterStyle.button} 
                                    onPress={handleRegister} 
                                    disabled={loading}
                                >
                                    <Text style={RegisterStyle.buttonText}>Register</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>     
            </SafeAreaView>
    );
};

export default Register;