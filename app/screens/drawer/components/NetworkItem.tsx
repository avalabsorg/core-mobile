import React from 'react';
import AvaListItem from 'components/AvaListItem';
import AvaText from 'components/AvaText';
import AppNavigation from 'navigation/AppNavigation';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigatorProps} from 'react-native-screens/lib/typescript/native-stack/types';
import {useNetworkContext} from '@avalabs/wallet-react-components';

const NetworkItem = () => {
  const networkContext = useNetworkContext();
  const navigation = useNavigation<NativeStackNavigatorProps>();
  const selectedNetwork = () => (
    <AvaText.Body2 textStyle={{paddingRight: 12}}>
      {networkContext?.network?.name}
    </AvaText.Body2>
  );

  return (
    <>
      <AvaListItem.Base
        title={<AvaText.Heading3>Network</AvaText.Heading3>}
        titleAlignment={'flex-start'}
        rightComponent={selectedNetwork()}
        showNavigationArrow
        onPress={() => {
          navigation?.navigate(AppNavigation.Wallet.NetworkSelector, {
            currentNetwork: networkContext?.network?.name,
          });
        }}
      />
    </>
  );
};

export default NetworkItem;
