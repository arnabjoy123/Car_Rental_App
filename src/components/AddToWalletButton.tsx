import { Linking, TouchableOpacity, Text } from 'react-native';

export const AddToWalletButton = ({ saveUrl }) => {
  const handleAddToWallet = async () => {
    try {
      const supported = await Linking.canOpenURL(saveUrl);
      if (supported) {
        await Linking.openURL(saveUrl);
      } else {
        console.log("Can't open URL:", saveUrl);
      }
    } catch (err) {
      console.error("Error opening wallet link", err);
    }
  };

  return (
    <TouchableOpacity onPress={handleAddToWallet} style={{ backgroundColor: '#4285F4', padding: 10, borderRadius: 6 }}>
      <Text style={{ color: '#fff', textAlign: 'center' }}>Add to Google Wallet</Text>
    </TouchableOpacity>
  );
};
