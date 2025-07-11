import { auth } from "@/firebase/firebaseConfig";
import { arrayRemove, arrayUnion, getStallDoc, getUserDoc, updateUserDoc } from "@/services/firestoreService";
import StarRating from "@/src/Components/starRating";
import StallStyle from "@/src/styles/StallPageStyle";
import { formatTime } from "@/src/utils/formatTime";
import { getOpenStatus, OpenStatus } from '@/src/utils/isOpenStatus';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Icon } from "@rneui/themed";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const {width: screenWidth} = Dimensions.get('window');

const StallInfo = () => {
    const router = useRouter();
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
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);

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
            if (isSaved) {
                await updateUserDoc(auth.currentUser.uid, {
                    favourites: arrayRemove(id),
                });
                setIsSaved(false);
                Toast.show({
                    type: 'info',
                    text1: 'Removed from favourites',
                    text2: `${stallData?.name ?? title} was removed!`,
                });
            } else {
                await updateUserDoc(auth.currentUser.uid, {
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
                const docRes = await getStallDoc(id.toString());
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
                const userSnap = await getUserDoc(auth.currentUser.uid);
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

    
    if (loading) {
        return (
            <View style={[StallStyle.container, {justifyContent:"center", alignItems:"center"}]}>
                <Text style={{ marginTop: 12, color: 'gray' }}>Loading stall...</Text>
                <ActivityIndicator size="large" color="#ffb933"/>
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

            <View style={{ position: 'relative' }}>
                <Image
                    source={require('../../assets/images/storeShutter.png')}
                    style={{ width: '101%', height: 110 }}
                    resizeMode="cover"
                />

                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                    position: 'absolute',
                    top: 40,
                    left: 20,
                    backgroundColor: 'rgba(243, 18, 18, 0.4)',
                    padding: 8,
                    borderRadius: 20
                    }}
                    testID="back-button"
                >
                    <Icon name="arrow-left" type="font-awesome" color="white" size={20} />
                </TouchableOpacity>
            </View>


            <View style={{padding: 20}}>
            <TouchableOpacity onPress={handleFavourite} style={StallStyle.saveIcon} testID="favourite-button">
                <Icon 
                    name={isSaved ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    size={24}
                    color={isSaved ? 'red' : 'gray'}
                    testID="heart-icon"
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
            <FlatList
                data={images}
                horizontal
                keyExtractor={(item, index) => `${item}-${index}`}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedImage(item);
                            setModalVisible(true);
                        }}
                        testID="menu-image-button"
                    >
                        <Image
                            source={{uri: item}}
                            style={{
                                width: screenWidth-40,
                                height: 300,
                                borderRadius: 12,
                                marginRight: 20,
                                marginLeft: -16,
                                resizeMode:'cover'
                            }}
                        />
                    </TouchableOpacity>
                )}
                contentContainerStyle={{paddingHorizontal: 20}}
            />
            {selectedImage && (
                <Modal visible={isModalVisible} transparent={true} testID="image-modal">
                    <View style={{
                        flex: 1,
                        backgroundColor: 'gray',
                        opacity: 0.9,
                        justifyContent:'center',
                        alignItems:'center',
                    }}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={{
                                position: 'absolute',
                                top: 40,
                                right: 20,
                                zIndex: 10,
                            }}
                        >
                            <MaterialCommunityIcons name="close" size={20} color='white'/>
                        </TouchableOpacity>
                        <ScrollView
                            contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent:'flex-start',
                                alignItems:'center',
                                paddingTop: 60,
                            }}
                            maximumZoomScale={4}
                            minimumZoomScale={1}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                            centerContent
                        >
                            <Image  
                                source={{uri: selectedImage}}
                                style={{
                                    width: screenWidth * 0.9,
                                    aspectRatio: 3/5,
                                    resizeMode: 'contain',
                                }}
                            />
                        </ScrollView>
                    </View>
                </Modal>
            )}
        </View>
        </View>
    );
};

export default StallInfo;