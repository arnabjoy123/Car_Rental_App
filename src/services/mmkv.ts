import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV(); // optional: { id: 'app-storage', encryptionKey: 'key' }

const MMKVStorage = {
  set: (key, value) => storage.set(key, value),
  get: key => storage.getString(key),
  delete: key => storage.remove(key),
};

export default MMKVStorage;
