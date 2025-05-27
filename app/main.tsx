import BotNavBar from '@/Components/navigationBar';
import { DATA } from '@/Components/SampleData';
import { Icon, SearchBar } from '@rneui/themed';
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
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

    const handleFilter = () => {
        router.push('/filter');
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
            style = {SearchStyle.itemButton}>
            <Text style={{fontSize: 18, fontWeight: '600', marginBottom: 4}}>
                {item.title}
            </Text>
            <Text>{item.cuisine} • ⭐ {item.rating}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaProvider style={{flex: 1}}>
            <SafeAreaView style={SearchStyle.container}>
                <View style={{flex: 1}}>
                    <View style={SearchStyle.searchFilter}>
                        <View style={{flex: 1}}>
                            <SearchBar
                                containerStyle={SearchStyle.searchBar}
                                placeholder="Find food near you..."
                                onChangeText={searchFunction}
                                value={searchValue}
                            />
                        </View>
                        <TouchableOpacity onPress={handleFilter} style={{marginLeft: 10}}>
                            <Icon name='filter-list' 
                                  type='material'
                                  size={30}
                                  color='gray'
                                  />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={data}
                        renderItem={({item}) => <Item item={item}/>}
                        keyExtractor={(item) => item.id}
                        ListEmptyComponent={() => 
                            <Text>No match found</Text>
                        }
                    />
                </View>       
                <BotNavBar/>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default MainScreen;