import mainStyle from '@/src/styles/mainStyle';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const categories = [
  { label: "Halal", value: 'halal', icon: "food-halal" },
  { label: "Barbeque", value: 'barbeque', icon: "grill-outline" },
  { label: "Chicken Rice", value: 'chicken_rice', icon: "rice" },
  { label: "Noodles", value: 'noodles', icon: "noodles" },
  { label: "Editor's Picks", value: 'personal_Picks', icon: 'food' },
  { label: "Vegetarian", value: 'vegetarian', icon: 'food-drumstick-off' },
];

export default function CategoryList() {
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>Browse by Category</Text>
      <View style={mainStyle.categoryContainer}>
        {categories.map((cat, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() =>
              router.push({
                pathname: "./group/[id]",
                params: { id: cat.value },
              })
            }
            style={mainStyle.categoryButton}
          >
            <MaterialCommunityIcons name={cat.icon as any} size={24} color={"#fff"} />
            <Text style={{ marginTop: 6, fontSize: 13, fontWeight: '500', color: '#fff' }}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

