import { StyleSheet } from "react-native";

const NavBarStyle = StyleSheet.create({
    botNav: {
        height: 60,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#fff",
        justifyContent: "space-around",
        alignItems: "center",
    },
    navButton: {
        alignItems: "center",
    },
    navText: {
        fontSize: 12,
        color: 'gray',
    },
    activeText: {
        color: "#007bff",
        fontWeight: "600",
    },
});

export default NavBarStyle;