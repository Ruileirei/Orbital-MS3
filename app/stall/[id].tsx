import StallStyle from "@/Components/StallPageStyle";
import StarRating from "@/Components/starRating";
import { db } from "@/firebase/firebaseConfig";
import { Icon } from "@rneui/themed";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Carousel from 'react-native-reanimated-carousel';
const {width: screenWidth} = Dimensions.get('window');

const StallInfo = () => {
    const {id, title, cuisine, rating} = useLocalSearchParams();
    const navigation= useNavigation();
    const [isImageVisible, setImageVisible] = useState(false);
    const [selectImage, setSelectImage] = useState(0);

    const [stallData, setStallData] = useState<null | {
        name: string;
        cuisine: string;
        rating: number;
        location?: string;
        menu?: string[];
    }>(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    
    const scale = useSharedValue(1);
    const focalX = useSharedValue(0);
    const focalY = useSharedValue(0);

    const pinchHandler = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = e.scale;
            focalX.value = e.focalX;
            focalY.value = e.focalY;
        })
        .onEnd(() => {
            scale.value = withTiming(1);
        });

    const animatedImageStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: focalX.value },
            { translateY: focalY.value },
            { translateX: -screenWidth / 2 },
            { translateY: -screenWidth / 2 },
            { scale: scale.value },
            { translateX: -focalX.value },
            { translateY: -focalY.value },
            { translateX: screenWidth / 2 },
            { translateY: screenWidth / 2 },
        ],
    }));

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
               : ["https://png.pngtree.com/png-vector/20221109/ourmid/pngtree-no-image-available-icon-flatvector-illustration-graphic-available-coming-vector-png-image_40958834.jpg"];
    }, [stallData]);

    const openImageViewer = (index: number) => {
        setSelectImage(index);
        setImageVisible(true);
    };
    const closeImageViewer = () => {
        setImageVisible(false);
    }

    const renderCarouselItem = ({item, index}: {item: string, index: number}) => (
        <TouchableOpacity onPress={() => openImageViewer(index)}>
            <Image
                source={{uri: item}}
                style={StallStyle.carouselImage}
                resizeMode="contain"
            />
        </TouchableOpacity>
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
            <TouchableOpacity onPress={() => setIsSaved(true)} style={StallStyle.saveIcon}>
                <Icon 
                    name={isSaved ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    size={24}
                    color={isSaved ? 'red' : 'gray'}
                />
            </TouchableOpacity>
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
            <Modal visible={isImageVisible} transparent={true} onRequestClose={closeImageViewer}>
                <View style={{flex: 1, backgroundColor: "black"}}>
                    <TouchableOpacity
                        style={{position:"absolute", top: 40, right: 20, zIndex: 1}}
                        onPress={closeImageViewer}
                    >
                        <Text style={{color:'white', fontSize: 18}}>X</Text>
                    </TouchableOpacity>
                    <GestureDetector gesture={pinchHandler}>
                        <Animated.View style={{flex: 1, justifyContent: "center", alignItems:"center"}}>
                            <Animated.Image
                                source = {{uri:images[selectImage]}}
                                style={[
                                    {
                                        width:"100%",
                                        height:"100%",
                                        resizeMode:"contain",
                                    },
                                    animatedImageStyle
                                ]}
                            />
                        </Animated.View>
                    </GestureDetector>
                </View>
            </Modal>

        </View>
        
    );
};

export default StallInfo;