/* eslint-env detox/detox, jest */
/**
 * @jest-environment ./environment.ts
 */
import LoginRecoverWallet from '../../../helpers/loginRecoverWallet'
import { warmup } from '../../../helpers/warmup'
import BottomTabsPage from '../../../pages/bottomTabs.page'
import PlusMenuPage from '../../../pages/plusMenu.page'
import ScanQrCodePage from '../../../pages/scanQrCode.page'
import ConnectToSitePage from '../../../pages/connectToSite.page'
import BurgerMenuPage from '../../../pages/burgerMenu/burgerMenu.page'
import SecurityAndPrivacyPage from '../../../pages/securityAndPrivacy.page'
import Assert from '../../../helpers/assertions'
import ConnectedSitesPage from '../../../pages/connectedSites.page'
import actions from '../../../helpers/actions'
import PortfolioPage from '../../../pages/portfolio.page'
import CommonElsPage from '../../../pages/commonEls.page'
import delay from '../../../helpers/waits'

describe('Connect to dApp using WalletConnect', () => {
  beforeAll(async () => {
    await warmup()
  })

  it('should navigate to wallet connect screen', async () => {
    await LoginRecoverWallet.recoverWalletLogin()
    await PortfolioPage.tapNetworksDropdown()
    await PortfolioPage.tapNetworksDropdownETH()
    await actions.waitForElement(PortfolioPage.ethNetwork)
    await actions.waitForElement(BottomTabsPage.plusIcon, 10, 1)
    await ConnectToSitePage.tapPlusIcon()
    await PlusMenuPage.tapWalletConnectButton()
  })

  it('should connect to dApp', async () => {
    await ScanQrCodePage.enterQrCode()
    await ConnectToSitePage.tapSelectAccountsDropdown()
    delay(1000)
    await ConnectedSitesPage.tapSelectAllChkBox()
    await ConnectToSitePage.tapApproveBtn()
    await BurgerMenuPage.tapBurgerMenuButton()
    await BurgerMenuPage.tapSecurityAndPrivacy()
    await delay(5000)
    await CommonElsPage.waitForToastMsgGone(1)
    await SecurityAndPrivacyPage.tapConnectedSites()
    await ConnectedSitesPage.tapManageBtn()
    await ConnectedSitesPage.tapSelectAllChkBox()
    await ConnectedSitesPage.tapDeleteBtn()
    await Assert.isVisible(ConnectedSitesPage.noConnectedSitesText)
  })

  afterAll(async () => {
    actions.writeQrCodeToFile('')
  })
})
