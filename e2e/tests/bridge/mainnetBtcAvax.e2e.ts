/* eslint-disable jest/expect-expect */
/* eslint-env detox/detox, jest */
/**
 * @jest-environment ./environment.ts
 */
import Assert from '../../helpers/assertions'
import Actions from '../../helpers/actions'
import LoginRecoverWallet from '../../helpers/loginRecoverWallet'
import BottomTabsPage from '../../pages/bottomTabs.page'
import BridgeTabPage from '../../pages/bridgeTab.page'
import { warmup } from '../../helpers/warmup'

describe('Bridge transfer BTC -> AVAX', () => {
  beforeAll(async () => {
    await warmup()
    await LoginRecoverWallet.recoverWalletLogin()
  })

  it('Should verify Transaction Status Items', async () => {
    await BottomTabsPage.tapBridgeTab()
    await BridgeTabPage.tapNetworkDropdown()
    await BridgeTabPage.tapBitcoinNetwork()
    await BridgeTabPage.inputTokenAmmountBtcAvax()
    await Assert.isNotVisible(BridgeTabPage.amountToLowBtcAvaxMessage)
    await BridgeTabPage.tapTransferButton()

    await Assert.isVisibleNoSync(BridgeTabPage.avalancheNetwork)
    await Assert.isVisibleNoSync(BridgeTabPage.bitcoinNetwork)
    await Assert.isVisibleNoSync(BridgeTabPage.sendingAmmount)
    await Assert.isVisibleNoSync(BridgeTabPage.fromText)
    await Assert.isVisibleNoSync(BridgeTabPage.networkFee)
    await Assert.isVisibleNoSync(BridgeTabPage.confirmations)
    await Assert.isVisibleNoSync(BridgeTabPage.toText)
  }, 5000000)

  it('Should verify transaction succeeded', async () => {
    await Actions.waitForElementNoSync(BridgeTabPage.closebutton, 7200000)
    await Assert.isVisible(BridgeTabPage.completedStatusAvax)
    await Assert.isVisible(BridgeTabPage.completedStatusBtcAvaxMainnet)

    await BridgeTabPage.tapClose()
    await BottomTabsPage.tapActivityTab()
    await Assert.isVisible(BridgeTabPage.btcAvaxBridgeTransaction)
  }, 10000000)
})
