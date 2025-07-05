import { StyleSheet } from "react-native";

const ButtonStyles = StyleSheet.create({
    largeOrangeButton: {
        backgroundColor: '#ffb933',
        paddingVertical: 12,
        borderRadius: 20,
        paddingHorizontal: 20,
    },

    largeButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        paddingHorizontal: 15,
    },

    LeftButtonContainer: {
        alignItems: 'flex-end',
        marginTop: 10,
    },


});

export default ButtonStyles;