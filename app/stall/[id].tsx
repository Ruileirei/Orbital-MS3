import StallStyle from "@/Components/StallPageStyle";
import StarRating from "@/Components/starRating";
import { auth, db } from "@/firebase/firebaseConfig";
import { formatTime } from "@/utils/formatTime";
import { getOpenStatus, OpenStatus } from '@/utils/isOpenStatus';
import { Icon } from "@rneui/themed";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import Carousel from 'react-native-reanimated-carousel';
import Toast from "react-native-toast-message";

const {width: screenWidth} = Dimensions.get('window');

const StallInfo = () => {
    const DAY_LABEL_WIDTH = "22%";
    const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDayIndex = new Date().getDay();
    const currentDay = dayOrder[currentDayIndex];
    const {id, title, cuisine, rating} = useLocalSearchParams();
    const navigation= useNavigation();
    type OpeningHours = {
        [key: string]: string | string[];
    };
    const [stallData, setStallData] = useState<null | {
        name: string;
        cuisine: string;
        rating: number;
        location?: string;
        openingHours?: OpeningHours;
        menu?: string[];
    }>(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [isOpenHrDropDown, setOpenHrDropDown] = useState(false);

    const openStatus: OpenStatus = getOpenStatus(stallData?.openingHours ?? {});
    let statusText = '';
    let statusColor = '';
    switch (openStatus) {
        case 'OPEN':
            statusText = 'Open Now';
            statusColor = 'green';
            break;
        case 'CLOSING_SOON':
            statusText = 'Closing Soon';
            statusColor = 'orange';
            break;
        case 'OPENING_SOON':
            statusText = 'Opening Soon';
            statusColor = 'orange';
            break;
        case 'CLOSED':
        default:
            statusText = 'Closed';
            statusColor = 'red';
            break;
    }

    const handleFavourite = async () => {
        if (!auth.currentUser) {
            console.log("User is not logged in");
            return;
        }
        try {
            const userRef = doc(db, 'users', auth.currentUser.uid);

            if (isSaved) {
                await updateDoc(userRef, {
                    favourites: arrayRemove(id),
                });
                setIsSaved(false);
                Toast.show({
                    type: 'success',
                    text1: 'Removed from favourites',
                    text2: `${stallData?.name ?? title} was removed.`,
                });
            } else {
                await updateDoc(userRef, {
                    favourites: arrayUnion(id),
                });
                setIsSaved(true);
                Toast.show({
                    type: 'success',
                    text1: 'Added from favourites',
                    text2: `${stallData?.name ?? title} was added!`,
                });
            }
        } catch (error) {
            console.error("Error updating favourites: ", error);
        }
    };

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

    useEffect(() => {
        async function checkIfFavourite() {
            if (!auth.currentUser || !id) return;

            try {
                const userRef = doc(db, 'users', auth.currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const favourites = userData.favourites || [];
                    setIsSaved(favourites.includes(id));
                }
            } catch (error) {
                console.error("Error checking favourites:", error);
            }
        }
        checkIfFavourite();
    }, [id]);

    const images = React.useMemo(() => {
        if (!stallData) return [];

        const menuPics = stallData.menu ?? [];
        return menuPics.length > 0
               ? menuPics
               : ["https://png.pngtree.com/png-vector/20221109/ourmid/pngtree-no-image-available-icon-flatvector-illustration-graphic-available-coming-vector-png-image_40958834.jpg"];
    }, [stallData]);

    const renderCarouselItem = ({item, index}: {item: string, index: number}) => (
        <View>
            <Image
                source={{uri: item}}
                style={StallStyle.carouselImage}
                resizeMode="contain"
            />
        </View>
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
            <TouchableOpacity onPress={handleFavourite} style={StallStyle.saveIcon}>
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
            <View style={{flexDirection: 'row', alignItems:'center', marginBottom: 8}}>
                <Icon
                    name="location-on"
                    type="material"
                    size={20}
                    color='gray'
                    style={{marginRight: 8}}
                 />
                <Text style={StallStyle.subtitle}>
                    <Text style={{fontWeight: 'bold'}}>Location: </Text>
                    {stallData.location ?? "Location not available"}
                </Text> 
            </View>
            
            <TouchableOpacity
                onPress={() => setOpenHrDropDown(prev => !prev)}
                style={{flexDirection: 'row', alignItems:'center', marginVertical:8}}
            >
                <Icon
                    name="access-time"
                    type="material"
                    size={20}
                    color={statusColor}
                    style={{marginRight: 8}}
                />
                <Text style={{fontSize: 16, fontWeight:'600', color: statusColor}}>
                    {statusText}
                </Text>
            </TouchableOpacity>

            {isOpenHrDropDown && stallData.openingHours && (
                <View style={{paddingLeft: 28, marginBottom: 8}}>
                    {dayOrder.map((day) => {
                        const value = stallData.openingHours?.[day];
                        return (
                            <View key={day} style={{marginBottom: 4}}>
                                {typeof value === 'string' ? (
                                    <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontWeight: day === currentDay ? 'bold' : 'normal',
                                                width: DAY_LABEL_WIDTH,
                                            }}
                                        >
                        {day.charAt(0).toUpperCase() + day.slice(1)}:
                                        </Text>
                                        <Text style={{fontSize: 14}}>
                                            {value}
                                        </Text>
                                    </View>
                                ) : (
                                    <>
                                        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: day === currentDay ? 'bold' : 'normal',
                                                    width: DAY_LABEL_WIDTH,
                                                }}
                                            >
                                                {day.charAt(0).toUpperCase() + day.slice(1)}:
                                            </Text>
                                            <Text style={{fontSize: 14}}>
                                                {value && value.length > 0 ? formatTime(value[0]) : ""}
                                            </Text>
                                        </View>
                                        {value?.slice(1).map((slot, index) => (
                                            <View key={index} style={{flexDirection: 'row'}}>
                                                <View style={{width: DAY_LABEL_WIDTH}} />
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    {formatTime(slot)}
                                                </Text>
                                            </View>
                                        ))}
                                    </>
                                )}
                            </View>
                        );
                    })}
                </View>
            )}

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