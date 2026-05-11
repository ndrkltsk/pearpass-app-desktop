import React from 'react'

import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import {
  AttachmentField as UiKitAttachmentField,
  Button,
  Dialog,
  Form,
  InputField,
  MultiSlotInput,
  PasswordField,
  Text,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { RECORD_TYPES } from '@tetherto/pearpass-lib-vault'
import { useCreateRecord, useRecords } from '@tetherto/pearpass-lib-vault'
import {
  Add,
  TrashOutlined,
  UploadFileFilled
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { html } from 'htm/react'
import { createStyles } from './CreateOrEditAuthenticatorModalContent.styles'
import { ATTACHMENTS_FIELD_KEY } from '../../../../constants/formFields'
import { useGlobalLoading } from '../../../../context/LoadingContext'
import { useModal } from '../../../../context/ModalContext'
import { useToast } from '../../../../context/ToastContext'
import { useTranslation } from '../../../../hooks/useTranslation'
import { useGetMultipleFiles } from '../../../../hooks/useGetMultipleFiles'
import { getFilteredAttachmentsById } from '../../../../utils/getFilteredAttachmentsById'
import { handleFileSelect } from '../../../../utils/handleFileSelect'
import { UploadFilesModalContentV2 } from '../../UploadFilesModalContentV2'

export type CreateOrEditAuthenticatorModalContentProps = {
  initialRecord?: {
    data: {
      title: string
      note: string
      attachments: { id: string; name: string }[]
      [key: string]: unknown
    }
    folder?: string
    isFavorite?: boolean
    attachments?: { id: string; name: string }[]
    [key: string]: unknown
  }
  selectedFolder?: string
  isFavorite?: boolean
  onTypeChange?: (type: string) => void
}

export const CreateOrEditAuthenticatorModalContent = ({
  initialRecord,
  selectedFolder,
  isFavorite
}: CreateOrEditAuthenticatorModalContentProps) => {
  const { t } = useTranslation()
  const { closeModal, setModal } = useModal()
  const { theme } = useTheme()
  const styles = createStyles()
  const { setToast } = useToast()

  const { createRecord, isLoading: isCreateLoading } = useCreateRecord({
    onCompleted: () => {
      closeModal()
      setToast({ message: t('Record created successfully') })
    }
  })

  const { updateRecords, isLoading: isUpdateLoading } = useRecords({
    onCompleted: () => {
      closeModal()
      setToast({ message: t('Record updated successfully') })
    }
  })

  const onError = (error: { message: string }) => {
    setToast({ message: error.message })
  }

  const isLoading = isCreateLoading || isUpdateLoading

  useGlobalLoading({ isLoading })

  const schema = Validator.object({
    title: Validator.string().required(t('Title is required')),
    otpSecret: Validator.string(),
    note: Validator.string(),
    attachments: Validator.array().items(
      Validator.object({
        id: Validator.string(),
        name: Validator.string().required()
      })
    )
  })

  const { register, handleSubmit, values, setValue } = useForm({
    initialValues: {
      title: initialRecord?.data?.title ?? '',
      otpSecret:
        initialRecord?.data?.otpInput ??
        (initialRecord?.data?.otp as { secret?: string } | undefined)?.secret ??
        '',
      note: initialRecord?.data?.note ?? '',
      attachments: initialRecord?.attachments ?? []
    },
    validate: (formValues: Record<string, unknown>) =>
      schema.validate(formValues)
  })

  useGetMultipleFiles({
    fieldNames: [ATTACHMENTS_FIELD_KEY],
    updateValues: setValue,
    initialRecord
  })

  const onSubmit = (formValues: Record<string, unknown>) => {
    const otpInput = (formValues.otpSecret as string)?.trim() || undefined

    const data = {
      type: RECORD_TYPES.LOGIN,
      folder: selectedFolder ?? initialRecord?.folder,
      isFavorite: initialRecord?.isFavorite ?? isFavorite,
      data: {
        ...(initialRecord?.data ? initialRecord.data : {}),
        title: formValues.title,
        note: formValues.note,
        attachments: formValues.attachments,
        otpInput
      }
    }

    if (initialRecord) {
      updateRecords([{ ...initialRecord, ...data }], onError)
    } else {
      createRecord(data, onError)
    }
  }

  const handleFileLoad = () => {
    setModal(
      html`<${UploadFilesModalContentV2}
        type=${'file'}
        onFilesSelected=${(files: File[]) =>
          handleFileSelect({
            files: files as unknown as FileList,
            fieldName: ATTACHMENTS_FIELD_KEY,
            setValue,
            values
          })}
      />`
    )
  }

  const isEdit = !!initialRecord

  const titleField = register('title')
  const otpSecretField = register('otpSecret')
  const noteField = register('note')

  return (
    <Dialog
      title={
        isEdit
          ? t('Edit Authenticator Code Item')
          : t('New Authenticator Code Item')
      }
      onClose={closeModal}
      testID='createoredit-authenticator-dialog'
      closeButtonTestID='createoredit-authenticator-close'
      footer={
        <>
          <Button
            variant='secondary'
            size='small'
            type='button'
            onClick={closeModal}
            data-testid='createoredit-authenticator-button-discard'
          >
            {t('Discard')}
          </Button>
          <Button
            variant='primary'
            size='small'
            type='button'
            disabled={isLoading || (!isEdit && !values.title?.trim())}
            isLoading={isLoading}
            onClick={() => handleSubmit(onSubmit)()}
            data-testid='createoredit-authenticator-button-save'
          >
            {isEdit ? t('Save') : t('Add Item')}
          </Button>
        </>
      }
    >
      <Form
        onSubmit={handleSubmit(onSubmit)}
        style={styles.form as React.ComponentProps<typeof Form>['style']}
        testID='createoredit-authenticator-form'
      >
        <InputField
          label={t('Title')}
          placeholder={t('Enter Title')}
          value={titleField.value}
          onChange={(e) => titleField.onChange(e.target.value)}
          error={titleField.error || undefined}
          testID='createoredit-authenticator-input-title'
        />

        <MultiSlotInput testID='createoredit-authenticator-otp-slot'>
          <PasswordField
            label={t('Authenticator Secret Key')}
            placeholder={t('Enter Secret Key (TOTP)')}
            value={otpSecretField.value}
            onChange={(e) => otpSecretField.onChange(e.target.value)}
            error={otpSecretField.error || undefined}
            testID='createoredit-authenticator-input-otpsecret'
          />
        </MultiSlotInput>

        <div style={styles.sectionLabel}>
          <Text variant='caption' color={theme.colors.colorTextSecondary}>
            {t('Additional')}
          </Text>
        </div>

        <MultiSlotInput testID='createoredit-authenticator-comment-slot'>
          <InputField
            label={t('Comment')}
            placeholder={t('Enter Comment')}
            value={noteField.value}
            onChange={(e) => noteField.onChange(e.target.value)}
            error={noteField.error || undefined}
            testID='createoredit-authenticator-input-comment'
          />
        </MultiSlotInput>

        <MultiSlotInput
          testID='createoredit-authenticator-attachments-slot'
          actions={
            <Button
              variant='tertiaryAccent'
              size='small'
              type='button'
              iconBefore={<Add width={16} height={16} />}
              onClick={handleFileLoad}
              data-testid='createoredit-authenticator-button-addattachment'
            >
              {t('Add Another Attachment')}
            </Button>
          }
        >
          {values.attachments.length > 0
            ? values.attachments.map(
                (
                  attachment: {
                    id?: string
                    tempId?: string
                    name: string
                  },
                  index: number
                ) => (
                  <UiKitAttachmentField
                    key={attachment.id || attachment.tempId}
                    label={t('Attachment')}
                    value={attachment.name}
                    testID={`createoredit-authenticator-attachment-${index}`}
                    rightSlot={
                      <Button
                        variant='tertiary'
                        size='small'
                        type='button'
                        aria-label={t('Delete File')}
                        iconBefore={
                          <TrashOutlined
                            width={16}
                            height={16}
                            color={theme.colors.colorTextPrimary}
                          />
                        }
                        onClick={() =>
                          setValue(
                            ATTACHMENTS_FIELD_KEY,
                            getFilteredAttachmentsById(
                              values.attachments,
                              attachment
                            )
                          )
                        }
                        data-testid={`createoredit-authenticator-button-deleteattachment-${index}`}
                      />
                    }
                  />
                )
              )
            : null}
          <UiKitAttachmentField
            label={t('Attachment')}
            placeholder={t('Add or Drop File / Photos')}
            onClick={handleFileLoad}
            testID='createoredit-authenticator-attachment-upload'
            rightSlot={
              <UploadFileFilled
                width={16}
                height={16}
                color={theme.colors.colorTextPrimary}
              />
            }
          />
        </MultiSlotInput>
      </Form>
    </Dialog>
  )
}
