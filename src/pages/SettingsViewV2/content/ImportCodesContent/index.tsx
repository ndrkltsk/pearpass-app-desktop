import {
  ListItem,
  PageHeader,
  Text,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { KeyboardArrowRightFilled } from '@tetherto/pearpass-lib-ui-kit/icons'

import { useTranslation } from '../../../../hooks/useTranslation'
import { createStyles } from './styles'

type ImportCodesOption = {
  title: string
  description: string
  accepts: string[]
  testID?: string
}

const importCodesOptions: ImportCodesOption[] = [
  {
    title: 'Google Authenticator',
    description: 'PNG, JPG, JPEG',
    accepts: ['.png', '.jpg', '.jpeg'],
    testID: 'settings-import-codes-google-authenticator'
  }
]

export const ImportCodesContent = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = createStyles(theme.colors)

  return (
    <div style={styles.container}>
      <PageHeader
        as="h1"
        title={t('Import')}
        subtitle={t(
          'To import data from another authenticator, first access the authenticator, export your data, and then upload the exported file into the designated field'
        )}
      />

      <div style={styles.listWrapper}>
        <Text color={theme.colors.colorTextSecondary} variant="caption">
          {t('Select Import Source')}
        </Text>

        <div style={styles.listItems}>
          {importCodesOptions.map((option, index) => (
            <div
              key={option.title}
              style={
                index < importCodesOptions.length - 1
                  ? styles.listItemBorder
                  : undefined
              }
            >
              <ListItem
                title={option.title}
                subtitle={t('Required Format: {format}', {
                  format: option.description
                })}
                testID={option.testID}
                rightElement={
                  <KeyboardArrowRightFilled
                    width={16}
                    height={16}
                    color={theme.colors.colorTextPrimary}
                  />
                }
                onClick={() => {
                  // TODO: handle selection
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
