import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { WalletScreenProps } from 'navigation/types'
import AppNavigation from 'navigation/AppNavigation'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AddPermissionlessDelegatorTxView } from 'screens/rpc/components/shared/AvalancheSendTransaction/AddPermissionlessDelegatorTxView'
import { useDappConnectionV2 } from 'hooks/useDappConnectionV2'
import RpcRequestBottomSheet from 'screens/rpc/components/shared/RpcRequestBottomSheet'
import { useApplicationContext } from 'contexts/ApplicationContext'
import Separator from 'components/Separator'
import FeatureBlocked from 'screens/posthog/FeatureBlocked'
import { useSelector } from 'react-redux'
import { selectIsSeedlessSigningBlocked } from 'store/posthog'
import ExportTxView from '../shared/AvalancheSendTransaction/ExportTxView'
import ImportTxView from '../shared/AvalancheSendTransaction/ImportTxView'
import BaseTxView from '../shared/AvalancheSendTransaction/BaseTxView'
import { AddPermissionlessValidatorTxView } from '../shared/AvalancheSendTransaction/AddPermissionlessValidatorTxView'
import AddSubnetValidatorTxView from '../shared/AvalancheSendTransaction/AddSubnetValidatorView'
import CreateChainTxView from '../shared/AvalancheSendTransaction/CreateChainView'
import CreateSubnetTxView from '../shared/AvalancheSendTransaction/CreateSubnetView'
import { RemoveSubnetValidatorTxView } from '../shared/AvalancheSendTransaction/RemoveSubnetValidatorTxView'

type AvalancheSendTransactionV2ScreenProps = WalletScreenProps<
  typeof AppNavigation.Modal.AvalancheSendTransactionV2
>

const AvalancheSendTransactionV2 = (): JSX.Element => {
  const isSeedlessSigningBlocked = useSelector(selectIsSeedlessSigningBlocked)
  const { theme } = useApplicationContext()

  const { goBack } =
    useNavigation<AvalancheSendTransactionV2ScreenProps['navigation']>()
  const { request, data } =
    useRoute<AvalancheSendTransactionV2ScreenProps['route']>().params
  const { onUserApproved: onApprove, onUserRejected: onReject } =
    useDappConnectionV2()

  const hexData = JSON.parse(data.unsignedTxJson).txBytes

  const rejectAndClose = useCallback(() => {
    onReject(request)
    goBack()
  }, [goBack, onReject, request])

  const onHandleApprove = (): void => {
    onApprove(request, data)
    goBack()
  }

  const [hideActionButtons, sethideActionButtons] = useState(false)
  const toggleActionButtons = (value: boolean): void => {
    sethideActionButtons(value)
  }

  function renderSendDetails(): JSX.Element | undefined {
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
      case 'add_subnet_validator':
        return <AddSubnetValidatorTxView tx={data.txData} />
      case 'create_chain':
        return <CreateChainTxView tx={data.txData} />
      case 'create_subnet':
        return <CreateSubnetTxView tx={data.txData} />
      case 'add_permissionless_validator':
        return <AddPermissionlessValidatorTxView tx={data.txData} />
      case 'add_permissionless_delegator':
        return <AddPermissionlessDelegatorTxView tx={data.txData} />
      case 'remove_subnet_validator':
        return <RemoveSubnetValidatorTxView tx={data.txData} />
    }
  }

  return (
    <>
      <RpcRequestBottomSheet
        onClose={rejectAndClose}
        showButtons={!hideActionButtons}
        onApprove={onHandleApprove}
        onReject={rejectAndClose}>
        <ScrollView contentContainerStyle={txStyles.scrollView}>
          <View style={{ flexGrow: 1 }}>{renderSendDetails()}</View>
          <View>
            {data.txData.type === 'base' && (
              <Separator color={theme.neutral800} />
            )}
          </View>
        </ScrollView>
      </RpcRequestBottomSheet>
      {isSeedlessSigningBlocked && (
        <FeatureBlocked
          onOk={goBack}
          message={
            'Signing is currently under maintenance. Service will resume shortly.'
          }
        />
      )}
    </>
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

export default AvalancheSendTransactionV2
