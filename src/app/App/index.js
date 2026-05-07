import { useState, useCallback, useEffect } from 'react'

import { useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { html } from 'htm/react'

import { appConfig } from './appConfig'
import { useInactivity } from './hooks/useInactivity'
import { useOnExtensionExit } from './hooks/useOnExtensionExit'
import { useOnExtensionLockOut } from './hooks/useOnExtensionLockOut'
import { useRedirect } from './hooks/useRedirect'
import { TitleBar } from '../../components/TitleBar'
import { AppHeaderContainer } from '../../containers/AppHeaderContainer'
import { useRouter } from '../../context/RouterContext'
import { usePearUpdate } from '../../hooks/usePearUpdate'
import { useSimulatedLoading } from '../../hooks/useSimulatedLoading'
import { useVaultAccessRevoked } from '../../hooks/useVaultAccessRevoked'
import { Routes } from '../Routes'
import { ContentFrame, WindowBackground } from './styles'
import { isV2 } from '../../utils/designVersion'

export const App = () => {
  const { theme } = useTheme()
  const { currentPage } = useRouter()
  usePearUpdate()
  const isSimulatedLoading = useSimulatedLoading()
  const [isLoadingPageComplete, setIsLoadingPageComplete] = useState(false)

  useInactivity()
  const { isLoading: isDataLoading } = useRedirect()

  useOnExtensionExit()
  useOnExtensionLockOut()

  const { triggerAccessRevoked } = useVaultAccessRevoked()
  useEffect(() => {
    // Dev hook: action-bus mechanism is not implemented yet, so for now the
    // delete handler is fired manually from devtools or tests.
    if (typeof window === 'undefined') return
    // eslint-disable-next-line no-underscore-dangle
    window.__pearpassTriggerAccessRevoked = triggerAccessRevoked
    return () => {
      // eslint-disable-next-line no-underscore-dangle
      delete window.__pearpassTriggerAccessRevoked
    }
  }, [triggerAccessRevoked])

  const handleLoadingComplete = useCallback(() => {
    setIsLoadingPageComplete(true)
  }, [])

  const showLoadingPage = isV2()
    ? isDataLoading || !isLoadingPageComplete
    : !isSimulatedLoading && (isDataLoading || !isLoadingPageComplete)

  if (isV2()) {
    const useLogoTitleBar = appConfig.headerWithLogo.includes(currentPage)
    return html`
      <${WindowBackground} $backgroundColor=${theme.colors.colorBackground}>
        ${useLogoTitleBar
          ? html`<${TitleBar} />`
          : html`<${AppHeaderContainer} />`}
        <${ContentFrame}
          $backgroundColor=${theme.colors.colorBackground}
          $borderColor=${theme.colors.colorBorderPrimary}
        >
          <${Routes}
            isSplashScreenShown=${false}
            isDataLoading=${showLoadingPage}
            onLoadingComplete=${handleLoadingComplete}
          />
        <//>
      <//>
    `
  }

  return html`
    <${Routes}
      isSplashScreenShown=${isSimulatedLoading}
      isDataLoading=${showLoadingPage}
      onLoadingComplete=${handleLoadingComplete}
    />
  `
}
