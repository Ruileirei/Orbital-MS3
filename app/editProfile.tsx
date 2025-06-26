import { auth, db } from '@/firebase/firebaseConfig';
import { useRouter } from 'expo-router';
import { updateEmail, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditProfile = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');

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

    return (
        <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, marginTop: -50 }}>Edit Username</Text>

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