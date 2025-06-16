import BotNavBar from '@/Components/navigationBar';
import SearchStyle from '@/Components/SearchStyle';
import StallItem from '@/Components/StallItem';
import { db } from '@/firebase/firebaseConfig';
import { getOpenStatus } from '@/utils/isOpenStatus';
import { Icon } from '@rneui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

interface Stall {
    id: string;
    title: string;
    cuisine: string;
    rating: number;
    openingHours: {
        [key: string]: string[];
    };
    latitude: number;
    longitude: number;
}

const SearchScreen = () => {
    const router = useRouter();
    const [data, setData] = useState<Stall[]>([]);
    const [stallsCache, setStallsCache] = useState<Stall[]>([]);
    const [currPage, setCurrPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');

    const pageSize = 10;
    const params = useLocalSearchParams();
    const cuisineParams = typeof params.cuisine === 'string' ? params.cuisine : '';
    const selectedCuisine = cuisineParams ? cuisineParams.split(',') : [];
    const hideClosed = params.hideClosed === 'true';
    const sortByParam = typeof params.sortBy === 'string' ? params.sortBy : 'None';

    useEffect(() => {
        async function fetchStalls() {
            try {
                const queryRes = await getDocs(collection(db, 'stalls'));
                const stalls: Stall[] = [];
                queryRes.forEach((doc) => {
                    const stallData = doc.data();
                    stalls.push({
                        id: doc.id,
                        title: stallData.name ?? '',
                        cuisine: stallData.cuisine ?? '',
                        rating: stallData.rating ?? 0,
                        openingHours: stallData.openingHours ?? {},
                        latitude: stallData.latitude ?? 0,
                        longitude: stallData.longitude ?? 0,
                    });
                });
                setStallsCache(stalls);
                setCurrPage(1);
            } catch (error) {
                console.error('Error fetching stalls:', error);
            }
        }
        fetchStalls();
    }, []);

    const getFilteredStalls = () => {
        let filtered = stallsCache;

        if (selectedCuisine.length > 0) {
            filtered = filtered.filter((item) =>
                selectedCuisine.includes(item.cuisine)
            );
        }

        if (hideClosed) {
            filtered = filtered.filter(
                (item) => getOpenStatus(item.openingHours ?? {}) === 'OPEN'
            );
        }

        if (sortByParam === 'High to Low') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortByParam === 'Low to High') {
            filtered.sort((a, b) => a.rating - b.rating);
        }

        if (searchValue.trim() !== '') {
            const textData = searchValue.trim().toUpperCase();
            filtered = filtered.filter(item =>
                item.title.toUpperCase().includes(textData)
            );
        }

        return filtered;
    };

    useEffect(() => {
        const filtered = getFilteredStalls();
        const startPage = (currPage - 1) * pageSize;
        const paginated = filtered.slice(startPage, startPage + pageSize);

        setData(paginated);
    }, [selectedCuisine.join(','), stallsCache, hideClosed, sortByParam, currPage, searchValue]);

    const navigateStall = (item: Stall) => {
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
        const hideClosedParam = hideClosed ? '&hideClosed=true' : '';
        const sortByQueryParam = sortByParam !== 'None' ? `&sortBy=${encodeURIComponent(sortByParam)}` : '';
        setCurrPage(1);
        router.push(
            `/filter?cuisine=${encodeURIComponent(selectedCuisine.join(','))}${hideClosedParam}${sortByQueryParam}`
        );
    };

    const totalFiltered = getFilteredStalls().length;
    const totalPages = Math.ceil(totalFiltered / pageSize);

    const PaginationControls = () => {
        const maxPageButtons = 5;
        let startPage = Math.max(1, currPage - Math.floor(maxPageButtons / 2));
        let endPage = startPage + maxPageButtons - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                <TouchableOpacity
                    onPress={() => setCurrPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currPage === 1}
                    style={{ marginHorizontal: 5 }}
                >
                    <Text style={{ color: currPage === 1 ? 'gray' : 'black' }}>Prev</Text>
                </TouchableOpacity>

                {pageNumbers.map((page) => (
                    <TouchableOpacity
                        key={`page-${page}`}
                        onPress={() => setCurrPage(page)}
                        style={{ marginHorizontal: 5 }}
                    >
                        <Text style={{ color: page === currPage ? 'blue' : 'black' }}>{page}</Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity
                    onPress={() => setCurrPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currPage === totalPages}
                    style={{ marginHorizontal: 5 }}
                >
                    <Text style={{ color: currPage === totalPages ? 'gray' : 'black' }}>Next</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
                <View style={{ flex: 1 }}>
                    <View style={SearchStyle.searchContainer}>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Search</Text>
                        <View style={SearchStyle.Searchbar}>
                        <Icon name="search" type="ionicon" size={20} color="gray" />
                        <TextInput
                            placeholder="Search for food..."
                            value={searchValue}
                            onChangeText={(text) => {
                            setSearchValue(text);
                            setCurrPage(1);
                            }}
                            style={{ flex: 1, marginLeft: 10, fontSize: 15 }}
                        />
                        <TouchableOpacity onPress={handleFilter} style={{ marginLeft: 6 }}>
                            <Icon name="filter-list" type="material" size={24} color="gray" />
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <StallItem item={item} onPress={() => navigateStall(item)} />
                    )}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={() => <Text style={{ textAlign: 'center', marginTop: 20 }}>No match found</Text>}
                    ListFooterComponent={totalPages > 1 ? <PaginationControls /> : null}
                    contentContainerStyle={{ paddingBottom: 10, paddingHorizontal: 10 }}
                />
                <BotNavBar />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default SearchScreen;