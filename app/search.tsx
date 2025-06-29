import BotNavBar from '@/src/Components/navigationBar';
import SearchStyle from '@/src/Components/SearchStyle';
import StallItem from '@/src/Components/StallItem';
import { useStalls } from '@/src/hooks/useStalls';
import { getOpenStatus } from '@/src/utils/isOpenStatus';
import { Icon } from '@rneui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const pageSize = 10;

interface Stall {
  id: string;
  title: string;
  cuisine: string;
  rating: number;
  openingHours: { [key: string]: string[] };
  latitude: number;
  longitude: number;
}


const SearchScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { stalls: allStalls, loading } = useStalls();

  const [filteredStalls, setFilteredStalls] = useState(allStalls);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');

  const cuisineParams = typeof params.cuisine === 'string' ? params.cuisine : '';
  const selectedCuisine = cuisineParams ? cuisineParams.split(',') : [];
  const hideClosed = params.hideClosed === 'true';
  const sortBy = typeof params.sortBy === 'string' ? params.sortBy : 'None';

  const getFilteredStalls = useMemo(() => {
    let result = allStalls;

    if (selectedCuisine.length) {
      result = result.filter((stall) => selectedCuisine.includes(stall.cuisine));
    }

    if (hideClosed) {
      result = result.filter((stall) => getOpenStatus(stall.openingHours ?? {}) === 'OPEN');
    }

    if (searchValue.trim()) {
      const query = searchValue.trim().toUpperCase();
      result = result.filter((stall) => stall.title.toUpperCase().includes(query));
    }

    if (sortBy === 'High to Low') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'Low to High') {
      result = [...result].sort((a, b) => a.rating - b.rating);
    }

    return result;
  }, [allStalls, selectedCuisine.join(','), hideClosed, sortBy, searchValue]);

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    setFilteredStalls(getFilteredStalls.slice(start, start + pageSize));
  }, [getFilteredStalls, currentPage]);

  const totalPages = Math.ceil(getFilteredStalls.length / pageSize);

  const handleFilter = () => {
    const hideClosedParam = hideClosed ? '&hideClosed=true' : '';
    const sortByParam = sortBy !== 'None' ? `&sortBy=${encodeURIComponent(sortBy)}` : '';
    setCurrentPage(1);
    router.push(`/filter?cuisine=${encodeURIComponent(selectedCuisine.join(','))}${hideClosedParam}${sortByParam}`);
  };

  const navigateStall = (stall: Stall) => {
    router.push({
      pathname: '/stall/[id]',
      params: {
        id: stall.id,
        title: stall.title,
        cuisine: stall.cuisine,
        rating: stall.rating.toString(),
      },
    });
  };

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    const maxButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
        <TouchableOpacity
          onPress={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          style={{ marginHorizontal: 5 }}
        >
          <Text style={{ color: currentPage === 1 ? 'gray' : 'black' }}>Prev</Text>
        </TouchableOpacity>
        {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((page) => (
          <TouchableOpacity
            key={page}
            onPress={() => setCurrentPage(page)}
            style={{ marginHorizontal: 5 }}
          >
            <Text style={{ color: page === currentPage ? 'blue' : 'black' }}>{page}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{ marginHorizontal: 5 }}
        >
          <Text style={{ color: currentPage === totalPages ? 'gray' : 'black' }}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaProvider style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ marginTop: 12, color: 'gray' }}>Loading stalls...</Text>
          <ActivityIndicator size="large" color="#ffb933" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
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
                  setCurrentPage(1);
                }}
                style={{ flex: 1, marginLeft: 10, fontSize: 15 }}
              />
              <TouchableOpacity onPress={handleFilter} style={{ marginLeft: 6 }} testID="filter-button">
                <Icon name="filter-list" type="material" size={24} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={filteredStalls}
            renderItem={({ item }) => <StallItem item={item} onPress={() => navigateStall(item)} />}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>No match found</Text>
            )}
            ListFooterComponent={<PaginationControls />}
            contentContainerStyle={{ paddingBottom: 10, paddingHorizontal: 10 }}
          />
          <BotNavBar />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SearchScreen;
