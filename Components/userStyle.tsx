import { StyleSheet } from "react-native";

const userStyle = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20, 
        marginTop: 2,
        alignItems: "center",
        backgroundColor: "#fff",
    },

    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginTop: 40,
        marginBottom: 20,
    },
    name: {
        fontSize: 40,
        fontWeight: 700,
    },
    email: {
        fontSize: 16,
        color: "#666",
        marginBottom: 40,
    },
    logoutButton: {
        marginTop: 30,
        backgroundColor: "#d9534f",
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 25,
    },
    logoutText: {
        color: "#fff",
        fontWeight: '600',
        fontSize: 18,
    },
});

export default userStyle;