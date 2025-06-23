// src/components/modals/ShareModal.tsx

import { useSendMessageMutation } from '@/features/chat/api/chatApi';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import { ChatUser } from '../chat/UserCard';
import { UserSearchModal } from '../common/UserSearchModal';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  mediaUrl: string;
  content: string;
  postId: string
}

export const ShareModal: React.FC<ShareModalProps> = ({ visible, onClose, mediaUrl, content, postId }) => {
  const [isChatModalVisible, setChatModalVisible] = useState(false);
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()

  const handleNativeShare = async () => {
    try {
      await Share.share({
        message: `${content}\n\nCheck this out: ${mediaUrl}\n\nKnow more about weather reports: https://www.youtube.com/@weathermanplus/`,
      });
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  const handleCopyToClipboard = async () => {
    const fullMessage = `${content}\n\nCheck this out: ${mediaUrl}\n\nKnow more about weather reports: https://www.youtube.com/@weathermanplus/`;
    await Clipboard.setStringAsync(fullMessage);
    Toast.show({ type: 'success', text1: 'Copied to clipboard' });
    onClose();
  };

  const handleOpenChatModal = () => {
    onClose(); // Close the bottom sheet first
    setTimeout(() => setChatModalVisible(true), 300); // Delay for smooth UX
  };

  const handleCloseChatModal = () => {
    setChatModalVisible(false);
  };

  const handleSelectUser = async (user: ChatUser) => {
    try {
      await sendMessage({
        recipient: user._id,
        actionType: 'post',
        postId,
        conversationId: user.conversationId ?? undefined,
      }).unwrap()

      Toast.show({ type: 'success', text1: 'Shared to chat!' })
    } catch (err) {
      console.error('Error sharing to chat:', err)
      Toast.show({ type: 'error', text1: 'Failed to share' })
    } finally {
      setChatModalVisible(false)
      onClose()
    }
  }


  return (
    <>
      <Modal
        isVisible={visible}
        onBackdropPress={onClose}
        style={styles.modal}
        swipeDirection="down"
        onSwipeComplete={onClose}
      >
        <View style={styles.container}>
          <View style={styles.handle} />
          <TouchableOpacity style={styles.option} onPress={handleOpenChatModal}>
            <Text>Share to Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={handleNativeShare}>
            <Text>Share to Apps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={handleCopyToClipboard}>
            <Text>Copy Link</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <UserSearchModal
        visible={isChatModalVisible}
        onClose={handleCloseChatModal}
        onSelect={handleSelectUser}
        placeholder="Search friends..."
        height="50%"
      />
    </>
  );
};

const styles = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  container: {
    height: '25%',
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  handle: {
    height: 5,
    width: 50,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 12,
    borderRadius: 3,
  },
  option: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
