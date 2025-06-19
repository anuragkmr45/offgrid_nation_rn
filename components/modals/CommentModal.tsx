import React from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Modal from 'react-native-modal';

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CommentModal: React.FC<CommentModalProps> = ({ visible, onClose }) => {
  const dummyComments = Array.from({ length: 10 }, (_, i) => `Comment ${i + 1}`);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      propagateSwipe
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.handle} />

        {/* Scrollable Comments */}
        <FlatList
          data={dummyComments}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <Text style={styles.comment}>{item}</Text>}
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
        />

        {/* Comment Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={80}
        >
          <View style={styles.inputBar}>
            <TextInput style={styles.input} placeholder="Add a comment..." />
            <TouchableOpacity style={styles.sendButton}>
              <Text>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  container: {
    height: '50%',
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  handle: {
    height: 5,
    width: 50,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginVertical: 8,
    borderRadius: 3,
  },
  comment: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  inputBar: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    padding: 10,
    borderRadius: 8,
  },
  sendButton: {
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
});
