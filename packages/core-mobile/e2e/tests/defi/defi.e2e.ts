import AccountManagePage from '../../pages/accountManage.page'
import PortfolioPage from '../../pages/portfolio.page'
import { warmup } from '../../helpers/warmup'
import DefiPage from '../../pages/defi.page'
import actions from '../../helpers/actions'

describe('Defi Tab', () => {
  beforeAll(async () => {
    await warmup()
  })

  it('Should verify Defi Items', async () => {
    await PortfolioPage.tapDefiTab()
    await DefiPage.verifyDefiListItems()
  })

  it('Should verify Defi Protocol Items', async () => {
    await DefiPage.tapDefiProtocol()
    await DefiPage.verifyDefiProtocolItems()
    await DefiPage.tapHeaderBack()
  })

  it('Should verify empty screen Defi Items', async () => {
    await AccountManagePage.tapAccountDropdownTitle()
    if (!(await actions.isVisible(AccountManagePage.secondAccount, 0))) {
      await AccountManagePage.createAccount(2)
    } else {
      await AccountManagePage.tapSecondAccount()
      await AccountManagePage.tapAccountDropdownTitle()
    }
    await DefiPage.verifyEmptyScreenItems()
  })
})
