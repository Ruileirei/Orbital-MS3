import { StyleSheet } from "react-native";
const SearchStyle = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 2,
        padding: 10,
    },

    searchFilter: {
        flexDirection: 'row',
        alignItems:'center',
        margin: 10,
    },

    searchBar: {
        backgroundColor: 'transparent',
        borderTopWidth: 0, 
        borderBottomWidth: 0,
        padding: 0,
    },

    itemButton: {
        backgroundColor: 'white',
        marginVertical: 8,
        marginHorizontal: 10,
        padding: 15,
        borderRadius: 12,
        elevation: 3,
    },

    item: {
        backgroundColor: "grey",
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 8,
    },
    itemText: {
        color: "white",
        fontSize: 18,
  },
});
export default SearchStyle;