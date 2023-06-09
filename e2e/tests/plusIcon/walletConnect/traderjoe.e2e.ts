/* eslint-disable jest/expect-expect */
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

describe('Connect to traderjoexyz using WalletConnect', () => {
  beforeAll(async () => {
    await warmup()
    await LoginRecoverWallet.recoverWalletLogin()
  })

  it('should navigate to wallet connect screen', async () => {
    await BottomTabsPage.tapPlusIcon()
    await PlusMenuPage.tapWalletConnectButton()
  })

  it('should connect to traderjoexyz', async () => {
    await ScanQrCodePage.enterQrCode()
    await ConnectToSitePage.tapApproveBtn()
    await BurgerMenuPage.tapBurgerMenuButton()
    await BurgerMenuPage.tapSecurityAndPrivacy()
    await SecurityAndPrivacyPage.tapConnectedSites()
    await Assert.isVisible(ConnectedSitesPage.traderJoe)
    await ConnectedSitesPage.tapManageBtn()
    await ConnectedSitesPage.tapSelectAllChkBox()
    await ConnectedSitesPage.tapDeleteBtn()
    await Assert.isVisible(ConnectedSitesPage.noConnectedSitesText)
  })
})