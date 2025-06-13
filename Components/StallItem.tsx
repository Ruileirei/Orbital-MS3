import StarRating from '@/Components/starRating';
import { getOpenStatus } from '@/utils/isOpenStatus';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Stall {
    id: string;
    title: string;
    cuisine: string;
    rating: number;
    openingHours: {
        [key: string]: string[];
    };
    distanceToUser?: number;
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
            backgroundColor: '#fff',
            padding: 16,
            marginVertical: 8,
            marginHorizontal: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#ddd',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        }}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}>
                {item.title}
            </Text>
            <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Text>{item.cuisine} </Text>
                    <StarRating rating={item.rating} size={14} />
                    <Text style={{ marginLeft: 10, color: statusColor }}>
                        {statusText}
                    </Text>
                </View>
                {item.distanceToUser !== undefined && (
                    <Text style={{ fontSize: 12, color: 'gray', alignSelf: 'flex-start' }}>
                        {item.distanceToUser.toFixed(1)} km away
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default StallItem;