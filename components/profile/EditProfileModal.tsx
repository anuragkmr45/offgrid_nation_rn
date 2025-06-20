import { theme } from '@/constants/theme'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { pickFromGallery } from '@/utils/imagePicker'
import React, { useState } from 'react'
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native'
import Toast from 'react-native-toast-message'

interface Props {
    visible: boolean
    onClose: () => void
    initialName: string
    initialBio: string
    initialPicture: string
}

export const EditProfileModal: React.FC<Props> = ({
    visible,
    onClose,
    initialName,
    initialBio,
    initialPicture,
}) => {
    const [fullName, setFullName] = useState(initialName)
    const [bio, setBio] = useState(initialBio)
    const [avatar, setAvatar] = useState(initialPicture)
    const { updateProfile, uploadPicture, refetch } = useProfile()

    const onSave = async () => {
        try {
            if (fullName || bio) {
                await updateProfile({ fullName, bio })
            }
            refetch()
            onClose()
        } catch (err) {
            console.error('Update error:', err)
        }
    }

    const onChangeAvatar = async () => {
        const uri = await pickFromGallery()
        if (!uri) return

        const formData = new FormData()
        formData.append('file', {
            uri,
            name: 'profile.jpg',
            type: 'image/jpeg',
        } as any)


        try {
            await uploadPicture(formData)
            setAvatar(uri)
        } catch (err: any) {
            Toast.show({ type: "error", text1: err?.data?.error || "Fail to Update Profile" })
        }
    }

    return (
        <Modal visible={visible} animationType="slide">
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.heading}>Edit Profile</Text>

                <TouchableOpacity onPress={onChangeAvatar}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                    <Text style={styles.changePhoto}>Change Photo</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                />
                <TextInput
                    style={[styles.input, { height: 80 }]}
                    placeholder="Bio"
                    value={bio}
                    onChangeText={setBio}
                    multiline
                />

                <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </ScrollView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    avatar: {
        width: 100, height: 100, borderRadius: 50,
        marginBottom: 12,
    },
    changePhoto: {
        color: theme.colors.primary,
        marginBottom: 24,
    },
    input: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    saveButton: {
        backgroundColor: theme.colors.primary,
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
        width: '100%',
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelText: {
        marginTop: 16,
        color: 'red',
    },
})
