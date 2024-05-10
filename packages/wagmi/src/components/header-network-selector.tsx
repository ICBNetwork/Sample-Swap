import { useIsMounted } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui/components/button'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import {
  NetworkSelector,
  NetworkSelectorOnSelectCallback,
} from '@sushiswap/ui/components/network-selector'
import { createErrorToast } from '@sushiswap/ui/components/toast'
import React, { FC, Suspense, useCallback } from 'react'
import { Chain, ChainId } from 'sushi/chain'
import { ProviderRpcError, UserRejectedRequestError } from 'viem'
import { useChainId, useSwitchChain } from 'wagmi'

export const HeaderNetworkSelector: FC<{
  networks: ChainId[]
  selectedNetwork?: ChainId
  onChange?(chainId: ChainId): void
}> = ({ networks, selectedNetwork, onChange }) => {
  const isMounted = useIsMounted()
  const { switchChainAsync } = useSwitchChain()
  const chainId = useChainId()

  const onSwitchNetwork = useCallback<NetworkSelectorOnSelectCallback>(
    async (el, close) => {
      console.debug('onSwitchNetwork', el)
      try {
        if (switchChainAsync && chainId !== el) {
          await switchChainAsync({ chainId: el })
        }

        if (selectedNetwork !== el && onChange) {
          onChange(el)
        }

        close()
      } catch (e) {
        console.error(`Failed to switch network: ${e}`)
        if (e instanceof UserRejectedRequestError) return
        if (e instanceof ProviderRpcError) {
          createErrorToast(e.message, true)
        }
      }
    },
    [chainId, onChange, selectedNetwork, switchChainAsync],
  )

  const selected = isMounted
    ? selectedNetwork || chainId || ChainId.ETHEREUM
    : ChainId.ETHEREUM

  return (
    <NetworkSelector
      showAptos
      selected={selected}
      onSelect={onSwitchNetwork}
      networks={networks}
    >
      <Button variant="secondary" testId="network-selector">
        <Suspense fallback={null}>
          <NetworkIcon chainId={selected} width={20} height={20} />
          <div className="hidden xl:block">{Chain.from(selected)?.name}</div>
        </Suspense>
      </Button>
    </NetworkSelector>
  )
}
