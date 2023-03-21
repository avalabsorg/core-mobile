/* eslint-disable jest/expect-expect */
import BottomTabsPage from '../../pages/bottomTabs.page'
import Assert from '../../helpers/assertions'
import ActivityTabPage from '../../pages/activityTab.page'
import LoginRecoverWallet from '../../helpers/loginRecoverWallet'
import TransactionDetailsPage from '../../pages/transactionDetails.page'
import { warmup } from '../../helpers/warmup'

describe('Activity Tab', () => {
  beforeAll(async () => {
    await warmup()
    await LoginRecoverWallet.recoverWalletLogin()
  })

  it('should show contract call only in activity list', async () => {
    await BottomTabsPage.tapActivityTab()
    await Assert.isVisible(ActivityTabPage.activityListHeader)
    await ActivityTabPage.tapFilterDropdown()
    await ActivityTabPage.tapContractCallFilterOption()
    await Assert.isNotVisible(ActivityTabPage.bridgeSVG)
    await Assert.isVisible(ActivityTabPage.arrowSVG)
    await Assert.isVisible(ActivityTabPage.linkSVG)
    await Assert.hasText(
      ActivityTabPage.selectFilterDropdown,
      'Display: Contract Call'
    )
  })

  it('should show bridge transactions only in list', async () => {
    await ActivityTabPage.tapFilterDropdown()
    await ActivityTabPage.tapBridgeFilterOption()
    await Assert.isNotVisible(ActivityTabPage.arrowSVG)
    await Assert.isVisible(ActivityTabPage.selectFilterDropdown)
    await Assert.isVisible(ActivityTabPage.linkSVG)
    await Assert.hasText(
      ActivityTabPage.selectFilterDropdown,
      'Display: Bridge'
    )
  })

  it('should display incoming transaction details', async () => {
    await ActivityTabPage.tapFilterDropdown()
    await ActivityTabPage.tapIncomingFilterOption()
    await Assert.hasText(
      ActivityTabPage.selectFilterDropdown,
      'Display: Incoming'
    )
    await ActivityTabPage.tapArrowIcon(1)
    await Assert.isVisible(TransactionDetailsPage.status)
    await Assert.isVisible(TransactionDetailsPage.transactionType)
  })
})
