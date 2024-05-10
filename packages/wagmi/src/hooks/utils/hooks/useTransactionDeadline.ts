import { TTLStorageKey, useTTL } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import { ChainId, chainsL2 } from 'sushi/chain'
import { useCurrentBlockTimestamp } from '../../block'

const L2_TTL = 5n
const TTL = 30n

export const getDefaultTTL = (chainId: ChainId) => {
  return Object.keys(chainsL2).includes(chainId.toString()) ? L2_TTL : TTL
}

interface UseTransactionDeadline {
  chainId: ChainId
  enabled?: boolean
  storageKey: TTLStorageKey
}

export const useTransactionDeadline = ({
  chainId,
  enabled = true,
  storageKey,
}: UseTransactionDeadline) => {
  const { data: currentBlockTimestampQuery } = useCurrentBlockTimestamp(
    chainId,
    enabled,
  )

  const [_ttl] = useTTL(storageKey)

  // currentBlockTimestampQuery is excluded from the dependencies array by design,
  // deadline should be updated every 60s, not on every block
  return useQuery({
    queryKey: ['useTransactionDeadline', _ttl],
    queryFn: () => {
      const blockTimestamp = currentBlockTimestampQuery
      let data = undefined

      const ttl = _ttl > 0 ? BigInt(_ttl) : getDefaultTTL(chainId)

      if (blockTimestamp) {
        data = blockTimestamp + ttl * 60n
      }

      return data
    },
    refetchInterval: 60_000,
    enabled: Boolean(enabled && currentBlockTimestampQuery),
  })
}
