import { Row } from 'components/Row'
import Settings from 'assets/icons/settings.svg'
import { Space } from 'components/Space'
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useSelector } from 'react-redux'
import { Network } from '@avalabs/chains-sdk'
import { useNavigation } from '@react-navigation/native'
import AppNavigation from 'navigation/AppNavigation'
import { WalletScreenProps } from 'navigation/types'
import { VsCurrencyType } from '@avalabs/coingecko-sdk'
import { selectSelectedCurrency } from 'store/settings/currency'
import { calculateGasAndFees, Eip1559Fees, GasAndFees } from 'utils/Utils'
import { useNetworkFee } from 'hooks/useNetworkFee'
import { useNativeTokenPriceForNetwork } from 'hooks/networks/useNativeTokenPriceForNetwork'
import { NetworkTokenUnit } from 'types'
import {
  alpha,
  Text,
  TouchableOpacity,
  useTheme,
  View
} from '@avalabs/k2-mobile'
import { useApplicationContext } from 'contexts/ApplicationContext'
import { NetworkFee } from 'services/networkFee/types'
import { GAS_LIMIT_FOR_XP_CHAIN } from 'consts/fees'
import { isBitcoinNetwork } from 'utils/network/isBitcoinNetwork'
import { isAvmNetwork, isPvmNetwork } from 'utils/network/isAvalancheNetwork'
import { useNetworks } from 'hooks/networks/useNetworks'
import { Tooltip } from './Tooltip'

export enum FeePreset {
  Normal = 'Normal',
  Fast = 'Fast',
  Instant = 'Instant',
  Custom = 'Custom'
}

export enum FeePresetNetworkFeeMap {
  Normal = 'low',
  Fast = 'medium',
  Instant = 'high'
}

type NavigationProp = WalletScreenProps<
  typeof AppNavigation.Modal.EditGasLimit
>['navigation']

const NetworkFeeSelector = ({
  chainId,
  gasLimit,
  onFeesChange,
  maxNetworkFee,
  isGasLimitEditable = true,
  noGasLimitError
}: {
  chainId?: number
  gasLimit: number
  onFeesChange?(fees: Eip1559Fees<NetworkTokenUnit>, feePreset: FeePreset): void
  maxNetworkFee?: NetworkTokenUnit
  isGasLimitEditable?: boolean
  noGasLimitError?: string
}): JSX.Element => {
  const {
    appHook: { currencyFormatter }
  } = useApplicationContext()
  const { activeNetwork, getNetwork } = useNetworks()
  const { navigate } = useNavigation<NavigationProp>()
  const requestedNetwork = getNetwork(chainId)
  const network = chainId ? requestedNetwork : activeNetwork
  const { data: networkFee } = useNetworkFee(network)

  const selectedCurrency = useSelector(selectSelectedCurrency)
  const { nativeTokenPrice } = useNativeTokenPriceForNetwork(
    network,
    selectedCurrency.toLowerCase() as VsCurrencyType
  )

  const isBtcNetwork = network ? isBitcoinNetwork(network) : false
  const isPVM = isPvmNetwork(network)
  const isAVM = isAvmNetwork(network)
  const [selectedPreset, setSelectedPreset] = useState(FeePreset.Normal)
  const [calculatedFees, setCalculatedFees] =
    useState<GasAndFees<NetworkTokenUnit>>()
  const [customFees, setCustomFees] = useState<GasAndFees<NetworkTokenUnit>>()

  const getInitialCustomFees = useCallback(
    (fee: NetworkFee<NetworkTokenUnit>): GasAndFees<NetworkTokenUnit> => {
      return calculateGasAndFees({
        maxFeePerGas: fee.low.maxFeePerGas,
        maxPriorityFeePerGas:
          fee.low.maxPriorityFeePerGas ??
          NetworkTokenUnit.fromNetwork(activeNetwork),
        tokenPrice: nativeTokenPrice,
        gasLimit: isPVM || isAVM ? GAS_LIMIT_FOR_XP_CHAIN : gasLimit
      })
    },
    [activeNetwork, gasLimit, isPVM, isAVM, nativeTokenPrice]
  )

  // customFees init value.
  // NetworkFee is not immediately available hence the useEffect
  useEffect(() => {
    if (networkFee && gasLimit > 0) {
      const initialCustomFees = getInitialCustomFees(networkFee)
      setCustomFees(initialCustomFees)
      setCalculatedFees(initialCustomFees)
      onFeesChange?.(initialCustomFees, FeePreset.Normal)
    }
  }, [gasLimit, getInitialCustomFees, networkFee, onFeesChange])

  function handleSelectedPreset(preset: FeePreset): void {
    setSelectedPreset(preset)
    let newFees
    if (preset === FeePreset.Custom) {
      newFees = customFees
    } else {
      const presetFeeRate = networkFee?.[FeePresetNetworkFeeMap[preset]]
      if (!presetFeeRate) return
      newFees = calculateGasAndFees<NetworkTokenUnit>({
        maxFeePerGas: presetFeeRate.maxFeePerGas,
        maxPriorityFeePerGas:
          presetFeeRate.maxPriorityFeePerGas ??
          NetworkTokenUnit.fromNetwork(activeNetwork),
        tokenPrice: nativeTokenPrice,
        gasLimit
      })
    }
    setCalculatedFees(newFees)
    newFees && onFeesChange?.(newFees, preset)
  }

  function handleSetCustomFees(fees: Eip1559Fees<NetworkTokenUnit>): void {
    setSelectedPreset(FeePreset.Custom)

    const newFees = calculateGasAndFees<NetworkTokenUnit>({
      maxFeePerGas: fees.maxFeePerGas,
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
      tokenPrice: nativeTokenPrice,
      gasLimit: fees.gasLimit
    })
    setCustomFees(newFees)
    setCalculatedFees(newFees)
    onFeesChange?.(newFees, FeePreset.Custom)
  }

  const displayGasValues = useMemo(() => {
    if (!networkFee) return undefined

    const customFee = isBtcNetwork
      ? customFees?.maxFeePerGas.toSubUnit().toString() ??
        networkFee.low.maxFeePerGas.toSubUnit().toString()
      : customFees?.maxFeePerGas.toFeeUnit() ??
        networkFee.low.maxFeePerGas.toFeeUnit().toString()

    return {
      [FeePreset.Normal]: isBtcNetwork
        ? networkFee.low.maxFeePerGas.toSubUnit().toString()
        : networkFee.low.maxFeePerGas.toFeeUnit(),
      [FeePreset.Fast]: isBtcNetwork
        ? networkFee.medium.maxFeePerGas.toSubUnit().toString()
        : networkFee.medium.maxFeePerGas.toFeeUnit(),
      [FeePreset.Instant]: isBtcNetwork
        ? networkFee.high.maxFeePerGas.toSubUnit().toString()
        : networkFee.high.maxFeePerGas.toFeeUnit(),
      [FeePreset.Custom]: customFee
    }
  }, [customFees?.maxFeePerGas, networkFee, isBtcNetwork])

  const goToEditGasLimit = (n?: Network): void => {
    if (networkFee === undefined || n === undefined) return
    navigate(AppNavigation.Modal.EditGasLimit, {
      network: n,
      onSave: handleSetCustomFees,
      lowMaxFeePerGas: networkFee.low.maxFeePerGas,
      maxFeePerGas: customFees?.maxFeePerGas ?? networkFee.low.maxFeePerGas,
      maxPriorityFeePerGas:
        customFees?.maxPriorityFeePerGas ??
        networkFee.low.maxPriorityFeePerGas ??
        NetworkTokenUnit.fromNetwork(activeNetwork),
      gasLimit,
      isGasLimitEditable,
      isBtcNetwork,
      noGasLimitError
    })
  }

  return (
    <>
      <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        {isBtcNetwork || isPVM || isAVM ? (
          <View sx={{ paddingVertical: 12 }}>
            <Text variant="body2" sx={{ color: '$neutral50' }}>
              Network Fee
            </Text>
          </View>
        ) : (
          <Tooltip
            content={
              'Core estimates the maximum gas (maxFeePerGas) a transaction could consume based on network conditions. This transaction will likely consume less gas than estimated.'
            }
            position={'right'}
            style={{ width: 200 }}>
            <Text variant="buttonMedium">Maximum Network Fee</Text>
          </Tooltip>
        )}
        {!isPVM && !isAVM && (
          <TouchableOpacity
            sx={{ marginTop: 8 }}
            onPress={() => goToEditGasLimit(network)}>
            <Settings />
          </TouchableOpacity>
        )}
      </Row>
      <Space y={4} />

      <View
        sx={{
          backgroundColor: '$neutral900',
          padding: 16,
          borderRadius: 8,
          marginBottom: 16
        }}>
        {!networkFee?.isFixedFee && (
          <>
            <Row
              style={{
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
              <FeeSelector
                label={isBtcNetwork ? 'Slow' : FeePreset.Normal}
                selected={selectedPreset === FeePreset.Normal}
                onSelect={() => handleSelectedPreset(FeePreset.Normal)}
                value={displayGasValues?.[FeePreset.Normal]}
              />
              <FeeSelector
                label={isBtcNetwork ? 'Medium' : FeePreset.Fast}
                selected={selectedPreset === FeePreset.Fast}
                onSelect={() => handleSelectedPreset(FeePreset.Fast)}
                value={displayGasValues?.[FeePreset.Fast]}
              />
              <FeeSelector
                label={isBtcNetwork ? 'Fast' : FeePreset.Instant}
                selected={selectedPreset === FeePreset.Instant}
                onSelect={() => handleSelectedPreset(FeePreset.Instant)}
                value={displayGasValues?.[FeePreset.Instant]}
              />
              <FeeSelector
                label={FeePreset.Custom}
                selected={selectedPreset === FeePreset.Custom}
                onSelect={() => {
                  handleSelectedPreset(FeePreset.Custom)
                  goToEditGasLimit(network)
                }}
                value={
                  selectedPreset !== FeePreset.Custom && !customFees
                    ? displayGasValues?.[FeePreset.Normal]
                    : displayGasValues?.[FeePreset.Custom]
                }
              />
            </Row>
            <Space y={20} />
          </>
        )}
        <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="body2" sx={{ color: '$neutral400' }}>
            Fee Amount
          </Text>
          <View sx={{ flexDirection: 'row' }}>
            <Text sx={{ color: '$neutral50' }}>
              {`${calculatedFees?.maxTotalFee.toDisplay() ?? 0} `}
            </Text>
            <Text variant="body1" sx={{ color: '$neutral400' }}>
              {network?.networkToken?.symbol}
            </Text>
          </View>
        </Row>
        <Row style={{ justifyContent: 'flex-end' }}>
          <Text variant="caption" sx={{ color: '$neutral400', lineHeight: 15 }}>
            {currencyFormatter(calculatedFees?.maxTotalFeeInCurrency ?? 0) +
              ' ' +
              selectedCurrency}
          </Text>
        </Row>

        {maxNetworkFee &&
          maxNetworkFee?.gt(0) &&
          calculatedFees?.maxTotalFee.gt(maxNetworkFee) && (
            <Text
              variant="caption"
              sx={{ color: '$dangerMain', lineHeight: 15 }}>
              Insufficient balance to cover gas costs. {'\n'}
              {network?.networkToken?.symbol
                ? `Please add ${network.networkToken.symbol}`
                : ''}
              .
            </Text>
          )}
      </View>
    </>
  )
}

export const FeeSelector: FC<{
  label: string
  value?: string
  selected: boolean
  onSelect: (value: string) => void
}> = ({ label, selected, onSelect, value }) => {
  const {
    theme: { colors }
  } = useTheme()

  const handleSelect = (): void => {
    onSelect(label)
  }

  return (
    <TouchableOpacity
      sx={{
        paddingLeft: 0,
        paddingHorizontal: 0,
        width: 75,
        height: 48,
        borderRadius: 8,
        backgroundColor: selected
          ? colors.$white
          : alpha(colors.$neutral700, 0.5),
        justifyContent: 'center'
      }}
      onPress={handleSelect}>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <ButtonText selected={selected}>{label}</ButtonText>
        <ButtonText selected={selected}>{value}</ButtonText>
      </View>
    </TouchableOpacity>
  )
}

const ButtonText: FC<{ selected: boolean } & PropsWithChildren> = ({
  children,
  selected
}) => {
  return (
    <Text
      variant="buttonSmall"
      numberOfLines={1}
      sx={{
        color: selected ? '$neutral900' : '$neutral50',
        fontSize: selected ? 14 : 12
      }}>
      {children}
    </Text>
  )
}

export default NetworkFeeSelector
