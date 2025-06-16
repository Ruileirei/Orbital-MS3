import StarRating from '@/Components/starRating';
import { getOpenStatus } from '@/utils/isOpenStatus';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface Stall {
    id: string;
    title: string;
    cuisine: string;
    rating: number;
    openingHours: {
        [key: string]: string[];
    };
    distanceToUser?: number;
    menu?: string[];
}

interface StallItemProps {
    item: Stall;
    onPress?: () => void;
}

const StallItem: React.FC<StallItemProps> = ({ item }) => {
    const router = useRouter();

    const status = getOpenStatus(item.openingHours || {});
    let statusText = '';
    let statusColor = '';

    switch (status) {
        case 'OPEN':
            statusText = 'Open';
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

    const navigateStall = () => {
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

    return (
        <TouchableOpacity onPress={navigateStall} style={{
            flexDirection: 'row',
            padding: 12,
            marginVertical: 6,
            marginHorizontal: 10,
            backgroundColor: '#fff',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#ddd',
            elevation: 1,
            alignItems: 'center',
        }}>
            <Image
                source={{ uri: item.menu?.[0] || "https://png.pngtree.com/png-vector/20221109/ourmid/pngtree-no-image-available-icon-flatvector-illustration-graphic-available-coming-vector-png-image_40958834.jpg" }}
                style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                    {item.title}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Text style={{ fontSize: 13, color: 'gray', marginRight: 6 }}>
                        {item.cuisine}
                    </Text>
                    <StarRating rating={item.rating} size={14} />
                    <Text style={{ marginLeft: 8, fontSize: 13, color: statusColor }}>
                        {statusText}
                    </Text>
                </View>
                {item.distanceToUser !== undefined && (
                    <Text style={{ fontSize: 12, color: 'gray', marginTop: 2 }}>
                        {item.distanceToUser.toFixed(1)} km away
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default StallItem;