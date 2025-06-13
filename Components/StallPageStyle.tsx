import { Dimensions, StyleSheet } from "react-native";

const {width: screenWidth} = Dimensions.get('window');

const StallStyle = StyleSheet.create ({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 16,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 20, 
        fontWeight: "600",
        marginTop: 20,
        marginBottom: 10,
    },
    carouselImage: {
        width: screenWidth,
        height: 300,
        borderWidth: 0,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    saveIcon: {
        position: 'absolute',
        top: 24,
        right: 20,
        zIndex: 10,
    },
});
export default StallStyle;