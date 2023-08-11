import createPinLoc from '../locators/createPin.loc'
import Action from '../helpers/actions'

class CreatePinPage {
  get numpadZero() {
    return by.id(createPinLoc.numPadZero)
  }

  get numpadOne() {
    return by.id(createPinLoc.numpadOne)
  }

  get emptyCheckBox() {
    return by.id(createPinLoc.emptyCheckBox)
  }

  get nextBtn() {
    return by.text(createPinLoc.nextBtn)
  }

  get enterYourPinHeader() {
    return by.text(createPinLoc.enterYourPinHeader)
  }

  get setNewPinHeader() {
    return by.text(createPinLoc.setNewPinHeader)
  }

  async tapNumpadZero() {
    await element(this.numpadZero).multiTap(6)
  }

  async tapNumpadOne() {
    await Action.tap(this.numpadOne)
  }

  async tapNextBtn() {
    await Action.tap(this.nextBtn)
  }

  async tapEmptyCheckbox() {
    await Action.tapElementAtIndex(this.emptyCheckBox, 0)
    await Action.tapElementAtIndex(this.emptyCheckBox, 0)
  }

  async createPin() {
    await element(this.numpadZero).multiTap(6)
  }

  async createNewPin() {
    await element(this.numpadOne).multiTap(6)
  }

  async enterNewCurrentPin() {
    await element(this.numpadOne).multiTap(6)
  }

  async enterCurrentPin() {
    await element(this.numpadZero).multiTap(6)
  }
}

export default new CreatePinPage()
