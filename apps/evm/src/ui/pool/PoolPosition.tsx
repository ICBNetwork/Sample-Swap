'use client'

import { Pool } from '@sushiswap/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui/components/card'
import { FC } from 'react'
import { formatUSD } from 'sushi/format'

import { SkeletonText } from '@sushiswap/ui'
import { ConnectButton, useAccount } from '@sushiswap/wagmi'
import { PoolPositionDesktop } from './PoolPositionDesktop'
import { usePoolPosition } from './PoolPositionProvider'
import { PoolPositionStakedDesktop } from './PoolPositionStakedDesktop'
import { usePoolPositionStaked } from './PoolPositionStakedProvider'

interface PoolPositionProps {
  pool: Pool
}

const PoolPositionDisconnected: FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Position</CardTitle>
      </CardHeader>
      <CardContent>
        <ConnectButton fullWidth variant="secondary" />
      </CardContent>
    </Card>
  )
}

const PoolPositionConnected: FC<PoolPositionProps> = ({ pool }) => {
  const { value0, value1, isLoading: isUnstakedLoading } = usePoolPosition()
  const {
    value0: stakedValue0,
    value1: stakedValue1,
    isLoading: isStakedLoading,
  } = usePoolPositionStaked()

  const isLoading = isUnstakedLoading || isStakedLoading

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Position</CardTitle>
        <CardDescription>
          {isLoading ? (
            <SkeletonText className="w-[ch-16]" />
          ) : (
            <>{formatUSD(value0 + value1 + stakedValue0 + stakedValue1)}</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PoolPositionDesktop pool={pool} />
        <PoolPositionStakedDesktop pool={pool} />
      </CardContent>
    </Card>
  )
}

export const PoolPosition: FC<PoolPositionProps> = ({ pool }) => {
  const { address } = useAccount()

  if (!address) {
    return <PoolPositionDisconnected />
  }

  return <PoolPositionConnected pool={pool} />
}
