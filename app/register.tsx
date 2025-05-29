import RegisterStyle from "@/Components/RegisterStyle";
import { registerUser } from "@/firebase/userRegister";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

const Register = () => {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
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
    return (
        <View style={RegisterStyle.container}>
            <View style={RegisterStyle.registerBox}>
                <Text style={RegisterStyle.title}>Create Account</Text>
                <TextInput placeholder="Username" style={RegisterStyle.input} value={username} onChangeText={setUsername} autoCapitalize="none"/>
                <TextInput placeholder="Email" style={RegisterStyle.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
                <TextInput placeholder="Password" style={RegisterStyle.input} value={password} onChangeText={setPassword} secureTextEntry/>
                <TouchableOpacity onPress={handleRegister} style={RegisterStyle.button} disabled={loading}>
                    <Text style={RegisterStyle.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Register;