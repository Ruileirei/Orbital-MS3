import { auth, db } from '@/firebase/firebaseConfig';
import { pickImage, uploadToCloudinary } from '@/src/utils/cloudinary';
import { useRouter } from 'expo-router';
import { updateEmail, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditProfile = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    const [pfp, setPfp] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserPfp = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
            const userRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setPfp(data.pfp || null);
            }
            } catch (error) {
            console.error('Failed to fetch profile picture:', error);
            }
        };

        fetchUserPfp();
    }, []);


    const handleSave = async () => {
        const user = auth.currentUser;
        if (!user) return;
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { username: name });

            if (email.trim() !== '' && email !== user.email) {
                await updateEmail(user, email.trim());
                await updateDoc(userRef, {email: email.trim()});
            }

            if (password.trim() !== '') {
                await updatePassword(user, password.trim());
            }
            Alert.alert('Success', 'Name updated successfully');
            router.back();
        } catch (error) {
            console.error('Update failed:', error);
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const handleChangeProfilePicture = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const localUri = await pickImage();
            if (!localUri) return;
            const uploadedUrl = await uploadToCloudinary(localUri);
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { pfp: uploadedUrl });
            setPfp(uploadedUrl);

            Alert.alert('Success', 'Profile picture updated!');
        } catch (error) {
            console.error('Error updating profile picture:', error);
            Alert.alert('Error', 'Failed to update profile picture');
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', marginBottom: 20, marginTop: 20 }}>
                <Image
                    source={{
                    uri: pfp || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
                    }}
                    style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    resizeMode: 'cover',
                    backgroundColor: '#eee',
                    }}
                />
                <TouchableOpacity
                    onPress={handleChangeProfilePicture}
                    style={{
                    marginTop: 10,
                    backgroundColor: '#ffb933',
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    }}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Change Profile Picture</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                placeholder="Enter new name"
                value={name}
                onChangeText={setName}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 20,
                }}
            />
            <TextInput
                placeholder="Enter new email"
                value={email}
                onChangeText={setemail}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 20,
                }}
            />
            <TextInput
                placeholder="Enter new password"
                value={password}
                onChangeText={setPassword}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 20,
                }}
            />
            <TouchableOpacity
                onPress={handleSave}
                style={{
                    backgroundColor: '#f44336',
                    padding: 14,
                    borderRadius: 8,
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default EditProfile;