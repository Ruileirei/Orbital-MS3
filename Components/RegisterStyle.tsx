import { StyleSheet } from "react-native";

const RegisterStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        justifyContent: 'center',
        padding: 20,
        alignItems:'center',
    },
    registerBox: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 12,
        width: '80%',
        elevation: 5, 
        shadowColor: '#000', 
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
    input: {
        height: 48,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    button: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#007bff',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 16,
    },
    registerLink: {
        marginTop: 20,
        textAlign: 'center',
    },
});

export default RegisterStyle;