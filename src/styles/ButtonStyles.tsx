import { StyleSheet } from "react-native";

const ButtonStyles = StyleSheet.create({
    largeOrangeButton: {
        flex: 1, 
        backgroundColor: '#ffb933',
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ffb933',
        paddingHorizontal: 20,
    },

    largeButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        paddingHorizontal: 15,
    },

    largeGreyButton: {
        flex: 1,
        color: '#fff',
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ffb933',
        paddingHorizontal: 20,
    },

    orangeText: {
        color: '#ffb933',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        paddingHorizontal: 15,
    },

    LeftButtonContainer: {
        alignItems: 'flex-end',
        marginTop: 10,
    },

    LeftHorizontalContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 10,
    },


});

export default ButtonStyles;