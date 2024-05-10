'use client'

import { SlippageToleranceStorageKey, useLocalStorage } from '@sushiswap/hooks'
import { useMemo } from 'react'
import { Percent } from 'sushi/math'

export const useSlippageTolerance = (
  key: SlippageToleranceStorageKey = SlippageToleranceStorageKey.Swap,
) => {
  const [slippageTolerance, setSlippageTolerance] = useLocalStorage<
    number | string
  >(key, 0.1)

  return useMemo(
    () =>
      [
        new Percent(
          Math.floor(
            Number(slippageTolerance === 'AUTO' ? '0.1' : slippageTolerance) *
              100,
          ),
          10_000,
        ),
        setSlippageTolerance,
      ] as const,
    [slippageTolerance, setSlippageTolerance],
  )
}
