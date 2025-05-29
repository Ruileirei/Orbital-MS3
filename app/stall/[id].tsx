import StallStyle from "@/Components/StallPageStyle";
import StarRating from "@/Components/starRating";
import { db } from "@/firebase/firebaseConfig";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Text, View } from "react-native";
import Carousel from 'react-native-reanimated-carousel';

const {width: screenWidth} = Dimensions.get('window');

const StallInfo = () => {
    const {id, title, cuisine, rating} = useLocalSearchParams();
    const navigation = useNavigation();

    const [stallData, setStallData] = useState<null | {
        name: string;
        cuisine: string;
        rating: number;
        location?: string;
        menu?: string[];
    }>(null);
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        if (title) {
            navigation.setOptions({title: title.toString()});
        }
    }, [title]);

    useEffect(() => {
        async function fetchStall() {
            if (!id) {
                setLoading(false);
                return;
            }
            try {
                const docRef = doc(db, "stalls", id.toString());
                const docRes = await getDoc(docRef);

                if (docRes.exists()) {
                    setStallData(docRes.data() as any);
                } else {
                    console.warn("No such stall");
                    setStallData(null);
                }
            } catch (error) {
                console.error("Error fetching stall data:", error);
                setStallData(null);
            } finally {
                setLoading(false);
            }
        }
        fetchStall();
    }, [id]);
   

    const images = React.useMemo(() => {
        if (!stallData) return [];

        const menuPics = stallData.menu ?? [];
        return menuPics.length > 0
               ? menuPics
               : ["https://img.freepik.com/free-vector/vector-illustration-design-fast-food-restaurant-menu-cafe-with-hand-drawn-graphics_1441-260.jpg"];
    }, [stallData]);

    const renderCarouselItem = ({item}: {item: string}) => (
        <Image
            source={{uri: item}}
            style={StallStyle.carouselImage}
            resizeMode="contain"
        />
    );
    
    if (loading) {
        return (
            <View style={[StallStyle.container, {justifyContent: "center", alignItems:"center"}]}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    if (!stallData) {
        return (
            <View style={[StallStyle.container, {justifyContent:"center", alignItems:"center"}]}>
                <Text>Stall data not found</Text>
            </View>
        );
    }

    return (
        <View style={StallStyle.container}>
            <Text style={StallStyle.title}>{stallData.name ?? title}</Text>
            <Text style={StallStyle.subtitle}> Cuisine: {stallData.cuisine ?? cuisine}</Text>
            <View style={{flexDirection:'row', alignItems:'center', marginVertical: 4}}>
                <StarRating rating={stallData.rating ?? (rating ? Number(rating) : 0)} size={20}/>
            </View>
            <Text style={StallStyle.subtitle}> Location: {stallData.location ?? "Location not available"}</Text> 
            <Text style={StallStyle.sectionTitle}>Menu</Text>
            <Carousel
                width={screenWidth}
                height={300}
                data={images}
                renderItem={renderCarouselItem}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.95,
                    parallaxScrollingOffset: 57,
                }}
                loop={images.length > 1}
                autoPlay={false}
                snapEnabled={images.length > 1}
            />
        </View>
    );
};

export default StallInfo;