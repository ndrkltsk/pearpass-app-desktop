import React from 'react'

import { useLingui } from '@lingui/react'
import { RECORD_TYPES, useRecords } from '@tetherto/pearpass-lib-vault'
import { html } from 'htm/react'

import { useCreateOrEditRecord } from './useCreateOrEditRecord'
import { ConfirmationModalContent } from '../containers/Modal/ConfirmationModalContent'
import { DeleteRecordsModalContentV2 } from '../containers/Modal/DeleteRecordsModalContentV2'
import { MoveFolderModalContent } from '../containers/Modal/MoveFolderModalContent'
import { MoveFolderModalContentV2 } from '../containers/Modal/MoveFolderModalContentV2/MoveFolderModalContentV2'
import { useModal } from '../context/ModalContext'
import { useRouter } from '../context/RouterContext'
import { useToast } from '../context/ToastContext'
import { isV2 } from '../utils/designVersion'

/**
 * @param {{
 *  excludeType: Array<string>
 *  record: {
 *    id: string
 *  }
 *  onSelect: () => void
 *  onClose: () => void
 * }}
 *
 * @returns {{
 *  actions: Array<{
 *  name: string,
 *  type: string
 * }>}}
 */
export const useRecordActionItems = ({
  excludeTypes = [],
  record,
  onSelect,
  onClose
} = {}) => {
  const { i18n } = useLingui()
  const { setModal, closeModal } = useModal()
  const { data: routerData, navigate, currentPage } = useRouter()
  const { setToast } = useToast()

  const { deleteRecords, updateRecords, updateFavoriteState } = useRecords()
  const { handleCreateOrEditRecord } = useCreateOrEditRecord()

  const isOtpContext = routerData?.recordType === RECORD_TYPES.OTP
  const isAuthenticatorLoginRecord =
    isOtpContext && record?.type === RECORD_TYPES.LOGIN

  const handleStripOtp = async () => {
    const { otpInput, otp, ...restData } = record?.data ?? {}
    const { otpPublic, ...recordWithoutOtp } = record ?? {}
    const updatedRecord = { ...recordWithoutOtp, data: restData }
    try {
      await updateRecords([updatedRecord])
      if (routerData?.recordId === record?.id) {
        navigate(currentPage, { ...routerData, recordId: undefined })
      }
      closeModal?.()
    } catch (err) {
      setToast({
        message: err?.message ?? i18n._('Failed to remove authenticator code')
      })
    }
  }

  const handleDeleteConfirm = () => {
    if (routerData?.recordId === record?.id) {
      navigate(currentPage, { ...routerData, recordId: undefined })
    }

    deleteRecords([record?.id])

    closeModal?.()
  }

  const handleDelete = () => {
    if (isV2()) {
      setModal(
        <DeleteRecordsModalContentV2
          records={[record]}
          onConfirm={isAuthenticatorLoginRecord ? handleStripOtp : undefined}
          dialogTitle={
            isAuthenticatorLoginRecord
              ? i18n._('Remove Authenticator Code')
              : undefined
          }
          confirmText={
            isAuthenticatorLoginRecord
              ? i18n._(
                  'Are you sure you want to remove the authenticator code from this login record?'
                )
              : undefined
          }
          submitLabel={
            isAuthenticatorLoginRecord ? i18n._('Remove') : undefined
          }
        />
      )
    } else {
      setModal(
        <ConfirmationModalContent
          title={i18n._('Are you sure to delete this item?')}
          text={i18n._('This is permanent and cannot be undone')}
          primaryLabel={i18n._('No')}
          secondaryLabel={i18n._('Yes')}
          secondaryAction={handleDeleteConfirm}
          primaryAction={closeModal}
        />
      )
    }
    onClose?.()
  }

  const handleFavoriteToggle = () => {
    updateFavoriteState([record?.id], !record?.isFavorite)

    onClose?.()
  }

  const handleSelect = () => {
    onSelect?.(record)

    onClose?.()
  }

  const handleEdit = () => {
    handleCreateOrEditRecord({
      recordType: isOtpContext ? RECORD_TYPES.OTP : record?.type,
      initialRecord: record
    })

    onClose?.()
  }

  const handleMoveClick = () => {
    const VersionBasedMoveFolderModalContent = isV2()
      ? MoveFolderModalContentV2
      : MoveFolderModalContent

    setModal(html`
      <${VersionBasedMoveFolderModalContent} records=${[record]} />
    `)

    onClose?.()
  }

  const v2Actions = [
    { name: i18n._('Select element'), type: 'select', click: handleSelect },
    { name: i18n._('Edit'), type: 'edit', click: handleEdit },
    {
      name: i18n._(
        record?.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'
      ),
      type: 'favorite',
      click: handleFavoriteToggle
    },
    {
      name: i18n._('Move to Another Folder'),
      type: 'move',
      click: handleMoveClick
    },
    { name: i18n._('Delete Item'), type: 'delete', click: handleDelete }
  ]

  const v1Actions = [
    { name: i18n._('Select element'), type: 'select', click: handleSelect },
    {
      name: i18n._(
        record?.isFavorite ? 'Remove from Favorites' : 'Mark as favorite'
      ),
      type: 'favorite',
      click: handleFavoriteToggle
    },
    {
      name: i18n._('Move to another folder'),
      type: 'move',
      click: handleMoveClick
    },
    { name: i18n._('Delete element'), type: 'delete', click: handleDelete }
  ]

  const defaultActions = isV2() ? v2Actions : v1Actions

  const filteredActions = excludeTypes.length
    ? defaultActions.filter((action) => !excludeTypes.includes(action.type))
    : defaultActions

  return { actions: filteredActions }
}
