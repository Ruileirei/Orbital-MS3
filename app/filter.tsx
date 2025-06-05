import filterStyle from "@/Components/filterStyle";
import { db } from "@/firebase/firebaseConfig";
import { Button, CheckBox } from "@rneui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const filterScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const cuisineParams = typeof params.cuisine === 'string' ? params.cuisine : '';
    const [cuisineOptions, setCuisineOptions] = useState<string[]>([]);
    const [selectedCuisine, setSelectedCuisines] = useState<string[]>(
        cuisineParams ? cuisineParams.split(',') : []
    );
    const [showCuisine, setShowCuisine] = useState(true);

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

    const applyFilter = () => {
        const query = selectedCuisine.join(",");
        router.push(`/main?cuisine=${encodeURIComponent(query)}`);
    };

    const handleClear = () => {
        setSelectedCuisines([]);
    }

    return (
        <SafeAreaView style={filterStyle.container}>
            <Text style={[filterStyle.text, {textAlign: 'center', alignSelf:'center'}]}>
                Filter
            </Text>
            
            <ScrollView style={{marginBottom: 20}}>
                <Button
                    title={showCuisine ? '▼ By Cuisine' : '▶ By Cuisine'}
                    type="clear"
                    onPress={() => setShowCuisine(!showCuisine)}
                    titleStyle={{fontSize: 16, fontWeight: '600', textAlign: 'left'}}
                    buttonStyle={{alignItems:'flex-start'}}
                    containerStyle={{alignItems: 'flex-start'}}
                />
                {showCuisine && cuisineOptions.map((cuisine) => (
                    <CheckBox
                        key={cuisine}
                        title={cuisine}
                        checked={selectedCuisine.includes(cuisine)}
                        onPress={() => toggleCuisine(cuisine)}
                        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                    />
                ))}
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
                    title={`Apply (${selectedCuisine.length})`}
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
 