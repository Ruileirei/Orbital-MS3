import { usePathname, useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavBarStyle from "./NavBarStyle";

const BotNavBar = () => {
    const router = useRouter();
    const pathName = usePathname();

    const isActive = (route: string) => pathName.startsWith(route);

    return (
        <View style={NavBarStyle.botNav}>
            <TouchableOpacity 
                style={NavBarStyle.navButton}
                onPress={() => router.push('/main')}>
                <MaterialIcons
                    name="home"
                    size={28}
                    color={isActive('/main') ? '#007bff' : 'gray'}
                />
                <Text 
                    style={[NavBarStyle.navText, isActive('/main') && NavBarStyle.activeText]}> Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={NavBarStyle.navButton}
                onPress={() => router.push('/Map')}>
                <MaterialIcons
                    name="map"
                    size={28}
                    color="gray"
                />
                <Text style={NavBarStyle.navText}>Map</Text>
            </TouchableOpacity>
            

            <TouchableOpacity 
                style={NavBarStyle.navButton}
                onPress={() => router.push('/user')}>
                <MaterialIcons
                    name="person"
                    size={28}
                    color={isActive('/user') ? '#007bff' : 'gray'}
                />
                <Text style={[NavBarStyle.navText, isActive('/user') && NavBarStyle.activeText]}>User</Text>
            </TouchableOpacity>
        </View>
        
    );

};

export default BotNavBar;