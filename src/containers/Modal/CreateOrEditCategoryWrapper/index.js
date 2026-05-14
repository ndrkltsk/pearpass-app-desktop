import { useState } from 'react'

import { RECORD_TYPES } from '@tetherto/pearpass-lib-vault'
import { html } from 'htm/react'

import { CreateOrEditAuthenticatorModalContent } from './CreateOrEditAuthenticatorModalContent/CreateOrEditAuthenticatorModalContent'
import { CreateOrEditCreditCardModalContent } from './CreateOrEditCreditCardModalContent'
import { CreateOrEditCreditCardModalContentV2 } from './CreateOrEditCreditCardModalContentV2/CreateOrEditCreditCardModalContentV2'
import { CreateOrEditCustomModalContent } from './CreateOrEditCustomModalContent'
import { CreateOrEditCustomModalContentV2 } from './CreateOrEditCustomModalContentV2/CreateOrEditCustomModalContentV2'
import { CreateOrEditIdentityModalContent } from './CreateOrEditIdentityModalContent'
import { CreateOrEditIdentityModalContentV2 } from './CreateOrEditIdentityModalContentV2/CreateOrEditIdentityModalContentV2'
import { CreateOrEditLoginModalContent } from './CreateOrEditLoginModalContent'
import { CreateOrEditLoginModalContentV2 } from './CreateOrEditLoginModalContentV2/CreateOrEditLoginModalContentV2'
import { CreateOrEditNoteModalContent } from './CreateOrEditNoteModalContent'
import { CreateOrEditNoteModalContentV2 } from './CreateOrEditNoteModalContentV2/CreateOrEditNoteModalContentV2'
import { CreateOrEditPassPhraseModalContent } from './CreateOrEditPassPhraseModalContent'
import { CreateOrEditPassPhraseModalContentV2 } from './CreateOrEditPassPhraseModalContentV2/CreateOrEditPassPhraseModalContentV2'
import { CreateOrEditWifiModalContent } from './CreateOrEditWifiModalContent'
import { CreateOrEditWifiModalContentV2 } from './CreateOrEditWifiModalContentV2/CreateOrEditWifiModalContentV2'
import { isV2 } from '../../../utils/designVersion'

export const CreateOrEditCategoryWrapper = ({
  initialRecord,
  selectedFolder,
  recordType,
  isFavorite
}) => {
  const [currentRecordType, setCurrentRecordType] = useState(recordType)

  if (currentRecordType === RECORD_TYPES.OTP) {
    if (initialRecord) {
      return html`<${CreateOrEditLoginModalContentV2}
        initialRecord=${initialRecord}
        selectedFolder=${selectedFolder}
        isFavorite=${isFavorite}
        onTypeChange=${setCurrentRecordType}
      />`
    }

    return html`<${CreateOrEditAuthenticatorModalContent}
      initialRecord=${initialRecord}
      selectedFolder=${selectedFolder}
      isFavorite=${isFavorite}
      onTypeChange=${setCurrentRecordType}
    />`
  }

  if (currentRecordType === RECORD_TYPES.LOGIN) {
    if (isV2()) {
      return html`<${CreateOrEditLoginModalContentV2}
        initialRecord=${initialRecord}
        selectedFolder=${selectedFolder}
        isFavorite=${isFavorite}
        onTypeChange=${setCurrentRecordType}
      />`
    }

    return html`<${CreateOrEditLoginModalContent}
      initialRecord=${initialRecord}
      selectedFolder=${selectedFolder}
      isFavorite=${isFavorite}
      onTypeChange=${setCurrentRecordType}
    />`
  }

  if (currentRecordType === RECORD_TYPES.CREDIT_CARD) {
    if (isV2()) {
      return html`<${CreateOrEditCreditCardModalContentV2}
        initialRecord=${initialRecord}
        selectedFolder=${selectedFolder}
        isFavorite=${isFavorite}
        onTypeChange=${setCurrentRecordType}
      />`
    }

    return html`<${CreateOrEditCreditCardModalContent}
      initialRecord=${initialRecord}
      selectedFolder=${selectedFolder}
      isFavorite=${isFavorite}
      onTypeChange=${setCurrentRecordType}
    />`
  }

  if (currentRecordType === RECORD_TYPES.IDENTITY) {
    if (isV2()) {
      return html`<${CreateOrEditIdentityModalContentV2}
        initialRecord=${initialRecord}
        selectedFolder=${selectedFolder}
        isFavorite=${isFavorite}
        onTypeChange=${setCurrentRecordType}
      />`
    }

    return html`<${CreateOrEditIdentityModalContent}
      initialRecord=${initialRecord}
      selectedFolder=${selectedFolder}
      isFavorite=${isFavorite}
      onTypeChange=${setCurrentRecordType}
    />`
  }

  if (currentRecordType === RECORD_TYPES.NOTE) {
    if (isV2()) {
      return html`<${CreateOrEditNoteModalContentV2}
        initialRecord=${initialRecord}
        selectedFolder=${selectedFolder}
        isFavorite=${isFavorite}
        onTypeChange=${setCurrentRecordType}
      />`
    }

    return html`<${CreateOrEditNoteModalContent}
      initialRecord=${initialRecord}
      selectedFolder=${selectedFolder}
      isFavorite=${isFavorite}
      onTypeChange=${setCurrentRecordType}
    />`
  }

  if (currentRecordType === RECORD_TYPES.WIFI_PASSWORD) {
    if (isV2()) {
      return html`<${CreateOrEditWifiModalContentV2}
        initialRecord=${initialRecord}
        selectedFolder=${selectedFolder}
        isFavorite=${isFavorite}
        onTypeChange=${setCurrentRecordType}
      />`
    }

    return html`<${CreateOrEditWifiModalContent}
      initialRecord=${initialRecord}
      selectedFolder=${selectedFolder}
      isFavorite=${isFavorite}
      onTypeChange=${setCurrentRecordType}
    />`
  }

  if (currentRecordType === RECORD_TYPES.PASS_PHRASE) {
    if (isV2()) {
      return html`<${CreateOrEditPassPhraseModalContentV2}
        initialRecord=${initialRecord}
        selectedFolder=${selectedFolder}
        isFavorite=${isFavorite}
        onTypeChange=${setCurrentRecordType}
      />`
    }

    return html`<${CreateOrEditPassPhraseModalContent}
      initialRecord=${initialRecord}
      selectedFolder=${selectedFolder}
      isFavorite=${isFavorite}
      onTypeChange=${setCurrentRecordType}
    />`
  }

  if (currentRecordType === RECORD_TYPES.CUSTOM) {
    if (isV2()) {
      return html`<${CreateOrEditCustomModalContentV2}
        initialRecord=${initialRecord}
        selectedFolder=${selectedFolder}
        isFavorite=${isFavorite}
        onTypeChange=${setCurrentRecordType}
      />`
    }

    return html`<${CreateOrEditCustomModalContent}
      initialRecord=${initialRecord}
      selectedFolder=${selectedFolder}
      isFavorite=${isFavorite}
      onTypeChange=${setCurrentRecordType}
    />`
  }
}
