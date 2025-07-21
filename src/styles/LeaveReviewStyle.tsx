import { StyleSheet } from "react-native";

const LeaveReviewStyle = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'transparent',
        //paddingVertical: 40,
        paddingHorizontal: 40,
    },

    reviewBox: {
        //flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#FDF1E7',
        padding: 32,
        borderRadius: 12,
        width: '100%',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        //shadowOffset: { width: 0, height: 4 },
        marginTop: 20,
    },

    input: {
        flex: 1,
        height: 150,
        borderColor: '#ffb933',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 15,
        fontSize: 16,
    },

});

export default LeaveReviewStyle;