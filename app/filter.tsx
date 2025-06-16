import FilterDropdown from "@/Components/filterDropDown";
import filterStyle from "@/Components/filterStyle";
import { db } from "@/firebase/firebaseConfig";
import { Button } from "@rneui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const filterScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    const cuisineParams = typeof params.cuisine === 'string' ? params.cuisine : '';
    const hideClosedParam = params.hideClosed === 'true';
    const sortByParam = typeof params.sortBy === 'string' ? params.sortBy : 'None';

    const [cuisineOptions, setCuisineOptions] = useState<string[]>([]);
    const [selectedCuisine, setSelectedCuisines] = useState<string[]>(
        cuisineParams ? cuisineParams.split(',') : []
    );
    
    const [hideClosed, setHideClosed] = useState(hideClosedParam);
    const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
    const dietaryOptions = ['Halal', 'Vegetarian'];
    
    const initialSelectedMisc = hideClosedParam ? ['Hide Closed Stalls'] : [];
    const [selectedMisc, setSelectedMisc] = useState<string[]>(initialSelectedMisc);
    const miscOptions = ['Hide Closed Stalls'];
    
    const sortByOptions = ['None', 'High to Low', 'Low to High'];
    const [sortByRating, setSortByRating] = useState<string>(sortByParam);
    const selectedSortBy = [sortByRating];
    
    const toggleSortByRating = (option: string) => {
        setSortByRating(option);
    };

    useEffect(() => {
        async function fetchCuisines() {
            const queryResult = await getDocs(collection(db, 'stalls'));
            const cuisineSet = new Set<string>();
            queryResult.forEach((doc) => {
                const data = doc.data();
                if (data.cuisine) {
                    cuisineSet.add(data.cuisine);
                }
            });
            setCuisineOptions(Array.from(cuisineSet). sort());
        }
        fetchCuisines();
    }, []);

    const toggleCuisine = (cuisine: string) => {
        if (selectedCuisine?.includes(cuisine)) {
            setSelectedCuisines(selectedCuisine.filter(c => c !== cuisine));
        } else {
            setSelectedCuisines([...selectedCuisine, cuisine]);
        }
    };

    const toggleDietary = (option: string) => {
        if (selectedDietary.includes(option)) {
            setSelectedDietary(selectedDietary.filter(o => o !== option));
        } else {
            setSelectedDietary([...selectedDietary, option]);
        }
    };

    const toggleMisc = (option: string) => {
        const newSelectedMisc = selectedMisc.includes(option)
        ? selectedMisc.filter(o => o !== option)
        : [...selectedMisc, option];
        setSelectedMisc(newSelectedMisc);
        if (option === 'Hide Closed Stalls') {
            setHideClosed(!selectedMisc.includes(option));
        }
    };

    const applyFilter = () => {
        const query = selectedCuisine.join(",");
        const hideClosedParam = hideClosed ? '&hideClosed=true' : '';
        const sortByParam = sortByRating !== 'None' ? `&sortBy=${encodeURIComponent(sortByRating)}` : '';
        router.push(`/search?cuisine=${encodeURIComponent(query)}${hideClosedParam}${sortByParam}`);
    };

    const handleClear = () => {
        setSelectedCuisines([]);
        setHideClosed(false);
        setSelectedDietary([]);
        setSortByRating('None');
    }

    return (
        <SafeAreaView style={filterStyle.container}>
            <Text style={[filterStyle.text, {textAlign: 'center', alignSelf:'center'}]}>
                Filter
            </Text>
            
            <ScrollView style={{marginBottom: 20}}>
                <FilterDropdown
                    title="Sort by Rating"
                    options={sortByOptions}
                    selectedOptions={selectedSortBy}
                    onToggleOption={toggleSortByRating}
                    isSingleSelect={true}
                />
                <FilterDropdown
                    title="By Cuisine"
                    options={cuisineOptions}
                    selectedOptions={selectedCuisine}
                    onToggleOption={toggleCuisine}
                />
                <FilterDropdown
                    title="Dietary Requirements"
                    options={dietaryOptions}
                    selectedOptions={selectedDietary}
                    onToggleOption={toggleDietary}
                />

                <FilterDropdown
                    title="Miscellaneous"
                    options={miscOptions}
                    selectedOptions={selectedMisc}
                    onToggleOption={toggleMisc}
                /> 
            </ScrollView>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Button 
                    title = "Clear"
                    onPress={handleClear}
                    type='outline'
                    buttonStyle={{backgroundColor: 'white', borderRadius: 10, borderColor: 'transparent'}}
                    titleStyle={{color: 'black'}}
                    containerStyle={{flex: 1, marginRight: 10}}
                />
                <Button
                    title={`Apply (${selectedCuisine.length + selectedDietary.length + selectedMisc.length})`}
                    onPress={applyFilter}
                    buttonStyle={{backgroundColor:"black", borderRadius: 10}}
                    titleStyle={{color: 'white'}}
                    containerStyle={{flex: 1}}
                />
            </View>
        </SafeAreaView>
    );

};

export default filterScreen;
 