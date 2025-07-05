import { StyleSheet } from "react-native";

const RegisterStyle = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        justifyContent: 'flex-start',
        paddingTop: 40,
        paddingHorizontal: 60,
    },

    foodfindrLogo: {
        width: 200,
        height: 120,
        marginBottom: 20,
        alignSelf: 'center',
    },

    registerBox: {
        justifyContent: 'flex-start',
        backgroundColor: '#FDF1E7',
        padding: 32,
        borderRadius: 12,
        width: '100%',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        marginTop: 20,
    },

    input: {
        height: 48,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 15,
        fontSize: 16,
    },

    buttonContainer: {
        alignItems: 'flex-end',
        marginTop: 10,
    },

    button: {
        backgroundColor: '#ffb933',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
    },

    buttonText: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 16,
    },

    bottomRegister: {
        position: "absolute",
        bottom: 20,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    registerText: {
        fontSize: 14,
        color: '#444',
    },

    link: {
        fontSize: 14,
        color: '#007bff',
    },

});

export default RegisterStyle;