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
    stalloftheday: {
        backgroundColor: '#fff3e0',
        marginHorizontal: 20,
        padding: 16,
        marginTop: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    openStallsMainContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginTop: 20,
        marginHorizontal: 16,
        borderRadius: 10,
    },
    openStallTitleContainer: {
        backgroundColor: '#ffb933', 
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginBottom: 12,
        width: '100%',
    },

    openStallsIndividualContainer: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#eee'
    },
    openStallSeeMore: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#d32f2f',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'center'
    }
})

export default mainStyle;