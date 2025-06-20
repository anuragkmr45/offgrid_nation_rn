// src/components/modals/ShareModal.tsx

import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import { CustomModal, SearchBar } from '../common';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  mediaUrl: string;
  content: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ visible, onClose, mediaUrl, content }) => {
  const [isChatModalVisible, setChatModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
      <CustomModal visible={isChatModalVisible} title="Share to Chat" onClose={handleCloseChatModal} style={{ height: 260 }}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search friends..."
        />
        {/* TODO: Render filtered chat user list here */}
      </CustomModal>
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
