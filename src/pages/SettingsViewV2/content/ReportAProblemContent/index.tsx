import React, { useCallback, useState } from 'react'

import {
  sendGoogleFormFeedback,
  sendSlackFeedback
} from '@tetherto/pear-apps-lib-feedback'
import {
  Button,
  Form,
  TextArea,
  PageHeader
} from '@tetherto/pearpass-lib-ui-kit'
import { Send } from '@tetherto/pearpass-lib-ui-kit/icons'

import {
  GOOGLE_FORM_KEY,
  GOOGLE_FORM_MAPPING,
  SLACK_WEBHOOK_URL_PATH
} from '../../../../constants/feedback'
import { useGlobalLoading } from '../../../../context/LoadingContext'
import { useToast } from '../../../../context/ToastContext'
import { useTranslation } from '../../../../hooks/useTranslation'
import { isOnline } from '../../../../utils/isOnline'
import { logger } from '../../../../utils/logger'
import { createStyles } from './styles'

const OFFLINE_TIMEOUT = 'OFFLINE_TIMEOUT'
const OFFLINE_TIMEOUT_MS = 10000
const OFFLINE_TIMEOUT_MESSAGE =
  'You are offline, please check your internet connection'

const TEST_IDS = {
  root: 'settings-card-report',
  textarea: 'settings-report-textarea',
  send: 'settings-report-send-button'
} as const

type ReportAProblemContentProps = {
  currentVersion?: string
}

export const ReportAProblemContent = ({
  currentVersion = ''
}: ReportAProblemContentProps) => {
  const { t } = useTranslation()
  const { setToast } = useToast()
  const styles = createStyles()

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useGlobalLoading({ isLoading })

  const handleSend = useCallback(async () => {
    if (!message?.trim() || isLoading) {
      return
    }
    setIsLoading(true)
    try {
      if (!isOnline()) {
        setToast({
          message: t(OFFLINE_TIMEOUT_MESSAGE)
        })
        return
      }

      const nav = navigator as Navigator & {
        userAgentData?: { platform?: string }
      }

      const payload = {
        message: message.trim(),
        topic: 'BUG_REPORT' as const,
        app: 'DESKTOP' as const,
        operatingSystem: nav.userAgentData?.platform,
        deviceModel: nav.platform,
        appVersion: currentVersion || undefined
      }

      const sendFeedbackWithTimeout = async () => {
        await sendSlackFeedback({
          webhookUrPath: SLACK_WEBHOOK_URL_PATH,
          ...payload
        })

        await sendGoogleFormFeedback({
          formKey: GOOGLE_FORM_KEY,
          mapping: GOOGLE_FORM_MAPPING,
          ...payload
        })
      }

      await Promise.race([
        sendFeedbackWithTimeout(),
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            if (!isOnline()) {
              reject(new Error(OFFLINE_TIMEOUT))
            }
          }, OFFLINE_TIMEOUT_MS)
        })
      ])

      setMessage('')

      setToast({
        message: t('Feedback sent')
      })
    } catch (error) {
      if (error instanceof Error && error.message === OFFLINE_TIMEOUT) {
        setToast({
          message: t(OFFLINE_TIMEOUT_MESSAGE)
        })
      } else {
        setToast({
          message: t('Something went wrong, please try again')
        })
      }

      logger.error('ReportAProblemContent', 'Error sending feedback:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentVersion, isLoading, message, setToast, t])

  const canSend = message.trim().length > 0 && !isLoading

  return (
    <div data-testid={TEST_IDS.root} style={styles.root}>
      <PageHeader
        title={t('Report a problem')}
        subtitle={t(
          'Please describe the problem you’re experiencing. Our team reviews every report to help improve the app.'
        )}
      />
      <Form
        testID="settings-report-problem-form"
        aria-label={t('Report a problem')}
      >
        <TextArea
          testID={TEST_IDS.textarea}
          label={t('Report a problem')}
          placeholder={t('Write your issue')}
          value={message}
          onChange={setMessage}
          disabled={isLoading}
          rows={8}
        />

        <div style={styles.actions}>
          <Button
            data-testid={TEST_IDS.send}
            variant="primary"
            size="small"
            isLoading={isLoading}
            disabled={!canSend}
            onClick={() => {
              void handleSend()
            }}
            iconBefore={<Send />}
          >
            {t('Send')}
          </Button>
        </div>
      </Form>
    </div>
  )
}
