import { test, expect } from '../fixtures/app.runner.js'

class DetailsPage {
  constructor(root) {
    this.root = root
  }

  // ==== LOCATORS ====

  get getItemDetailsCommentInput() {
    return this.root.getByTestId('comments-multi-slot-input-slot-0').locator('input')
  }

  getItemDetailsSlot(slot) {
    return this.root.getByTestId(`credentials-multi-slot-input-slot-${slot}`).locator('input')
  }

  getItemDetailsByPlaceholder(placeholder) {
    return this.root.getByPlaceholder(placeholder)
  }

  // async verifyItemDetailsByPlaceholderValue(placeholder, value) {
  //   const input = this.getItemDetailsByPlaceholder(placeholder)
  //   await expect(input).toHaveValue(value)
  // }

  get itemDetailsCounter() {
    return this.root
    .getByTestId('details-header-v2')
    .locator('input[placeholder]')
  }

  async verifyDetailsNoItems() {
    await expect(this.itemDetailsCounter).toHaveCount(0)
  }

  // async verifyDetailsSlotNotVisible(slot) {
  //   const slotInput = this.getItemDetailsSlot(slot)

  //   await expect
  //     .poll(async () => await slotInput.isVisible(), {
  //       timeout: 5000,
  //       message: `Slot ${slot} is still visible`
  //     })
  //     .toBe(false)
  // }

  async verifyCustomNoteText(expectedText) {
    await expect(this.getItemDetailsCommentInput).toBeVisible()
    await expect(this.getItemDetailsCommentInput).toHaveValue(expectedText)
  }

  async verifyCustomNoteTextNotVisible(expectedText) {
    await expect(this.getItemDetailsCommentInput).not.toBeVisible()
    await expect(this.getItemDetailsCommentInput).not.toHaveValue(expectedText)
  }

  // get getItemDetailsCustomInput() {
  //   return this.root.getByPlaceholder('Add comment')
  // }

  // async verifyCustomNoteText(expectedText) {
  //   await expect(this.getItemDetailsCustomInput).toBeVisible()
  //   await expect(this.getItemDetailsCustomInput).toHaveValue(expectedText)
  // }

  get getItemDetailsTitle() {
    // v1: dedicated testid; v2: title rendered as text inside details-header-v2
    return this.root.locator('[data-testid^="details-title"], [data-testid="details-header-v2"]')
  }

  async verifyTitle(expectedTitle) {
    await expect(this.getItemDetailsTitle).toContainText(expectedTitle)
  }

  getElementItemDetails(labelOrPlaceholder) {
    // v2: InputField renders testID on wrapper div; inner input holds the value
    const v2LabelMap = {
      'Email or username': 'credentials-multi-slot-input-slot-0',
      'Password': 'credentials-multi-slot-input-slot-1',
      'https://': 'website-multi-slot-input-slot-0',
      // Credit card v2 fields
      'Name on card': 'card-details-multi-slot-input-slot-0',
      'Number on card': 'card-details-multi-slot-input-slot-1',
      'Date of expire': 'card-details-multi-slot-input-slot-2',
      'Security code': 'card-details-multi-slot-input-slot-3',
      'Pin code': 'card-details-multi-slot-input-slot-4',
      'Comment': 'comments-multi-slot-input-slot-0',
      // Wi-Fi v2 fields
      'Wi-Fi Password': 'credentials-multi-slot-input-slot-0',
      'Add comment': 'comments-multi-slot-input-slot-0',
      'Other Field': 'custom-fields-multi-slot-input-slot-0',
    }
    const v2TestId = v2LabelMap[labelOrPlaceholder]
    if (v2TestId) {
      return this.root.getByTestId(v2TestId).locator('input').first()
    }
    // v1 fallback
    return this.root
      .locator('input', {
        has: this.root.locator('[data-testid="details-header"]', {
          hasText: labelOrPlaceholder
        })
      })
      .or(this.root.locator(`input[placeholder="${labelOrPlaceholder}"]`))
  }

  getElementItemDetailsNew() {
    return this.root.getByTestId('note-multi-slot-input-slot-0').locator('input').first()
  }

  async verifyNoteText(note_text) {
    const noteTextDetail = this.getElementItemDetailsNew()
    await expect(noteTextDetail).toBeVisible()
    await expect(noteTextDetail).toHaveValue(note_text)
  }

  getIdentityDetails(name) {
    const v2SlotMap = {
      // Personal information
      fullname:               'personal-information-multi-slot-input-slot-0',
      email:                  'personal-information-multi-slot-input-slot-1',
      phone:                  'personal-information-multi-slot-input-slot-2',
      // Address
      address:                'address-multi-slot-input-slot-0',
      zip:                    'address-multi-slot-input-slot-1',
      city:                   'address-multi-slot-input-slot-2',
      region:                 'address-multi-slot-input-slot-3',
      country:                'address-multi-slot-input-slot-4',
      // Passport
      passportfullname:       'passport-multi-slot-input-slot-0',
      passportnumber:         'passport-multi-slot-input-slot-1',
      passportissuingcountry: 'passport-multi-slot-input-slot-2',
      passportdateofissue:    'passport-multi-slot-input-slot-3',
      passportexpirydate:     'passport-multi-slot-input-slot-4',
      passportnationality:    'passport-multi-slot-input-slot-5',
      passportdob:            'passport-multi-slot-input-slot-6',
      passportgender:         'passport-multi-slot-input-slot-7',
      // ID Card
      idcardnumber:           'identity-card-multi-slot-input-slot-0',
      idcarddateofissue:      'identity-card-multi-slot-input-slot-1',
      idcardexpirydate:       'identity-card-multi-slot-input-slot-2',
      idcardissuingcountry:   'identity-card-multi-slot-input-slot-3',
      // Comment / note
      comment:                'comments-multi-slot-input-slot-0',
      note:                   'comments-multi-slot-input-slot-0',
    }
    const v2TestId = v2SlotMap[name]
    if (v2TestId) {
      return this.root.getByTestId(v2TestId).locator('input').first()
    }
    // v1 fallback
    return this.root.getByTestId(`identitydetails-field-${name}`)
  }

  async verifyIdentityDetails(name) {
    const identityDetail = this.getIdentityDetails(name)
    await expect(identityDetail).toBeVisible()
  }

  async verifyIdentityDetailsValue(name, expectedValue) {
    const identityDetail = this.getIdentityDetails(name)
    await expect(identityDetail).toHaveValue(expectedValue)
  }

  get elementItemFileLink() {
    // return this.root.getByRole('link', { name: 'TestPhoto.png' })
    // return this.root.getByTestId('attachment-field-0').getByText('TestPhoto.png', { exact: true })
    return this.root
      .getByTestId('attachment-field-0')
      .getByText('TestPhoto.png', { exact: true })
  }

  get uploadedImage() {
    return this.root.getByAltText('TestPhoto.png')
  }

  get detailsBarActionsButton() {
    return this.root.getByTestId('details-button-actions-v2')
  }

  get detailsBarEditButton() {
    return this.root.getByTestId('details-actions-item-edit-v2')
  }

  // details-actions-item-favorite-v2

  get detailsBarFavoriteButton() {
    return this.root.getByTestId('details-actions-item-favorite-v2')
  }

  // get detailsBarFavoriteButton() {
  //   return this.root.getByTestId('details-button-favorite')
  // }

  get detailsBarThreeDots() {
    return this.root.getByTestId('button-round-icon').first()
  }

  get detailsBarThreeDotsCloseDetails() {
    return this.root.getByTestId('button-round-icon').last()
  }

  async openItemBarThreeDotsDropdownMenu() {
    await expect(this.detailsBarEditButton).toBeVisible()
    await this.detailsBarEditButton.click()
  }

  get markAsFavoriteButton() {
    // return this.root.getByText('Mark as favorite').last()
    // return this.root.getByTestId('details-actions-item-favorite-v2')
    return this.root.locator('[data-testid="details-actions-item-favorite-v2"]').getByText('Add to Favorites', { exact: true })
  }//// details-actions-item-favorite-v2

  get removeFromFavoritesButton() {
    // page.getByTestId('details-actions-item-favorite-v2').locator('[name="Remove from Favorites"]')
    // page.getByTestId('details-actions-item-favorite-v2')
    // return this.root.getByText('Remove from Favorites').last()
    return this.root.locator('[data-testid="details-actions-item-favorite-v2"]').getByText('Remove from Favorites', { exact: true })
    // page.locator('[data-testid="details-actions-item-favorite-v2"]').getByText('Remove from Favorites', { exact: true })
  }

  get moveToAnotherFolderButton() {
    return this.root.getByText('Move to another folder').last()
  }

  get deleteElementButton() {
    return this.root.getByText('Delete element').last()
  }

  get elementItemCloseButton() {
    // Matches any close button whose testID ends with "-close-v2"
    // e.g. createoredit-login-close-v2, createoredit-creditcard-close-v2, etc.
    return this.root.getByTestId(/-close-v2$/).first()
  }

  async clickElementItemCloseButton() {
    await expect(this.elementItemCloseButton).toBeVisible()
    await this.elementItemCloseButton.click()
  }

  get createNewFolderButton() {
    return this.root.locator('[data-testid="button-single-input"]')
  }

  getCreateNewFolderTitleInput() {
    return this.root.locator(
      'input[placeholder="Enter Name"]'
    )
  }

  get createFolderButton() {
    return this.root.getByRole('button', { name: 'Create New Folder' });
  }

  // get createFolderButton() {
  //   return this.root.getByText('Create folder')
  // }

  getItemDetailsFolderName(foldername) {
    // v2: folder badge not shown in details panel; verify via sidebar folder item
    return this.root.getByTestId(`sidebar-folder-${foldername}`)
  }

  async verifyItemDetailsFolderName(foldername) {
    const itemDetailsFolder = this.getItemDetailsFolderName(foldername)
    await expect(itemDetailsFolder).toBeVisible()
  }

  get recordListContainer() {
    return this.root.getByTestId('recordList-record-container')
  }

  getFavoriteAvatar(initials) {
    return this.recordListContainer
      .getByTestId(`avatar-favorite-${initials}`)
      .first()
  }

  getFavoriteAvatarLast(initials) {
    return this.recordListContainer
      .getByTestId(`avatar-favorite-${initials}`)
      .last()
  }

  getRecoveryPhraseWordsDetails(word) {
    return this.root.getByTestId(`passphrase-${word}`)
  }

  // ==== ACTIONS ====

  async clickRemoveFromFavoritesButton() {
    await expect(this.removeFromFavoritesButton).toBeVisible()
    await this.removeFromFavoritesButton.click()
  }

  async clickMarkAsFavoriteButton() {
    // await expect(this.markAsFavoriteButton).toBeVisible()
    // await this.markAsFavoriteButton.click()
    await expect(this.detailsBarFavoriteButton).toBeVisible()
    await this.detailsBarFavoriteButton.click()
  }

  async clickFavoriteButton() {
    await expect(this.detailsBarActionsButton).toBeVisible()
    await this.detailsBarActionsButton.click()
    await expect(this.detailsBarFavoriteButton).toBeVisible()
    await this.detailsBarFavoriteButton.click()
  }

  // async clickFavoriteButton() {
  //   await expect(this.detailsBarActionsButton).toBeVisible()
  //   await this.detailsBarActionsButton.click()
  //   await expect(this.detailsBarEditButton).toBeVisible()
  //   await this.detailsBarEditButton.click()
  // }

  async clickCreateNewFolder() {
    await expect(this.createNewFolderButton).toBeVisible()
    await this.createNewFolderButton.click()
  }

  async clickCreateFolderButton() {
    const saveBtn = this.root.getByTestId('createfolder-save-v2')
    await expect(saveBtn).toBeVisible()
    await saveBtn.click()
  }

  async editElement() {
    await expect(this.detailsBarActionsButton).toBeVisible()
    await this.detailsBarActionsButton.click()
    await expect(this.detailsBarEditButton).toBeVisible()
    await this.detailsBarEditButton.click()
  }

  async openItemBarThreeDotsDropdownMenu() {
    await expect(this.detailsBarActionsButton).toBeVisible()
    await this.detailsBarActionsButton.click()
  }

  async clickMoveToAnotherFolder() {
    await expect(this.moveToAnotherFolderButton).toBeVisible()
    await this.moveToAnotherFolderButton.click()
  }

  async fillCreateNewFolderTitleInput(value) {
    await this.getCreateNewFolderTitleInput().fill(value)
  }

  async clickDeleteElement() {
    await expect(this.deleteElementButton).toBeVisible()
    await this.deleteElementButton.click()
  }

  async clickConfirmYes() {
    const yesButton = this.root.getByText('Yes')
    await expect(yesButton).toBeVisible()
    await yesButton.click()
  }

  async clickShowHidePasswordButton() {
    await expect(this.elementItemPasswordShowHide).toBeVisible()
    await this.elementItemPasswordShowHide.click()
  }

  async clickOnUploadedFile() {
    await expect(this.elementItemFileLink).toBeVisible()
    await this.elementItemFileLink.click()
  }

  async verifyPasswordFieldType(slotTestId, expectedType) {
    const input = this.root.getByTestId(slotTestId).locator('input').first()
    await expect(input).toBeVisible()
    await expect(input).toHaveAttribute('type', expectedType)
  }

  async clickPasswordToggle(slotTestId) {
    const toggle = this.root.getByTestId(slotTestId).getByTestId('password-field-eye-button')
    await expect(toggle).toBeVisible()
    await toggle.click()
  }

  // ==== VERIFICATIONS ====

  async verifyItemDetailsValue(labelOrPlaceholder, expectedValue) {
    const itemDetail = this.getElementItemDetails(labelOrPlaceholder)
    await expect(itemDetail).toHaveValue(expectedValue)
  }

  async verifyItemDetailsValueIsNotVisible(labelOrPlaceholder) {
    const itemDetail = this.getElementItemDetails(labelOrPlaceholder)
    await expect(itemDetail).not.toBeVisible()
  }

  // async verifyItemDetailsValueIsNotVisible(labelOrPlaceholder) {
  //   const itemDetail = this.getElementItemDetails(labelOrPlaceholder)
  //   await expect(itemDetail).not.toBeVisible()
  // }

  // credentials-multi-slot-input

  async verifyLoginElementItemUsername(username) {
    await expect(this.elementItemUsername).toBeVisible()
    await expect(this.elementItemUsername).toHaveValue(username)
  }

  async verifyLoginElementItemUsernameNotVisible() {
    await expect(this.elementItemUsername).not.toBeVisible()
  }

  async verifyLoginElementItemPassword(password) {
    await expect(this.elementItemPassword).toBeVisible()
    await expect(this.elementItemPassword).toHaveValue(password)
  }

  async verifyLoginElementItemPasswordNotVisible() {
    await expect(this.elementItemPassword).not.toBeVisible()
  }

  async verifyLoginElementItemWebAddress(webaddress) {
    await expect(this.elementItemWebAddress).toBeVisible()
    await expect(this.elementItemWebAddress).toHaveValue(webaddress)
  }

  async verifyLoginElementItemWebAddressIsVisible() {
    await expect(this.elementItemWebAddress).toBeVisible()
  }

  async verifyLoginElementItemNote(note) {
    await expect(this.elementItemNote).toBeVisible()
    await expect(this.elementItemNote).toHaveValue(note)
  }

  async verifyLoginElementItemNoteIsNotVisible() {
    await expect(this.elementItemNote).not.toBeVisible()
  }

  async verifyUploadedFileIsVisible() {
    await expect(this.elementItemFileLink).toBeVisible()
  }

  async verifyUploadedImageIsVisible() {
    await expect(this.uploadedImage).toBeVisible()
  }

  get recoveryPhraseDetails() {
    return this.root.getByTestId(/passphrase-word-input-\d+/)
  }

  async verifyAllRecoveryPhraseWords(expectedWords) {
    const slots = this.recoveryPhraseDetails
    const count = await slots.count()
    for (let i = 0; i < count; i++) {
      const input = slots.nth(i).locator('input').first()
      await expect(input).toHaveValue(expectedWords[i])
    }
  }
}

module.exports = { DetailsPage }
