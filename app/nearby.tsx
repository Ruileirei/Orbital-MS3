import BotNavBar from '@/Components/navigationBar';
import StallItem from '@/Components/StallItem';
import { geoQuery } from '@/utils/geoQuery';
import { getUserLocation } from '@/utils/getUserLocation';
import { getOpenStatus } from '@/utils/isOpenStatus';
import { Icon } from '@rneui/themed';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SearchStyle from "../Components/SearchStyle";

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
    distanceToUser?: number;
}

const NearbyScreen = () => {
    const router = useRouter();
    const [data, setData] = useState<Stall[]>([]);
    const [stallsCache, setStallsCache] = useState<Stall[]>([]);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [currPage, setCurrPage] = useState(1);

    const pageSize = 10;
    const params = useLocalSearchParams();
    const cuisineParams = typeof params.cuisine === 'string' ? params.cuisine : "";
    const selectedCuisine = cuisineParams ? cuisineParams.split(",") : [];
    const hideClosed = params.hideClosed === 'true';
    const sortByParam = typeof params.sortBy === 'string' ? params.sortBy : 'None';

    useEffect(() => {
        async function fetchLocation() {
            try {
                const location = await getUserLocation();
                if (location && location.latitude !== undefined && location.longitude !== undefined) {
                    setUserLocation({
                        latitude: location.latitude,
                        longitude: location.longitude,
                    });
                }
            } catch (error) {
                console.error("Error getting user location:", error);
            }
        }
        fetchLocation();
    }, []);

    useEffect(() => {
        const filtered = getFilteredStalls();
        const startPage = (currPage - 1) * pageSize;
        const paginated = filtered.slice(startPage, startPage + pageSize);
        setData(paginated);
    }, [selectedCuisine.join(","), hideClosed, sortByParam, stallsCache, currPage]);

    useEffect(() => {
    async function fetchNearbyStalls() {
            if (!userLocation) return;
            try {
                const nearbyStalls = await geoQuery(userLocation.latitude, userLocation.longitude, 3000);
                setStallsCache(nearbyStalls);
                setCurrPage(1);
            } catch (error) {
                console.error("Error fetching nearby stalls");
            }
        }
        fetchNearbyStalls();
    }, [userLocation]);

    const getFilteredStalls = () => {
        let filtered = stallsCache;

        if (selectedCuisine.length > 0) {
            filtered = filtered.filter(item =>
                selectedCuisine.includes(item.cuisine)
            );
        }

        if (hideClosed) {
            filtered = filtered.filter(item =>
                getOpenStatus(item.openingHours ?? {}) === 'OPEN'
            );
        }

        if (userLocation) {
            filtered = filtered
                .filter(item => item.distanceToUser !== undefined && !isNaN(item.distanceToUser!))
                .sort((a, b) => (a.distanceToUser! - b.distanceToUser!));
        }

        return filtered;
    };

    useEffect(() => {
        const filtered = getFilteredStalls();
        const startPage = (currPage - 1) * pageSize;
        const paginated = filtered.slice(startPage, startPage + pageSize);

        setData(paginated);
    }, [selectedCuisine.join(","), stallsCache, hideClosed, userLocation, currPage]);

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
        router.push(`/filterNearby?cuisine=${encodeURIComponent(selectedCuisine.join(","))}${hideClosedParam}${sortByQueryParam}`);
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
            if (i >= 1 && i <= totalPages) {
                pageNumbers.push(i);
            }
        }

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                <TouchableOpacity
                    onPress={() => setCurrPage(prev => Math.max(prev - 1, 1))}
                    disabled={currPage === 1}
                    style={{ marginHorizontal: 5 }}>
                    <Text style={{ color: currPage === 1 ? 'gray' : 'black' }}>Prev</Text>
                </TouchableOpacity>

                {pageNumbers.map((page) => (
                    <TouchableOpacity
                        key={`page-${page}`}
                        onPress={() => setCurrPage(page)}
                        style={{ marginHorizontal: 5 }}>
                        <Text style={{ color: page === currPage ? 'blue' : 'black' }}>{page}</Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity
                    onPress={() => setCurrPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currPage === totalPages}
                    style={{ marginHorizontal: 5 }}>
                    <Text style={{ color: currPage === totalPages ? 'gray' : 'black' }}>Next</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
                <View style={{ flex: 1 }}>
                    <View style={[SearchStyle.searchContainer, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Explore Nearby</Text>
                        <TouchableOpacity onPress={handleFilter}>
                        <Icon name='filter-list' type='material' size={28} color='white' />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                        <StallItem item={item} onPress={() => navigateStall(item)} />
                        )}
                        contentContainerStyle={{ paddingBottom: 10, paddingHorizontal: 10 }}
                        ListEmptyComponent={() => (
                        <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>No nearby stalls found.</Text>
                        )}
                        ListFooterComponent={totalPages > 1 ? <PaginationControls /> : null}
                        bounces={false}
                    />
                    <BotNavBar />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default NearbyScreen;