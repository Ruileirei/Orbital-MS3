import { StyleSheet } from "react-native";

const mapOptionsStyle = StyleSheet.create({
    SearchText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    SearchInput: {
        height: 50,
        borderWidth: 1, 
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        fontSize: 15,
    },
    OtherButton: {
        flex: 1,
        padding: 20, 
        backgroundColor: "#007aff",
        borderRadius: 12,
        marginBottom: 20,
        alignItems:'center',
        paddingVertical: 8,
    },
    OtherButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    }

})

export default mapOptionsStyle;