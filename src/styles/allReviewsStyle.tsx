import { StyleSheet } from "react-native";

const allReviewsStyle = StyleSheet.create({

    Container: {
        backgroundColor: 'transparent',
        flex: 1,
    },

    // scrollable
    ReviewContainer: {
        backgroundColor: '#f7d89c',
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginTop: 20,
        marginHorizontal: 16,
        borderRadius: 10,
    },
    
    UserReviewContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        borderColor: '#eee',
        borderWidth: 1,
        marginBottom: 8,
        marginHorizontal: 12,
    },

    /*
    - stars & rating
    - filter
    - page
    */

})

export default allReviewsStyle;