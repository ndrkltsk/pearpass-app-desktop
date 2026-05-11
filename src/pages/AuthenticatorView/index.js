import { useMemo } from 'react'

import { useLingui } from '@lingui/react'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider'
import {
  useRecords,
  isExpiring,
  groupOtpRecords,
  RECORD_TYPES
} from '@tetherto/pearpass-lib-vault'
import { html } from 'htm/react'

import {
  EmptyState,
  EmptyStateCTAs,
  EmptyStateDescription,
  EmptyStatePrimaryButton,
  EmptyStateSecondaryButton,
  EmptyStateTextGroup,
  GroupDivider,
  GroupHeader,
  GroupLabel,
  GroupLabelText,
  GroupTimeValue,
  ListWrapper,
  Title,
  Wrapper
} from './styles'
import { Record } from '../../components/Record'
import { TimerCircle } from '../../components/TimerCircle'
import { useAppHeaderContext } from '../../context/AppHeaderContext'
import { useRouter } from '../../context/RouterContext'
import { useCreateOrEditRecord } from '../../hooks/useCreateOrEditRecord'
import {
  AuthenticatorIllustration,
  PlusIcon,
  SaveIcon
} from '../../lib-react-components'

export const AuthenticatorView = () => {
  const { i18n } = useLingui()
  const { navigate } = useRouter()
  const { handleCreateOrEditRecord } = useCreateOrEditRecord()
  const { searchValue } = useAppHeaderContext()

  const { data: records } = useRecords({
    shouldSkip: true,
    variables: {
      filters: {
        hasOtp: true,
        searchPattern: searchValue
      },
      sort: { key: 'updatedAt', direction: 'desc' }
    }
  })

  // Client-side filter as safety net
  const otpRecords = useMemo(
    () => (records || []).filter((r) => r.otpPublic),
    [records]
  )

  const handleRecordClick = (record) => {
    // Stay in authenticator view, just open the sidebar
    navigate('vault', {
      recordId: record.id,
      recordType: RECORD_TYPES.OTP
    })
  }

  const { totpGroups, hotpRecords } = useMemo(
    () => groupOtpRecords(otpRecords),
    [otpRecords]
  )

  return html`
    <${Wrapper}>
      ${otpRecords.length === 0
        ? html`
            <${EmptyState}>
              <${AuthenticatorIllustration} width="100%" height="151" />

              <${EmptyStateTextGroup}>
                <${Title}>${i18n._('No codes saved')}<///>
                <${EmptyStateDescription}>
                  ${i18n._(
                    'Save your first authenticator code or import your codes from another authenticator app.'
                  )}
                <//>
              <//>

              <${EmptyStateCTAs}>
                <${EmptyStatePrimaryButton}
                  onClick=${() => handleCreateOrEditRecord({ recordType: RECORD_TYPES.OTP })}
                >
                  <${PlusIcon} size="16" color=${colors.grey500.mode1} />
                  ${i18n._('Add Code')}
                <//>
                <${EmptyStateSecondaryButton}
                  onClick=${() => navigate('settings', { initialTab: 'vault' })}
                >
                  <${SaveIcon} size="16" color=${colors.primary400.mode1} />
                  ${i18n._('Import Codes')}
                <//>
              <//>
            <//>
          `
        : html`
            <${ListWrapper}>
              ${totpGroups.map(
                ({ period, records: groupRecords }, groupIndex) => {
                  const timeRemaining =
                    groupRecords[0]?.otpPublic?.timeRemaining ?? null

                  const expiring = isExpiring(timeRemaining)

                  return html`
                    <div key=${period}>
                      ${groupIndex > 0 && html`<${GroupDivider} />`}
                      <${GroupHeader}>
                        <${TimerCircle}
                          timeRemaining=${timeRemaining}
                          period=${period}
                        />
                        <${GroupLabel}>
                          <${GroupLabelText}>
                            ${i18n._('Codes expiring in')}${' '}
                          <//>
                          <${GroupTimeValue} $expiring=${expiring}>
                            ${timeRemaining !== null
                              ? `${timeRemaining}s`
                              : `${period}s`}
                          <//>
                        <//>
                      <//>

                      ${groupRecords.map(
                        (record) => html`
                          <${Record}
                            key=${record.id}
                            testId="authenticator-record-item"
                            dataId=${`${record.type}-list-item`}
                            record=${record}
                            otpCode=${record.otpPublic?.currentCode ?? null}
                            onClick=${() => handleRecordClick(record)}
                            onSelect=${() => {}}
                          />
                        `
                      )}
                    </div>
                  `
                }
              )}
              ${hotpRecords.length > 0 &&
              html`
                <div>
                  ${totpGroups.length > 0 && html`<${GroupDivider} />`}
                  <${GroupHeader}>
                    <${GroupLabel}>
                      <${GroupLabelText}> ${i18n._('Counter-based')} <//>
                    <//>
                  <//>

                  ${hotpRecords.map(
                    (record) => html`
                      <${Record}
                        key=${record.id}
                        testId="authenticator-record-item"
                        dataId=${`${record.type}-list-item`}
                        record=${record}
                        otpCode=${record.otpPublic?.currentCode ?? null}
                        onClick=${() => handleRecordClick(record)}
                        onSelect=${() => {}}
                      />
                    `
                  )}
                </div>
              `}
            <//>
          `}
    <//>
  `
}
