import RegisterStyle from "@/Components/RegisterStyle";
import { useRouter } from "expo-router";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

const Register = () => {
    const router = useRouter();

    const handleRegister = () => {
        Alert.alert('Registered!');
        router.replace('/');
    };
    return (
        <View style={RegisterStyle.container}>
            <View style={RegisterStyle.registerBox}>
                <Text style={RegisterStyle.title}>Create Account</Text>
                <TextInput placeholder="Username" style={RegisterStyle.input}/>
                <TextInput placeholder="Email" style={RegisterStyle.input}/>
                <TextInput placeholder="Password" style={RegisterStyle.input}/>
                <TouchableOpacity onPress={handleRegister} style={RegisterStyle.button}>
                    <Text style={RegisterStyle.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Register;