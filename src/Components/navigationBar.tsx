import { usePathname, useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavBarStyle from "../styles/NavBarStyle";

const BotNavBar = ({shiftUp = false}) => {
    const router = useRouter();
    const pathName = usePathname();

    const isActive = (route: string) => pathName.startsWith(route);

    return (
        <View style={[
            NavBarStyle.botNav,
            shiftUp && {bottom: 20},
        ]}>
            <TouchableOpacity 
                style={NavBarStyle.navButton}
                onPress={() => router.push('/main')}>
                <MaterialIcons
                    name="home"
                    size={28}
                    color={isActive('/main') ? '#ffb933' : 'gray'}
                />
                <Text 
                    style={[NavBarStyle.navText, isActive('/main') && NavBarStyle.activeText]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={NavBarStyle.navButton}
                onPress={() => router.push('/nearby')}>
                <MaterialIcons
                    name="location-on"
                    size={28}
                    color={isActive('/nearby') ? '#ffb933' : 'gray'}
                />
                <Text style={[NavBarStyle.navText, isActive('/nearby') && NavBarStyle.activeText]}>
                    Nearby
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={NavBarStyle.navButton}
                onPress={() => router.push('/Map')}>
                <MaterialIcons
                    name="map"
                    size={28}
                    color={isActive('/Map') ? '#ffb933' : 'gray'}
                />
                <Text style={NavBarStyle.navText}>Map</Text>
            </TouchableOpacity>
            

            <TouchableOpacity 
                style={NavBarStyle.navButton}
                onPress={() => router.push('/user')}>
                <MaterialIcons
                    name="person"
                    size={28}
                    color={isActive('/user') ? '#ffb933' : 'gray'}
                />
                <Text style={[NavBarStyle.navText, isActive('/user') && NavBarStyle.activeText]}>User</Text>
            </TouchableOpacity>
        </View>
        
    );

};

export default BotNavBar;