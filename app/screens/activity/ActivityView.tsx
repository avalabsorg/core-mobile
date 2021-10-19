import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import SearchSVG from 'components/svg/SearchSVG';
import {useNavigation} from '@react-navigation/native';
import AppNavigation from 'navigation/AppNavigation';
import AvaText from 'components/AvaText';
import Loader from 'components/Loader';
import CollapsibleSection from 'components/CollapsibleSection';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useWalletContext} from '@avalabs/wallet-react-components';
import moment from 'moment';
import ActivityListItem from 'screens/activity/ActivityListItem';
import {HistoryItemType} from '@avalabs/avalanche-wallet-sdk/dist/History';
import {History} from '@avalabs/avalanche-wallet-sdk';

const TODAY = moment().format('MM.DD.YY');
const YESTERDAY = moment().subtract(1, 'days').format('MM.DD.YY');
type SectionType = {[x: string]: HistoryItemType[]};

interface Props {
  embedded?: boolean;
}

function ActivityView({embedded}: Props) {
  const wallet = useWalletContext()?.wallet;
  const [sectionData, setSectionData] = useState<SectionType>({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const loadHistory = useCallback(async () => {
    setLoading(true);
    const history = (await wallet?.getHistory(50)) ?? [];
    // We're only going to show EVMT without inputs at this time. Remove filter in the future
    history
      .filter(ik => History.isHistoryEVMTx(ik) && ik.input === undefined)
      .map((it: HistoryItemType) => {
        const date = moment(it.timestamp).format('MM.DD.YY');
        if (date === TODAY) {
          sectionData.Today = [...[it]];
        } else if (date === YESTERDAY) {
          sectionData.Yesterday = [...[it]];
        } else {
          sectionData[date] = [...[it]];
        }
      });
    setSectionData({...sectionData});
    setLoading(false);
  }, [wallet]);

  useEffect(() => {
    loadHistory().catch(reason => console.warn(reason));
  }, []);

  const openDetailBottomSheet = useCallback((item: HistoryItemType) => {
    return navigation.navigate(
      AppNavigation.Modal.TransactionDetailBottomSheet,
      {historyItem: item},
    );
  }, []);

  const renderItems = () => {
    const items = Object.entries(sectionData).map((key, index) => {
      return (
        <CollapsibleSection key={`${index}`} title={key[0]} startExpanded>
          {key[1].map((item: HistoryItemType) => (
            <ActivityListItem
              key={item.id}
              historyItem={item}
              onPress={() => openDetailBottomSheet(item)}
            />
          ))}
        </CollapsibleSection>
      );
    });

    if (items.length > 0) {
      return items;
    }

    // if no items we return zero state
    return (
      // replace with zero states once we have them
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 16,
        }}>
        <AvaText.Heading3 textStyle={{textAlign: 'center'}}>
          As transactions take place, they will show up here.
        </AvaText.Heading3>
      </View>
    );
  };

  function onRefresh() {
    loadHistory();
  }

  /**
   * if view is embedded, meaning it's used in the bottom sheet (currently), then we wrap it
   * with the appropriate scrollview.
   *
   * We also don't show the 'header'
   * @param children
   */
  const ScrollableComponent = ({children}: {children: React.ReactNode}) => {
    const isEmpty = Object.entries(sectionData).length === 0;

    return embedded ? (
      <BottomSheetScrollView
        style={{flex: 1}}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }>
        {children}
      </BottomSheetScrollView>
    ) : (
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={
          isEmpty && {flex: 1, justifyContent: 'center', alignItems: 'center'}
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }>
        {children}
      </ScrollView>
    );
  };

  return (
    <View style={{flex: 1}}>
      {embedded || (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 16,
          }}>
          <AvaText.Heading1>Activity</AvaText.Heading1>
          <SearchSVG />
        </View>
      )}
      {loading ? <Loader /> : <ScrollableComponent children={renderItems()} />}
    </View>
  );
}

export default ActivityView;
