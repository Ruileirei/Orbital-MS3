import BotNavBar from "@/Components/navigationBar";
import userStyle from "@/Components/userStyle";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const userPage = () => {
    const router = useRouter();

    const handleLogOut = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [{text: 'cancel', style: 'cancel'},
                {
                text: 'Logout',
                style: 'destructive',
                onPress: () => {
                    router.replace('/');
                },
            },]
        );
    };

    return (
        <SafeAreaProvider style={{flex: 1}}>
            <SafeAreaView style={[userStyle.container, {width: '100%', paddingBottom: 10}]}>
                <View style={userStyle.innerContainer}>
                    <Image
                        source={{uri:'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'}}
                        style={userStyle.avatar}/>
                    <Text style={userStyle.name}>Default User</Text>
                    <Text style={userStyle.email}>Default@gmail.com</Text>
                    <TouchableOpacity 
                        style={userStyle.logoutButton}
                        onPress={handleLogOut}>
                            <Text style={userStyle.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
                <View style={{width: '100%'}}><BotNavBar/></View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default userPage;
