import { SearchBar } from '@rneui/themed';
import { useRef, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SearchStyle from "./SearchStyle";

const DATA = [
  { id: "1", title: "Data Structures" },
  { id: "2", title: "STL" },
  { id: "3", title: "C++" },
  { id: "4", title: "Java" },
  { id: "5", title: "Python" },
  { id: "6", title: "CP" },
  { id: "7", title: "ReactJs" },
  { id: "8", title: "NodeJs" },
  { id: "9", title: "MongoDb" },
  { id: "10", title: "ExpressJs" },
  { id: "11", title: "PHP" },
  { id: "12", title: "MySql" },
];

const Item = ({title}: {title: string}) => (
  <View style={SearchStyle.item}> 
    <Text style={SearchStyle.itemText}>{title}</Text> 
  </View>
);
//change arraydata to some hawker stalls + name + cuisine + rating
const Search = () => {
    const [data, setData] = useState(DATA);
    const [searchValue, setSearchValue] = useState(""); 
    const arrayholder = useRef(DATA); 

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
                    renderItem={({item}) => <Item title={item.title}/>}
                    keyExtractor={(item) => item.id}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default Search;
