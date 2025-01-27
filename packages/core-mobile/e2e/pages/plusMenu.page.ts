import Actions from '../helpers/actions'
import delay from '../helpers/waits'
import PlusMenuLoc from '../locators/plusMenu.loc'
import bottomTabsPage from './bottomTabs.page'
import scanQrCodePage from './scanQrCode.page'

class PlusMenuPage {
  get bridgeButton() {
    return by.id(PlusMenuLoc.bridge)
  }

  get connectionURI() {
    return by.text(PlusMenuLoc.connectionURI)
  }

  get sendButton() {
    return by.id(PlusMenuLoc.send)
  }

  get swapButton() {
    return by.id(PlusMenuLoc.swap)
  }

  get walletConnectButtonSVG() {
    return by.id(PlusMenuLoc.walletConnectSVG)
  }

  get inputTextField() {
    return by.id(PlusMenuLoc.inputTextField)
  }

  get walletConnectInputField() {
    return by.id(PlusMenuLoc.inputTextField)
  }

  get walletConnectButton() {
    return by.text(PlusMenuLoc.walletConnectButton)
  }

  get receiveButton() {
    return by.id(PlusMenuLoc.receive)
  }

  async tapReceiveButton() {
    await Actions.tap(this.receiveButton)
  }

  async connectWallet(qrUri: string) {
    await bottomTabsPage.tapPortfolioTab()
    await bottomTabsPage.tapPlusIcon()
    await this.tapWalletConnectButton()
    await scanQrCodePage.setQrCode(qrUri.toString())
    await delay(5000)
  }

  async tapBridgeButton() {
    await Actions.tap(this.bridgeButton)
  }

  async tapSendButton() {
    await Actions.tap(this.sendButton)
  }

  async tapSwapButton() {
    await Actions.tap(this.swapButton)
  }

  async tapWalletConnectButton() {
    await Actions.tap(this.walletConnectButton)
  }
}

export default new PlusMenuPage()
