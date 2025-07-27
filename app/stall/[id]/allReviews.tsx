import { getAllReviews } from "@/services/stallService";
import StarRating from "@/src/Components/starRating";
import { allReviewsStyles } from "@/src/styles/allReviewsStyle";
import { calculateRatingSpread } from "@/src/utils/ratingSpread";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

type SortOption = 'highest' | 'lowest' | 'newest';

const AllReviewsScreen = () => {
  const router = useRouter();
  const { id: id } = useLocalSearchParams();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const ratingCounts = calculateRatingSpread(reviews);
  const totalReviews = reviews.length;
  const maxBarWidth = 180;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    async function fetchReviews() {
      try {
        const results = await getAllReviews(id.toString());
        setReviews(results);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [id]);

  function renderRatingBar(star: number, count: number) {
    const width = totalReviews ? Math.max(8, (count / totalReviews) * maxBarWidth) : 0;
    return (
      <View key={star} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <Text style={{ width: 20, fontWeight: '600' }}>{star}</Text>
        <Text style={{ color: '#FFD700', fontSize: 15 }}>★</Text>
        <View
          style={{
            backgroundColor: '#FFD700',
            opacity: 0.7,
            height: 14,
            width,
            marginLeft: 8,
            borderRadius: 6,
          }}
        />
        <Text style={{ marginLeft: 12, minWidth: 16 }}>{count}</Text>
      </View>
    );
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortOption) {
      case "highest":
        return (b.rating || 0) - (a.rating || 0);
      case "lowest":
        return (a.rating || 0) - (b.rating || 0);
      case "newest":
      default:
        const timeA = a.time?.seconds || 0;
        const timeB = b.time?.seconds || 0;
        return timeB - timeA;
    }
  });

  const sortOptions: SortOption[] = ["highest", "lowest", "newest"];

  if (!id) {
    return (
      <View style={allReviewsStyles.center}>
        <Text style={allReviewsStyles.errorText}>Invalid Stall ID.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={allReviewsStyles.center}>
        <Text style={{fontSize: 16, color: 'gray', marginBottom: 10}}>Loading Reviews...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (reviews.length === 0) {
    return <Text style={allReviewsStyles.emptyText}>No reviews yet for this stall.</Text>;
  }

  return (
    <View style={allReviewsStyles.container}>
      {totalReviews > 0 && (
        <View style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontWeight: '700',
              marginBottom: 6,
              fontSize: 16,
              textAlign: 'left',
            }}
          >
            Ratings
          </Text>
          {[5, 4, 3, 2, 1].map((star, i) => renderRatingBar(star, ratingCounts[i]))}
        </View>
      )}

       <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 16,
        }}
      >
        {sortOptions.map((option) => {
          const label = option.charAt(0).toUpperCase() + option.slice(1);
          const isSelected = option === sortOption;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => setSortOption(option)}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 16,
                borderRadius: 20,
                backgroundColor: isSelected ? "#FFD700" : "#eee",
              }}
            >
              <Text
                style={{
                  fontWeight: isSelected ? "700" : "400",
                  color: isSelected ? "#333" : "#666",
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <FlatList
        data={sortedReviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={allReviewsStyles.reviewCard}>
            <Text style={allReviewsStyles.userName}>{item.userName}</Text>
            <StarRating rating={item.rating} />
            <Text style={allReviewsStyles.comment}>{item.comment}</Text>
            {item.time?.seconds && (
              <Text style={allReviewsStyles.time}>
                {new Date(item.time.seconds * 1000).toLocaleDateString()}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default AllReviewsScreen;