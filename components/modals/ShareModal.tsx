// src/components/modals/ShareModal.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
      swipeDirection="down"
      onSwipeComplete={onClose}
    >
      <View style={styles.container}>
        <View style={styles.handle} />
        <TouchableOpacity style={styles.option}>
          <Text>Share to Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text>Share to Apps</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text>Copy Link</Text>
        </TouchableOpacity>
      </View>
    </Modal>
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
