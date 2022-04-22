import React from 'react'
import FlexSpacer from 'components/FlexSpacer'
import AvaButton from 'components/AvaButton'
import AvaText from 'components/AvaText'
import { Space } from 'components/Space'
import { Linking, View } from 'react-native'
import AppNavigation from 'navigation/AppNavigation'
import { Row } from 'components/Row'
import CheckmarkSVG from 'components/svg/CheckmarkSVG'
import { useApplicationContext } from 'contexts/ApplicationContext'
import { usePosthogContext } from 'contexts/PosthogContext'

type Props = {
  nextScreen:
    | typeof AppNavigation.Onboard.CreateWalletStack
    | typeof AppNavigation.Onboard.EnterWithMnemonicStack
  onNextScreen: (
    screen:
      | typeof AppNavigation.Onboard.CreateWalletStack
      | typeof AppNavigation.Onboard.EnterWithMnemonicStack
  ) => void
}

const AnalyticsConsent = ({ onNextScreen, nextScreen }: Props) => {
  const { theme, repo } = useApplicationContext()
  const { capture } = usePosthogContext()

  function openPrivacyPolicy() {
    Linking.openURL('https://wallet.avax.network/legal').catch(() => undefined)
  }

  function acceptAnalytics() {
    capture('OnboardingAnalyticsAccepted').catch(() => undefined)
    repo.userSettingsRepo.setSetting('CoreAnalytics', true)
    onNextScreen(nextScreen)
  }

  function rejectAnalytics() {
    capture('OnboardingAnalyticsRejected').catch(() => undefined)
    repo.userSettingsRepo.setSetting('CoreAnalytics', false)
    onNextScreen(nextScreen)
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 32 }}>
      <AvaText.LargeTitleBold>Help Us Improve</AvaText.LargeTitleBold>
      <Space y={23} />
      <AvaText.Body1>
        Core would like to gather data to understand how users interact with the
        app.
      </AvaText.Body1>
      <Space y={16} />
      <AvaText.Body1>
        {
          'This enables us to develop improvements. To learn more please read our '
        }
        <AvaText.Body1
          textStyle={{ color: theme.colorPrimary1 }}
          onPress={openPrivacyPolicy}>
          Privacy Policy
        </AvaText.Body1>
        . You can always opt out by visiting the settings page.
      </AvaText.Body1>
      <FlexSpacer />
      <AvaText.Heading2 textStyle={{ alignSelf: 'center' }}>
        Core will...
      </AvaText.Heading2>
      <Space y={24} />
      <Row style={{ alignItems: 'center', paddingHorizontal: 8 }}>
        <CheckmarkSVG color={theme.colorSuccess} />
        <Space x={20} />
        <AvaText.Body1 textStyle={{ flex: 1 }}>
          <AvaText.Body1 textStyle={{ fontWeight: 'bold' }}>
            Never{' '}
          </AvaText.Body1>
          collect keys, public addresses, balances, or hashes
        </AvaText.Body1>
      </Row>
      <Space y={24} />
      <Row style={{ alignItems: 'center', paddingHorizontal: 8 }}>
        <CheckmarkSVG color={theme.colorSuccess} />
        <Space x={20} />
        <AvaText.Body1 textStyle={{ flex: 1 }}>
          <AvaText.Body1 textStyle={{ fontWeight: 'bold' }}>
            Never{' '}
          </AvaText.Body1>
          collect full IP addresses
        </AvaText.Body1>
      </Row>
      <Space y={24} />
      <Row style={{ alignItems: 'center', paddingHorizontal: 8 }}>
        <CheckmarkSVG color={theme.colorSuccess} />
        <Space x={20} />
        <AvaText.Body1 textStyle={{ flex: 1 }}>
          <AvaText.Body1 textStyle={{ fontWeight: 'bold' }}>
            Never{' '}
          </AvaText.Body1>
          sell or share data. Ever!
        </AvaText.Body1>
      </Row>
      <FlexSpacer />
      <AvaButton.SecondaryLarge onPress={acceptAnalytics}>
        I Agree
      </AvaButton.SecondaryLarge>
      <Space y={16} />
      <AvaButton.SecondaryLarge onPress={rejectAnalytics}>
        No Thanks
      </AvaButton.SecondaryLarge>
    </View>
  )
}

export default AnalyticsConsent