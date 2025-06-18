// store/persistConfig.ts
import AsyncStorage from '@react-native-async-storage/async-storage'

export default {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // persist only auth slice
}
