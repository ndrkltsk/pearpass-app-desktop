import clipboard from 'clipboardy'
// import { qase } from 'playwright-qase-reporter'

import {
  LoginPage,
  MainPage,
  SideMenuPage,
  CreateOrEditPage,
  Utilities,
  DetailsPage
} from '../../components/index.js'
import { test, expect } from '../../fixtures/app.runner.js'
import testData from '../../fixtures/test-data.js'

test.describe('Editing/Deleting PassPhrase Item', () => {
  test.describe.configure({ mode: 'serial' })

  let loginPage,
    createOrEditPage,
    sideMenuPage,
    mainPage,
    utilities,
    detailsPage,
    page

  test.beforeAll(async ({ app }) => {
    page = await app.getPage()
    const root = page.locator('body')

    loginPage = new LoginPage(root)
    mainPage = new MainPage(root)
    sideMenuPage = new SideMenuPage(root)
    createOrEditPage = new CreateOrEditPage(root)
    utilities = new Utilities(root)
    detailsPage = new DetailsPage(root)

    await loginPage.loginToApplication(testData.credentials.validPassword)

    await sideMenuPage.selectSideBarCategory('passPhrase')
    await utilities.deleteAllElements()
     await mainPage.clickAddItem('passPhrase')

    await createOrEditPage.fillCreateOrEditInput('passphrase-title', 'PassPhrase Title')
    await clipboard.write(
      'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12'
    )
    await createOrEditPage.clickOnPasteFromClipboard()
    await createOrEditPage.clickOnCreateOrEditButton('passphrase-save')
    await page.waitForTimeout(testData.timeouts.action)

    // await createOrEditPage.fillCreateOrEditInput('title', 'PassPhrase Title')
    // await clipboard.write(testData.passphrase.text12)
    // await createOrEditPage.clickOnPasteFromClipboard()
    // await createOrEditPage.clickOnCreateOrEditButton('save')

    // await page.waitForTimeout(testData.timeouts.action)
  })

  test.beforeEach(async ({ app }) => {
    page = await app.getPage()
    const root = page.locator('body')
    loginPage = new LoginPage(root)
    mainPage = new MainPage(root)
    sideMenuPage = new SideMenuPage(root)
    createOrEditPage = new CreateOrEditPage(root)
    utilities = new Utilities(root)
    detailsPage = new DetailsPage(root)
  })

  test.afterAll(async () => {
    await utilities.deleteAllElements()
    await sideMenuPage.clickSidebarExitButton()
  })

  test('Verify that edited "PassPhrase" item fields are saved correctly', async () => {
    // qase.id(2658)
    await mainPage.openElementDetails()
    await detailsPage.editElement()
    await createOrEditPage.fillCreateOrEditInput('passphrase-title', 'PassPhrase Title Edited')

    await clipboard.write(testData.passphrase.text24)
    await createOrEditPage.clickOnPasteFromClipboard()
    await createOrEditPage.clickOnCreateOrEditButton('passphrase-save')
    await page.waitForTimeout(testData.timeouts.action)

    await mainPage.openElementDetails()

    await detailsPage.verifyTitle('PassPhrase Title Edited')
    await detailsPage.verifyAllRecoveryPhraseWords([
      'word1',
      'word2',
      'word3',
      'word4',
      'word5',
      'word6',
      'word7',
      'word8',
      'word9',
      'word10',
      'word11',
      'word12',
      'word13',
      'word14',
      'word15',
      'word16',
      'word17',
      'word18',
      'word19',
      'word20',
      'word21',
      'word22',
      'word23',
      'word24'
    ])
  })

  test('Verify that the "PassPhrase" item is removed after deletion', async () => {
    // qase.id(2221)
    await utilities.deleteAllElements()
    await mainPage.verifyElementIsNotVisible()
  })

  test('Verify that the empty collection view is displayed on the Home screen after deleting the last item', async () => {
    // qase.id(2222)
    await sideMenuPage.selectSideBarCategory('all')
    await expect(mainPage.emptyCollectionView).toBeVisible()
  })
})
