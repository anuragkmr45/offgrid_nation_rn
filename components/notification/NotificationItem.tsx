import { theme } from '@/constants/theme';
import { timeAgo } from '@/utils/timeAgo'; // your utility function
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export const NotificationItem = ({ entity }: { entity: any }) => {
  const { message, profilePicture, createdAt } = entity

  return (
    <View style={styles.item}>
      <Image
        source={
          profilePicture && profilePicture.length > 0
            ? { uri: profilePicture }
            : {uri: ''}
        }
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.time}>{timeAgo(createdAt)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  message: {
    color: theme.colors.background,
    fontSize: 15,
    fontWeight: '500',
  },
  time: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
})
