import { useQuery } from '@tanstack/react-query'
import { ChainId } from 'sushi/chain'
import { useSquid } from './useSquid'

export const useAxelarScanLink = ({
  tradeId,
  network0,
  network1,
  txHash,
  enabled,
}: {
  tradeId: string
  network0: ChainId
  network1: ChainId
  txHash: string | undefined
  enabled?: boolean
}) => {
  const { data: squid } = useSquid()

  return useQuery({
    queryKey: ['axelarScanLink', { txHash, network0, network1, tradeId }],
    queryFn: async () => {
      if (txHash && squid) {
        return squid.getStatus({ transactionId: txHash }).then((data) => ({
          link: data.axelarTransactionUrl,
          status: data.squidTransactionStatus,
          dstTxHash: data.toChain?.transactionId,
        }))
      }

      return {
        link: undefined,
        status: undefined,
        dstTxHash: undefined,
      }
    },
    refetchInterval: 2000,
    enabled: enabled && !!txHash,
  })
}
