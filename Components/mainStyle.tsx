import { StyleSheet } from "react-native";

const mainStyle = StyleSheet.create({
    topContainer: {
        padding: 20,
        backgroundColor: '#ffb933',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    WelcomeText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    SearchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryButton: {
        width: '30%',
        backgroundColor: '#f7d89c',
        borderRadius: 10,
        alignItems: 'center',
        paddingVertical: 16,
        marginBottom: 16,
    },  
})

export default mainStyle;