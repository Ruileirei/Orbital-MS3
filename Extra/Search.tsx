import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchBar } from '@rneui/themed';
import { useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SearchStyle from "../Components/SearchStyle";
import { RootStack } from './Root';

const DATA = [
  { id: "1", title:"Munchi Pancakes", cuisine:"Chinese", rating: 4.9},
  { id: "2", title:"Mommy Rendang", cuisine:"Malay", rating: 4.3},
  { id: "3", title:"Al Mahboob Rojak", cuisine:"Indian", rating: 4.2},
  { id: "4", title:"Im Thai Kitchen", cuisine:"Thai", rating: 3.4},
  { id: "5", title:"Thai Tee Det", cuisine:"Thai", rating: 4.8},
  { id: "6", title:"Ka Ka Curry House", cuisine:"Japanese", rating: 4.1},
  { id: "7", title:"Zoul's Corner", cuisine:"Malay", rating: 4.1},
  { id: "8", title:"Yong Seng Heng Prawn Noodle", cuisine:"Chinese", rating: 3.5},
  { id: "9", title:"Marlina Muslim Food", cuisine:"Malay", rating: 4.8},
  { id: "10", title:"Nasi Lemak Ayam Taliwang", cuisine:"Malay", rating: 4.5},
  { id: "11", title:"Fusion Western Cuisine", cuisine:"Western", rating: 3.4},
  { id: "12", title:"Jian fa BBQ Seafood", cuisine:"Chinese", rating: 3.1},
];

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStack, 'Main'>;

//change arraydata to some hawker stalls + name + cuisine + rating
const Search = () => {
    const [data, setData] = useState(DATA);
    const [searchValue, setSearchValue] = useState(""); 
    const arrayholder = useRef(DATA); 

    const navigation = useNavigation<SearchScreenNavigationProp>();

    const navigateStall = (item: typeof DATA[number]) => {
        navigation.navigate('StallInfo', {place: item})
    }

    const Item = ({item}: {item: { id: string; title: string; cuisine: string; rating: number }}) => (
        <TouchableOpacity
            style={SearchStyle.item}
            onPress={() => navigateStall(item)}>
            <Text style={SearchStyle.itemText}>{item.title}</Text>
            <Text style={SearchStyle.itemText}>{item.cuisine} • ⭐ {item.rating}</Text> 
        </TouchableOpacity>
);

    const searchFunction = (text: string) => {
        const updatedData = arrayholder.current.filter((item) => {
            const itemData = item.title.toUpperCase(); 
            const textData = text.toUpperCase();
            return itemData.includes(textData);
        });
    setData(updatedData);
    setSearchValue(text);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={SearchStyle.container}>
                <SearchBar
                placeholder="Find food near you..."
                onChangeText={searchFunction}
                value={searchValue}/>
                <FlatList
                    data={data}
                    renderItem={({item}) => <Item item={item}/>}
                    keyExtractor={(item) => item.id}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default Search;
