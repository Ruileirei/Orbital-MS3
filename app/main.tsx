import { DATA } from '@/Components/SampleData';
import { SearchBar } from '@rneui/themed';
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SearchStyle from "../Components/SearchStyle";


const MainScreen = () => {
    const router = useRouter();
    const [data, setData] = useState(DATA);
    const [searchValue, setSearchValue] = useState('');
    const arrayholder = useRef(DATA);

    const navigateStall = (item: typeof DATA[number]) => {
        router.push({
            pathname: '/stall/[id]',
            params: {
                id: item.id,
                title: item.title,
                cuisine: item.cuisine,
                rating: item.rating.toString(),
            },
        });
    };

    const searchFunction = (text: string) => {
        const filtered = arrayholder.current.filter((item) => {
            const itemData = item.title.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.includes(textData);
        });
        setData(filtered);
        setSearchValue(text);
    }


    const Item = ({ item }: {item: { id: string; title: string; cuisine: string; rating: number }}) => (
        <TouchableOpacity 
            onPress={() => navigateStall(item)}
            style = {{padding: 20,
                      borderBottomWidth: 1
                    }}>
            <Text style={{fontSize: 18}}>
                {item.title}
            </Text>
            <Text>{item.cuisine} • ⭐ {item.rating}</Text>
        </TouchableOpacity>
    );

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
};

export default MainScreen;