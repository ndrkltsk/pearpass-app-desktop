import React, { useState } from 'react'

import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import {
  AlertMessage,
  Button,
  Dialog,
  Form,
  Link,
  PasswordField,
  Text,
  ToggleSwitch
} from '@tetherto/pearpass-lib-ui-kit'
import { useUserData, useVault } from '@tetherto/pearpass-lib-vault'
import {
  clearBuffer,
  stringToBuffer
} from '@tetherto/pearpass-lib-vault/src/utils/buffer'

import { createStyles } from './DeleteVaultModalContentV2.styles'
import { useModal } from '../../../context/ModalContext'
import { useTranslation } from '../../../hooks/useTranslation'
import { PairedDevicesModalContent } from '../PairedDevicesModalContent'

export type DeleteVaultModalContentV2Props = {
  vaultId: string
  vaultName: string
  onClose?: () => void
}

export const DeleteVaultModalContentV2 = ({
  vaultName,
  onClose
}: DeleteVaultModalContentV2Props) => {
  const { t } = useTranslation()
  const styles = createStyles()
  const { closeModal, setModal } = useModal()

  const handleClose = onClose ?? closeModal

  const { data: vaultData } = useVault()
  const devices = (vaultData as { devices?: unknown[] } | undefined)?.devices
  const deviceCount = Array.isArray(devices) ? devices.length : 0

  const { logIn } = useUserData()

  const [eraseFromAllDevices, setEraseFromAllDevices] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const schema = Validator.object({
    masterPassword: Validator.string().required(t('Master password is required'))
  })

  const { register, handleSubmit, setErrors, values } = useForm({
    initialValues: { masterPassword: '' },
    validate: (formValues: { masterPassword: string }) =>
      schema.validate(formValues)
  })

  const { onChange: onChangeMasterPassword, ...masterPasswordFieldProps } =
    register('masterPassword')
  const masterPasswordError = masterPasswordFieldProps.error || undefined

  const onSubmit = async (formValues: { masterPassword: string }) => {
    if (isLoading) return

    if (!formValues.masterPassword) {
      setErrors({ masterPassword: t('Master password is required') })
      return
    }

    setSubmitError(null)
    const passwordBuffer = stringToBuffer(formValues.masterPassword)

    try {
      setIsLoading(true)
      await logIn({ password: passwordBuffer })
      setIsLoading(false)
      // TODO: master password validated. Run delete-vault flow:
      // - eraseFromAllDevices=false → run deleteVaultLocal(vaultId)
      // - eraseFromAllDevices=true  → write actions/queue/{writerKey}/... per
      //   other device, then deleteVaultLocal(vaultId).
    } catch {
      setIsLoading(false)
      setSubmitError(t('Invalid master password'))
    } finally {
      clearBuffer(passwordBuffer)
    }
  }

  const isSubmitDisabled = !values.masterPassword || isLoading

  return (
    <Dialog
      title={t('Delete {vaultName}', { vaultName })}
      onClose={handleClose}
      testID="delete-vault-dialog-v2"
      closeButtonTestID="delete-vault-close-v2"
      footer={
        <>
          <Button
            variant="secondary"
            size="small"
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            data-testid="delete-vault-discard-v2"
          >
            {t('Discard')}
          </Button>
          <Button
            variant="destructive"
            size="small"
            type="button"
            disabled={isSubmitDisabled}
            isLoading={isLoading}
            onClick={() => handleSubmit(onSubmit)()}
            data-testid="delete-vault-submit-v2"
          >
            {t('Delete')}
          </Button>
        </>
      }
    >
      <Form
        onSubmit={handleSubmit(onSubmit)}
        style={styles.form as React.ComponentProps<typeof Form>['style']}
        testID="delete-vault-form-v2"
      >
        <Text
          as="p"
          variant="label"
          data-testid="delete-vault-description-v2"
        >
          {t(
            'Are you sure you want to delete "{vaultName}"? All items in this vault will be permanently deleted. This cannot be undone.',
            { vaultName }
          )}
        </Text>

        <PasswordField
          label={t('Confirm With Master Password')}
          placeholder={t('Enter Master Password to Confirm Deletion')}
          {...masterPasswordFieldProps}
          onChange={(e) => {
            onChangeMasterPassword(e.target.value)
            if (submitError) setSubmitError(null)
          }}
          error={masterPasswordError}
          testID="delete-vault-password-v2"
        />

        <div style={styles.eraseRow}>
          <div style={styles.eraseLabel}>
            <Text as="span" variant="label">
              {t('Erase Vault from all the')}
            </Text>
            <span style={styles.eraseLink}>
              <Link
                onClick={() => setModal(<PairedDevicesModalContent />)}
                data-testid="delete-vault-eraseall-link-v2"
              >
                {t('{count} devices', { count: deviceCount })}
              </Link>
            </span>
            <Text as="span" variant="label">
              {t('with access')}
            </Text>
          </div>
          <ToggleSwitch
            checked={eraseFromAllDevices}
            onChange={setEraseFromAllDevices}
            aria-label={t('Erase vault from all devices')}
            data-testid="delete-vault-eraseall-toggle-v2"
          />
        </div>

        {eraseFromAllDevices ? (
          <AlertMessage
            variant="warning"
            size="small"
            title=""
            description={t(
              'The removal will take effect on all other devices the next time they access this vault.'
            )}
            testID="delete-vault-eraseall-alert-v2"
          />
        ) : null}

        {submitError ? (
          <AlertMessage
            variant="error"
            size="small"
            title=""
            description={submitError}
            testID="delete-vault-error-alert-v2"
          />
        ) : null}
      </Form>
    </Dialog>
  )
}
