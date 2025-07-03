import { StyleSheet } from "react-native";

const userStyle = StyleSheet.create({
    favouriteButton: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 20,
        marginTop: 10,
    },
    
    headerContainer: {
        padding: 20,
        backgroundColor: '#ffb933',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },

    favouriteText: {
        fontSize: 14, 
        color: "gray",
        textAlign: "center"
    },

    stallButton: {
        backgroundColor: '#f7d89c',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 20,
    },

    logoutButton: {
        backgroundColor: '#d9534f',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },

});

export default userStyle;