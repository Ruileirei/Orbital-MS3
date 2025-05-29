import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type StarRatingProp = {
    rating: number;
    size?: number;
    color?: string;
    showRating?: boolean;
};

const StarRating: React.FC<StarRatingProp> = ({rating, size = 16, color='#f5c518', showRating = true,}) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const icon = 
            i <= Math.floor(rating)
                 ? 'star'
                 : rating >= i - 0.5
                   ? 'star-half-full'
                   : 'star-o';
        stars.push(
            <FontAwesome key={i} name={icon} size={size} color={color} style={styles.star}/>
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.starRow}>{stars}</View>
            {showRating && (
                <Text style={[styles.ratingText, { fontSize: size * 0.9 }]}>
                    {rating.toFixed(1)}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    starRow: {
        flexDirection: 'row'
    },
    star: {
        marginHorizontal: 1,
        marginTop: 3,
    },
    ratingText: {
        
        marginLeft: 6,
        color: "#333",
        fontWeight: '500'
    }
});

export default StarRating;