import { View, Text } from 'react-native';

export default function DocumentsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Dosyalar</Text>
      <Text className="text-gray-500 mt-2">Doküman listesi burada olacak.</Text>
    </View>
  );
}
