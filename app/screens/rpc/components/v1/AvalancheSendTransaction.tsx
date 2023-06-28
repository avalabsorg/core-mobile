// noinspection JSUnusedLocalSymbols

import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Space } from 'components/Space'
import AvaButton from 'components/AvaButton'
import FlexSpacer from 'components/FlexSpacer'
import { ScrollView } from 'react-native-gesture-handler'
import { WalletScreenProps } from 'navigation/types'
import AppNavigation from 'navigation/AppNavigation'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useDappConnectionV1 } from 'hooks/useDappConnectionV1'
import RpcRequestBottomSheet from 'screens/rpc/components/shared/RpcRequestBottomSheet'
import { useApplicationContext } from 'contexts/ApplicationContext'
import Separator from 'components/Separator'
import AddDelegatorTxView from '../shared/AvalancheSendTransaction/AddDelegatorTxView'
import AddValidatorTxView from '../shared/AvalancheSendTransaction/AddValidatorTxView'
import BaseTxView from '../shared/AvalancheSendTransaction/BaseTxView'
import ImportTxView from '../shared/AvalancheSendTransaction/ImportTxView'
import ExportTxView from '../shared/AvalancheSendTransaction/ExportTxView'
import AddSubnetValidatorTxView from '../shared/AvalancheSendTransaction/AddSubnetValidatorView'
import CreateChainTxView from '../shared/AvalancheSendTransaction/CreateChainView'
import CreateSubnetTxView from '../shared/AvalancheSendTransaction/CreateSubnetView'

type AvalancheSendTransactionScreenProps = WalletScreenProps<
  typeof AppNavigation.Modal.AvalancheSendTransaction
>

const AvalancheSendTransaction = () => {
  const { theme } = useApplicationContext()

  const { goBack } =
    useNavigation<AvalancheSendTransactionScreenProps['navigation']>()
  const { request, data } =
    useRoute<AvalancheSendTransactionScreenProps['route']>().params
  const { onUserApproved: onApprove, onUserRejected: onReject } =
    useDappConnectionV1()

  const hexData = JSON.parse(data.unsignedTxJson).txBytes

  const rejectAndClose = useCallback(() => {
    onReject(request)
    goBack()
  }, [goBack, onReject, request])

  const onHandleApprove = () => {
    onApprove(request, data)
    goBack()
  }

  const [hideActionButtons, sethideActionButtons] = useState(false)
  const toggleActionButtons = (value: boolean) => {
    sethideActionButtons(value)
  }

  const renderApproveRejectButtons = () => {
    return (
      <>
        <FlexSpacer />
        <View style={txStyles.actionContainer}>
          <AvaButton.PrimaryLarge onPress={onHandleApprove}>
            Approve
          </AvaButton.PrimaryLarge>
          <Space y={16} />
          <AvaButton.SecondaryLarge onPress={rejectAndClose}>
            Reject
          </AvaButton.SecondaryLarge>
        </View>
      </>
    )
  }

  function renderSendDetails() {
    switch (data.txData.type) {
      case 'export':
        return (
          <ExportTxView
            tx={data.txData}
            hexData={hexData}
            toggleActionButtons={toggleActionButtons}
          />
        )
      case 'import':
        return (
          <ImportTxView
            tx={data.txData}
            hexData={hexData}
            toggleActionButtons={toggleActionButtons}
          />
        )
      case 'base':
        return <BaseTxView tx={data.txData} />
      case 'add_validator':
        return <AddValidatorTxView tx={data.txData} />
      case 'add_delegator':
        return <AddDelegatorTxView tx={data.txData} />
      case 'add_subnet_validator':
        return <AddSubnetValidatorTxView tx={data.txData} />
      case 'create_chain':
        return <CreateChainTxView tx={data.txData} />
      case 'create_subnet':
        return <CreateSubnetTxView tx={data.txData} />
    }
  }

  return (
    <RpcRequestBottomSheet onClose={rejectAndClose}>
      <ScrollView contentContainerStyle={txStyles.scrollView}>
        <View style={{ flexGrow: 1 }}>{renderSendDetails()}</View>
        <View>
          {data.txData.type === 'base' && (
            <Separator color={theme.neutral800} />
          )}

          {!hideActionButtons && renderApproveRejectButtons()}
        </View>
      </ScrollView>
    </RpcRequestBottomSheet>
  )
}

export const txStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 14
  },
  actionContainer: {
    flex: 0,
    paddingVertical: 40,
    paddingHorizontal: 14
  }
})

export default AvalancheSendTransaction