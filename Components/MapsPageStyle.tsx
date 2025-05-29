import { StyleSheet } from "react-native";

const MapStyle = StyleSheet.create({
    map: {
        flex: 1
    },
    calloutContainer: {
        width: 200,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        elevation: 5
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5
    },
    cuisine: {
        fontSize: 14, 
        marginBottom: 5,
        color: "#666"
    },
    rating:{
        fontSize: 12,
        color: "#555"
    },
    location: {
        marginTop: 6,
        fontStyle: 'italic',
        color: '#555'
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalContent: {
        alignItems: 'flex-start',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    modalCuisine: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    modalRating: {
        fontSize: 16,
        color: '#ff9900',
        marginBottom: 10,
    },
    closeIcon: {
        position: "absolute",
        top: 0,
        right: -4,
        zIndex: 10,
        backgroundColor: 'gray',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default MapStyle;
