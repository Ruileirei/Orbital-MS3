import { stallImages } from "@/Components/stallImages";
import StallStyle from "@/Components/StallPageStyle";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { Dimensions, Image, Text, View } from "react-native";
import Carousel from 'react-native-reanimated-carousel';

const {width: screenWidth} = Dimensions.get('window');

const StallInfo = () => {
    const {id, title, cuisine, rating} = useLocalSearchParams();
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const stallIdParams = Array.isArray(params.id) ? params.id[0] : params.id;

    useLayoutEffect(() => {
        if (title) {
            navigation.setOptions({title: title.toString()});
        }
    
    }, [title]);

    const images = stallImages[stallIdParams] ?? ["https://img.freepik.com/free-vector/vector-illustration-design-fast-food-restaurant-menu-cafe-with-hand-drawn-graphics_1441-260.jpg"];

    const renderCarouselItem = ({item}: {item: string}) => (
        <Image
            source={{uri: item}}
            style={StallStyle.carouselImage}
            resizeMode="cover"
        />
    );

    return (
        <View style={StallStyle.container}>
            <Text style={StallStyle.title}>{title}</Text>
            <Text style={StallStyle.subtitle}> Cuisine: {cuisine}</Text>
            <Text style={StallStyle.subtitle}> Rating: ⭐ {rating}</Text>

            <Text style={StallStyle.sectionTitle}>Photos</Text>
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
                loop
                autoPlay={false}
                snapEnabled={true}
            />
        </View>
    );
};

export default StallInfo;