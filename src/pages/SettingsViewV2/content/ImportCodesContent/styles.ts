import type { ThemeColors } from '@tetherto/pearpass-lib-ui-kit'
import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = (colors: ThemeColors) => ({
  container: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: `${rawTokens.spacing24}px`
  },

  listWrapper: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: `${rawTokens.spacing4}px`
  },

  listItems: {
    border: `1px solid ${colors.colorSurfaceDisabled}`,
    borderRadius: `${rawTokens.spacing8}px`
  },

  listItemBorder: {
    borderBottom: `1px solid ${colors.colorSurfaceDisabled}`
  }
})
