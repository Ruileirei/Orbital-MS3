//import RegisterStyle from "@/Components/RegisterStyle";
import LoginStyles from "@/Components/LoginPageStyle";
//import { registerUser } from "@/firebase/userRegister";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../firebase/firebaseConfig";

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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Registered:', userCredential.user);
            
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                username: username,
                email: email,
                favourites: [],
                createdAt: new Date()
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
    
    /*
    const first = async () => {
        if (!username || !email || !password) {
            Alert.alert("Please fill in all fields");
            return;
        }
        setLoading(true);
        try {
            await registerUser(username, email, password);
            Alert.alert("Registered successfully! Please Login.");
            router.replace('/');
        } catch (error: any) {
            if (error.message.includes("Username is already taken")) {
                Alert.alert("Username is already taken");
            } else if (error.message.includes("Email is already in use")) {
                Alert.alert("Email is already in use");
            } else {
                Alert.alert("Registration failed", error.message || "Unknown error occured");
            }
        } finally {
            setLoading(false);
        }
    };
    */ 
   

    return (
        <View style={LoginStyles.background}>
            <Text style={LoginStyles.shutter}> shutter </Text>
            <Image source={require('../assets/images/FoodFindrLogo.jpg')} 
            style={LoginStyles.foodfindrLogo}/>

            <View style={LoginStyles.loginBox}>
                <TextInput 
                    style={LoginStyles.input}
                    placeholder="Username"
                    value={username} 
                    onChangeText={setUsername} 
                    autoCapitalize="none"
                />

                <TextInput 
                    placeholder="Email" 
                    style={LoginStyles.input} 
                    value={email} 
                    onChangeText={setEmail} 
                    keyboardType="email-address" 
                    autoCapitalize="none"
                />

                <TextInput 
                    placeholder="Password" 
                    style={LoginStyles.input} 
                    value={password} 
                    onChangeText={setPassword} 
                    secureTextEntry
                />

                <View style={LoginStyles.buttonContainer}>

                    <TouchableOpacity 
                        style={LoginStyles.button} 
                        onPress={handleRegister} 
                        disabled={loading}
                    >
                        <Text style={LoginStyles.buttonText}>Register</Text>
                    </TouchableOpacity>

                </View>


            </View>

        </View>
    );
};

export default Register;