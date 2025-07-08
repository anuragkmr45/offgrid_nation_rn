// screens/HelpCenterScreen.tsx

import { Button } from '@/components/common'
import Header from '@/components/common/Header'
import SelectDropdown, { OptionType } from '@/components/common/SelectDropdown'
import { theme } from '@/constants/theme'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import {
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const HELP_OPTIONS: OptionType[] = [
    // Social Feed & Interactions
    { label: 'Feed not loading or refreshing', value: 'feed_issue' },
    { label: 'Can’t like, comment or share a post', value: 'interaction_bug' },
    { label: 'Media (images/videos) won’t display', value: 'media_bug' },

    // Chat & Messaging
    { label: 'Unable to send or receive messages', value: 'chat_send_receive' },
    { label: 'Attachments fail to upload/download', value: 'chat_attachments' },
    { label: 'Chat notifications not appearing', value: 'chat_notifications' },

    // Premium Feed & Payments
    { label: 'Subscription activation or renewal failed', value: 'payment_subscription' },
    { label: 'Payment method declined or not accepted', value: 'payment_declined' },
    { label: 'Unable to access premium content', value: 'premium_access' },

    // Marketplace
    { label: 'Product listings missing or incorrect', value: 'marketplace_listings' },
    { label: 'Checkout or order placement error', value: 'order_error' },
    { label: 'Order tracking/status not updating', value: 'order_tracking' },

    // Account & Profile
    { label: 'Login, registration or password reset issues', value: 'account_auth' },
    { label: 'Avatar, username or profile details won’t update', value: 'profile_update' },

    // Other
    { label: 'Other', value: 'other' },
]

const HelpCenterScreen: React.FC = () => {
    const router = useRouter()

    const [selectedValues, setSelectedValues] = useState<string[]>([])
    const [otherTitle, setOtherTitle] = useState('')
    const [description, setDescription] = useState('')
    const isOther = useMemo(
        () => selectedValues.includes('other'),
        [selectedValues]
    )

    // only enable submit if they've chosen ≥1 category, written a desc,
    // and—if “Other” is chosen—filled out the extra title field:
    const canSubmit = useMemo(() => {
        if (selectedValues.length === 0) return false
        if (!description.trim()) return false
        if (isOther && !otherTitle.trim()) return false
        return true
    }, [selectedValues, description, otherTitle, isOther])

    const handleSubmit = () => {
        Keyboard.dismiss()
        // build your payload
        const payload = {
            categories: selectedValues,
            title: isOther ? otherTitle.trim() : undefined,
            description: description.trim(),
        }
        // TODO: call your API with payload + auth token
        console.log('Submitting help ticket:', payload)
    }

    return (
        <SafeAreaView>
            <Header onBack={() => { router.back() }} title='Help Center' showShadow />
            <View style={styles.container}>
                <Text style={styles.label}>What problem are you facing?</Text>
                <SelectDropdown
                    options={HELP_OPTIONS}
                    selectedValues={selectedValues}
                    onChange={setSelectedValues}
                    placeholder="Select one or more…"
                    multiple
                    searchable
                />

                {isOther && (
                    <>
                        <Text style={styles.label}>Describe your issue in a few words</Text>
                        <TextInput
                            value={otherTitle}
                            onChangeText={setOtherTitle}
                            placeholder="Issue title (e.g. “Syncing failed on iOS”)"
                            style={[styles.input, styles.otherInput]}
                        />
                    </>
                )}

                <Text style={styles.label}>Details (steps to reproduce, errors…)</Text>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Type here…"
                    multiline
                    style={[styles.input, styles.textArea]}
                    textAlignVertical="top"
                />

                <Button
                    text="Submit"
                    onPress={handleSubmit}
                    disabled={!canSubmit}
                    style={styles.submitButton}
                    debounce
                    textColor={theme.colors.background}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: theme.colors.background,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        marginTop: 12,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.textSecondary,
        borderRadius: 8,
        padding: 12,
        backgroundColor: theme.colors.background,
        fontSize: 14,
        color: theme.colors.textPrimary,
    },
    otherInput: {
        marginBottom: 12,
    },
    textArea: {
        height: 120,
        marginBottom: 24,
    },
    submitButton: {
        marginTop: 'auto',
    },
})

export default HelpCenterScreen
