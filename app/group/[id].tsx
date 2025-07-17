import { db } from "@/firebase/firebaseConfig";
import { Icon } from "@rneui/themed";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const pageSize = 10;

const GroupPage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();

  const [groupName, setGroupName] = useState("");
  const [stallIds, setStallIds] = useState<string[]>([]);
  const [stalls, setStalls] = useState<any[]>([]);
  const [grpLoading, setGrpLoading] = useState(true);
  const [stallLoading, setStallLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagedStalls, setPagedStalls] = useState<any[]>([]);

  useEffect(() => {
    const fetchGroup = async () => {
      if (!id || typeof id !== "string") return;
      setGrpLoading(true);
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
      } finally {
        setGrpLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  useLayoutEffect(() => {
    if (groupName) {
      navigation.setOptions({ title: groupName });
    }
  }, [groupName]);

  useEffect(() => {
    const fetchStalls = async () => {
      setStallLoading(true);
      if (stallIds.length === 0) {
        setStalls([]);
        setStallLoading(false);
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
        setStallLoading(false);
      }
    };
    fetchStalls();
  }, [stallIds]);

  useEffect(() => {
    setCurrentPage(1);
  }, [stalls]);

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    setPagedStalls(stalls.slice(start, start + pageSize));
  }, [stalls, currentPage]);

  const totalPages = Math.max(1, Math.ceil(stalls.length / pageSize));

  const handleStallPress = (stall: any) => {
    router.push({
      pathname: "/stall/[id]/stallIndex",
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

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    const maxButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
        <TouchableOpacity
          onPress={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          style={{ marginHorizontal: 5 }}
        >
          <Text style={{ color: currentPage === 1 ? 'gray' : 'black' }}>Prev</Text>
        </TouchableOpacity>
        {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((page) => (
          <TouchableOpacity
            key={page}
            onPress={() => setCurrentPage(page)}
            style={{ marginHorizontal: 5 }}
          >
            <Text style={{ color: page === currentPage ? 'blue' : 'black' }}>{page}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{ marginHorizontal: 5 }}
        >
          <Text style={{ color: currentPage === totalPages ? 'gray' : 'black' }}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={['left', 'right', 'bottom']}>
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
      {grpLoading || stallLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ marginTop: 12, color: 'gray' }}>Loading group stalls...</Text>
          <ActivityIndicator size="large" color="#ffb933" />
        </View>
      ) : stalls.length === 0 ? (
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ color: "gray" }}>No stalls found for this group.</Text>
        </View>
      ) : (
        <FlatList
          data={pagedStalls}
          keyExtractor={(item) => item.id}
          renderItem={renderStall}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: -10, paddingBottom: 10 }}
          ListFooterComponent={<PaginationControls />}
        />
      )}
    </SafeAreaView>
  );
};

export default GroupPage;
