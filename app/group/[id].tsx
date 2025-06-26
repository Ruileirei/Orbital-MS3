import { db } from "@/firebase/firebaseConfig";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GroupPage = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const navigation = useNavigation();
    const [groupName, setGroupName] = useState("");
    const [stallIds, setStallIds] = useState<string[]>([]);
    const [stalls, setStalls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroup = async () => {
            if (!id || typeof id !== "string") return;
            try {
            const groupRef = doc(db, "stallGroups", id);
            const groupSnap = await getDoc(groupRef);
            if (groupSnap.exists()) {
                const data = groupSnap.data();
                setGroupName(data.name || id);
                setStallIds(data.stalls || []);
            } else {
                console.warn("No such group");
            }
            } catch (error) {
            console.error("Error fetching group:", error);
            }
        };
        fetchGroup();
    }, [id]);

    useLayoutEffect(() => {
        if (groupName) {
            navigation.setOptions({title: groupName});
        }
    }, [groupName]);

    useEffect(() => {
        const fetchStalls = async () => {
            if (stallIds.length === 0) {
                setStalls([]);
                setLoading(false);
                return;
            }
            try {
                const promises = stallIds.map((stallId) => getDoc(doc(db, "stalls", stallId)));
                const stallDocs = await Promise.all(promises);
                const validStalls = stallDocs
                    .filter((doc) => doc.exists())
                    .map((doc) => ({ id: doc.id, ...doc.data() }));

                setStalls(validStalls);
            } catch (err) {
                console.error("Failed to load stalls:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStalls();
    }, [stallIds]);

    const handleStallPress = (stall: any) => {
        router.push({
            pathname: "/stall/[id]",
            params: {
            id: stall.id,
            title: stall.name,
            },
        });
    };

    const renderStall = ({ item }: { item: any }) => (
        <TouchableOpacity
            onPress={() => handleStallPress(item)}
            style={{ flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" }}
        >
            <Image
            source={{ uri: item.menu?.[0] || "https://via.placeholder.com/60" }}
            style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }}
            />
            <View>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.name}</Text>
                <Text style={{ fontSize: 13, color: "gray" }}>{item.cuisine || "No cuisine info"}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff"}}>

            {loading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ marginTop: 12, color: 'gray' }}>Loading group stalls...</Text>
                            <ActivityIndicator size="large" color="#ffb933" />
                        </View>
                       )
                     : stalls.length === 0 ? (
                        <View style={{ paddingHorizontal: 16 }}>
                            <Text style={{ color: "gray" }}>No stalls found for this group.</Text>
                        </View>
                        ) 
                     : (
                        <FlatList
                            data={stalls}
                            keyExtractor={(item) => item.id}
                            renderItem={renderStall}
                            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: -10, paddingBottom: 10 }}
                        />
                        )
            }
        </SafeAreaView>
    );
};

export default GroupPage;