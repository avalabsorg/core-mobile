import AvaText from 'components/AvaText'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { Space } from 'components/Space'
import AvaButton from 'components/AvaButton'
import { Row } from 'components/Row'
import TokenAddress from 'components/TokenAddress'
import {
  AddLiquidityDisplayData,
  ApproveTransactionData,
  ContractCall,
  SwapExactTokensForTokenDisplayValues,
  TransactionDisplayValues
} from 'screens/rpc/util/types'
import { useExplainTransactionV1 } from 'screens/rpc/hooks/useExplainTransactionV1'
import { ApproveTransaction } from 'screens/rpc/components/shared/signTransaction/ApproveTransaction'
import { AddLiquidityTransaction } from 'screens/rpc/components/shared/signTransaction/AddLiquidity'
import { GenericTransaction } from 'screens/rpc/components/shared/signTransaction/GenericTransaction'
import { SwapTransaction } from 'screens/rpc/components/shared/signTransaction/SwapTransaction'
import NetworkFeeSelector, { FeePreset } from 'components/NetworkFeeSelector'
import { getHexStringToBytes } from 'utils/getHexStringToBytes'
import { useActiveNetwork } from 'hooks/useActiveNetwork'
import { useApplicationContext } from 'contexts/ApplicationContext'
import EditSpendLimit from 'components/EditSpendLimit'
import CarrotSVG from 'components/svg/CarrotSVG'
import { getExplorerAddressByNetwork } from 'utils/ExplorerUtils'
import useInAppBrowser from 'hooks/useInAppBrowser'
import FlexSpacer from 'components/FlexSpacer'
import { Popable } from 'react-native-popable'
import { showSnackBarCustom } from 'components/Snackbar'
import TransactionToast, {
  TransactionToastType
} from 'components/toast/TransactionToast'
import { PopableContent } from 'components/PopableContent'
import { PopableLabel } from 'components/PopableLabel'
import { BigNumber } from 'ethers'
import { ScrollView } from 'react-native-gesture-handler'
import { TransactionError } from 'services/network/types'
import { WalletScreenProps } from 'navigation/types'
import AppNavigation from 'navigation/AppNavigation'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { selectRequestStatus } from 'store/walletConnect'
import { useDappConnectionV1 } from 'hooks/useDappConnectionV1'
import { hexToBN } from '@avalabs/utils-sdk'
import RpcRequestBottomSheet from '../shared/RpcRequestBottomSheet'

const defaultErrMessage = 'Transaction Failed'

type SignTransactionScreenProps = WalletScreenProps<
  typeof AppNavigation.Modal.SignTransaction
>

const SignTransaction = () => {
  const { goBack } = useNavigation<SignTransactionScreenProps['navigation']>()
  const { request } = useRoute<SignTransactionScreenProps['route']>().params
  const { onUserApproved: onApprove, onUserRejected: onReject } =
    useDappConnectionV1()
  const requestStatus = useSelector(selectRequestStatus(request.payload.id))
  const { openUrl } = useInAppBrowser()
  const theme = useApplicationContext().theme
  const activeNetwork = useActiveNetwork()
  const [txFailedError, setTxFailedError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)
  const [showData, setShowData] = useState(false)
  const [showCustomSpendLimit, setShowCustomSpendLimit] = useState(false)

  const requestResult = requestStatus?.result as string | undefined

  const rejectAndClose = useCallback(() => {
    onReject(request)
    goBack()
  }, [goBack, onReject, request])

  const close = useCallback(() => {
    goBack()
  }, [goBack])

  const onFailedToLoadTransaction = useCallback((error?: string) => {
    const message = defaultErrMessage + (error ? `: ${error}` : '')
    setTxFailedError(message)
  }, [])

  const {
    contractType,
    selectedGasFee,
    setCustomFee,
    setSpendLimit,
    customSpendLimit,
    transaction,
    displayData
  } = useExplainTransactionV1(request, onFailedToLoadTransaction)

  const requestedApprovalLimit = displayData.approveData
    ? hexToBN(displayData.approveData.limit)
    : undefined

  useEffect(() => {
    if (!requestStatus) return

    if (requestStatus.error || requestStatus.result) {
      setSubmitting(false)
    }

    if (!requestStatus.error) {
      return
    }

    // in case the TX was sent to the blockchain but was rejected
    if ((requestStatus.error as TransactionError).transactionHash) {
      setTxFailedError('Transaction Rejected')
    } else {
      // in case we have some error
      setTxFailedError(defaultErrMessage)
    }
  }, [requestStatus])

  useEffect(() => {
    if (txFailedError) {
      showSnackBarCustom({
        component: (
          <TransactionToast
            type={TransactionToastType.ERROR}
            message={txFailedError}
          />
        ),
        duration: 'long'
      })
      rejectAndClose()
    }
  }, [rejectAndClose, request, txFailedError])

  const explorerUrl =
    activeNetwork &&
    requestResult &&
    getExplorerAddressByNetwork(activeNetwork, requestResult)

  const handleGasPriceChange = useCallback(
    (gasPrice: BigNumber, feePreset: FeePreset) => {
      setCustomFee(gasPrice, feePreset, displayData?.gasLimit ?? 0)
    },
    [displayData?.gasLimit, setCustomFee]
  )

  const handleGasLimitChange = useCallback(
    (customGasLimit: number) => {
      setCustomFee(
        displayData?.gasPrice ?? BigNumber.from(0),
        selectedGasFee,
        customGasLimit
      )
    },
    [displayData?.gasPrice, selectedGasFee, setCustomFee]
  )

  const netFeeInfoMessage = (
    <PopableContent
      message={`Gas limit: ${displayData?.gasLimit} \nGas price: ${displayData?.fee} nAVAX`}
    />
  )

  if (showData) {
    return (
      <RpcRequestBottomSheet onClose={rejectAndClose}>
        <View style={{ padding: 16 }}>
          <Row style={{ alignItems: 'center' }}>
            <AvaButton.Base onPress={() => setShowData(false)}>
              <CarrotSVG direction={'left'} size={23} />
            </AvaButton.Base>
            <Space x={14} />
            <AvaText.Heading1>Transaction Data</AvaText.Heading1>
          </Row>
          <Space y={16} />
          <Row style={{ justifyContent: 'space-between' }}>
            <AvaText.Body1>Hex Data:</AvaText.Body1>
            <AvaText.Body1>
              {getHexStringToBytes(displayData?.txParams?.data)} Bytes
            </AvaText.Body1>
          </Row>
          <View style={{ paddingVertical: 14 }}>
            <AvaText.Body1
              textStyle={{
                padding: 16,
                backgroundColor: theme.colorBg3,
                borderRadius: 15
              }}>
              {displayData?.txParams?.data}
            </AvaText.Body1>
          </View>
        </View>
      </RpcRequestBottomSheet>
    )
  }

  if (showCustomSpendLimit) {
    return (
      <RpcRequestBottomSheet onClose={rejectAndClose}>
        <EditSpendLimit
          site={displayData?.site}
          spendLimit={customSpendLimit}
          token={displayData?.tokenToBeApproved}
          onClose={() => setShowCustomSpendLimit(!showCustomSpendLimit)}
          setSpendLimit={setSpendLimit}
          requestedApprovalLimit={requestedApprovalLimit}
        />
      </RpcRequestBottomSheet>
    )
  }

  const onHandleApprove = () => {
    if (transaction) {
      setSubmitting(true)
      setTxFailedError(undefined)
      onApprove(request, { transaction })
    }
  }

  const txTitle = () => {
    switch (contractType) {
      case ContractCall.APPROVE:
        return 'Token Spend Approval'
      case ContractCall.ADD_LIQUIDITY:
      case ContractCall.ADD_LIQUIDITY_AVAX:
        return 'Add Liquidity to pool'
      case ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS:
        return 'Approve Swap'
      default:
        return 'Approve Transaction'
    }
  }

  const renderTransactionInfo = () => {
    return (
      <>
        {(contractType === ContractCall.APPROVE && (
          <ApproveTransaction
            {...(displayData as ApproveTransactionData)}
            onCustomFeeSet={setCustomFee}
            selectedGasFee={selectedGasFee}
            setShowCustomSpendLimit={setShowCustomSpendLimit}
            setShowTxData={setShowData}
            customSpendLimit={customSpendLimit}
          />
        )) ||
          ((contractType === ContractCall.ADD_LIQUIDITY ||
            contractType === ContractCall.ADD_LIQUIDITY_AVAX) && (
            <AddLiquidityTransaction
              {...(displayData as AddLiquidityDisplayData)}
              onCustomFeeSet={setCustomFee}
              selectedGasFee={selectedGasFee}
              setShowTxData={setShowData}
            />
          )) ||
          (contractType === ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS && (
            <SwapTransaction
              {...(displayData as SwapExactTokensForTokenDisplayValues)}
              onCustomFeeSet={setCustomFee}
              selectedGasFee={selectedGasFee}
              setShowTxData={setShowData}
            />
          )) ||
          ((contractType === ContractCall.UNKNOWN ||
            contractType === undefined) && (
            <GenericTransaction
              {...(displayData as TransactionDisplayValues)}
              onCustomFeeSet={setCustomFee}
              selectedGasFee={selectedGasFee}
              setShowTxData={setShowData}
            />
          ))}
      </>
    )
  }

  const renderTransactionResult = (transactionHash: string) => {
    return (
      <>
        <Space y={16} />
        <Row style={{ justifyContent: 'space-between' }}>
          <Popable
            content={netFeeInfoMessage}
            position={'right'}
            style={{ minWidth: 200 }}
            backgroundColor={theme.colorBg3}>
            <PopableLabel
              label="Network Fee"
              textStyle={{ lineHeight: 24, color: theme.white }}
            />
          </Popable>
          <View
            style={{
              alignItems: 'flex-end'
            }}>
            <AvaText.Heading3>{displayData.fee} AVAX</AvaText.Heading3>
            <AvaText.Body3 currency>{displayData.feeInCurrency}</AvaText.Body3>
          </View>
        </Row>
        <Space y={16} />
        <Row style={{ justifyContent: 'space-between' }}>
          <AvaText.Body2 color={theme.colorText1}>
            Transaction hash
          </AvaText.Body2>
          <TokenAddress address={transactionHash} copyIconEnd />
        </Row>
        <Space y={24} />
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 24
          }}>
          <AvaButton.SecondaryLarge
            onPress={() => explorerUrl && openUrl(explorerUrl)}>
            View on Explorer
          </AvaButton.SecondaryLarge>
          <Space y={20} />
          <AvaButton.SecondaryLarge
            style={{ marginBottom: 32 }}
            onPress={close}>
            Close
          </AvaButton.SecondaryLarge>
        </View>
      </>
    )
  }

  const renderApproveRejectButtons = () => {
    return (
      <>
        <FlexSpacer />
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 24
          }}>
          <AvaButton.PrimaryLarge
            onPress={onHandleApprove}
            disabled={submitting || !displayData?.gasPrice}>
            {submitting && <ActivityIndicator />} Approve
          </AvaButton.PrimaryLarge>
          <Space y={20} />
          <AvaButton.SecondaryLarge onPress={rejectAndClose}>
            Reject
          </AvaButton.SecondaryLarge>
        </View>
      </>
    )
  }

  return (
    <RpcRequestBottomSheet onClose={requestResult ? close : rejectAndClose}>
      <ScrollView contentContainerStyle={txStyles.scrollView}>
        <View>
          <AvaText.Heading1>{txTitle()}</AvaText.Heading1>
          <Space y={16} />
          <Row
            style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <AvaText.Body2 color={theme.colorText1}>
              Transaction Details
            </AvaText.Body2>
            <AvaButton.Base onPress={() => setShowData(true)}>
              <Row>
                <CarrotSVG
                  color={theme.colorText1}
                  direction={'left'}
                  size={12}
                />
                <CarrotSVG color={theme.colorText1} size={12} />
              </Row>
            </AvaButton.Base>
          </Row>
          {!displayData?.gasPrice ? (
            <View>
              <ActivityIndicator size={'large'} />
            </View>
          ) : (
            renderTransactionInfo()
          )}
        </View>
        {!requestResult && displayData?.gasPrice && (
          <NetworkFeeSelector
            gasLimit={displayData?.gasLimit ?? 0}
            onGasPriceChange={handleGasPriceChange}
            onGasLimitChange={handleGasLimitChange}
          />
        )}
        {requestResult
          ? renderTransactionResult(requestResult)
          : renderApproveRejectButtons()}
      </ScrollView>
    </RpcRequestBottomSheet>
  )
}

export const txStyles = StyleSheet.create({
  scrollView: {
    paddingTop: 16,
    paddingHorizontal: 14,
    paddingBottom: 70,
    flexGrow: 1
  },
  info: {
    justifyContent: 'space-between',
    marginTop: 8,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16
  },
  balance: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16
  },
  arrow: {
    width: '100%',
    marginStart: 8,
    paddingVertical: 10
  }
})

export default SignTransaction