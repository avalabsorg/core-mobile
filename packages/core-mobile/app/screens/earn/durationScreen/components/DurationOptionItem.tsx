import React from 'react'
import { useApplicationContext } from 'contexts/ApplicationContext'
import { useEarnCalcEstimatedRewards } from 'hooks/earn/useEarnCalcEstimatedRewards'
import {
  DurationOption,
  StakeDurationTitle,
  getStakeDuration
} from 'services/earn/getStakeEndDate'
import { MilliSeconds, convertToSeconds } from 'types/siUnits'
import { View } from 'react-native'
import { RadioButton } from 'components/RadioButton'
import AvaText from 'components/AvaText'
import { selectIsDeveloperMode } from 'store/settings/advanced'
import { useSelector } from 'react-redux'
import { Avax } from 'types/Avax'
import { useAvaxFormatter } from 'hooks/formatter/useAvaxFormatter'

export const DurationOptionItem = ({
  stakeAmount,
  item,
  onRadioSelect,
  isSelected
}: {
  stakeAmount: Avax
  item: DurationOption
  onRadioSelect: (item: DurationOption) => void
  isSelected: boolean
}) => {
  const avaxFormatter = useAvaxFormatter()
  const { theme } = useApplicationContext()
  const isDeveloperMode = useSelector(selectIsDeveloperMode)

  const stakeDurationUnixMs = getStakeDuration(
    item.stakeDurationFormat,
    item.stakeDurationValue,
    isDeveloperMode
  )
  const stakeDurationUnixSec = convertToSeconds(
    BigInt(stakeDurationUnixMs) as MilliSeconds
  )
  const { data } = useEarnCalcEstimatedRewards({
    amount: stakeAmount,
    duration: stakeDurationUnixSec,
    delegationFee: 2
  })

  const [estimatedRewardsInAvax] = avaxFormatter(
    data?.estimatedTokenReward,
    true
  )

  return (
    <View style={{ marginBottom: 24 }} key={item.title}>
      <RadioButton onPress={() => onRadioSelect(item)} selected={isSelected}>
        <View style={{ marginLeft: 10 }}>
          <AvaText.Body2 textStyle={{ color: theme.colorText1 }}>
            {item.title}
          </AvaText.Body2>
          <AvaText.Caption textStyle={{ color: theme.colorText2 }}>
            {item.title !== StakeDurationTitle.CUSTOM
              ? `Estimated Rewards: ${estimatedRewardsInAvax} AVAX`
              : 'Enter your desired end date'}
          </AvaText.Caption>
        </View>
      </RadioButton>
    </View>
  )
}
