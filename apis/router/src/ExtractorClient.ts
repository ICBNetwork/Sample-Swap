// import EventEmitter from 'node:events'
import { Logger } from '@sushiswap/extractor'
import { IncrementalPricer } from 'sushi'
import { ChainId } from 'sushi/chain'
import {
  ADDITIONAL_BASES,
  BASES_TO_CHECK_TRADES_AGAINST,
  STABLES,
} from 'sushi/config'
import { Native, Token, Type } from 'sushi/currency'
import { PoolCode, deserializePoolsBinary } from 'sushi/router'
import { deserializePoolCodesJSON } from 'sushi/serializer'
import { Address } from 'viem'

const DEBUG_PRINT = false

function tokenAddr(t: Type) {
  return t.isNative ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : t.address
}

function tokenId(t: string | Type) {
  if (typeof t === 'string') return t.toLowerCase()
  if (t.isNative) return '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  return t.address.toLowerCase()
}

function tokenPairId(t0: string | Type, t1: string | Type) {
  const id0 = tokenId(t0)
  const id1 = tokenId(t1)
  return id0 < id1 ? id0 + id1 : id1 + id0
}

export class ExtractorClient {
  chainId: ChainId
  extractorServer: string
  poolUpdateInterval: number
  requestedPairsUpdateInterval: number
  lastUpdatedTimestamp = 0
  tokenMap: Map<string, Token> = new Map()
  poolCodesMap: Map<string, PoolCode[]> = new Map()
  totalPoolNumber = 0
  requestedPairs: Map<string, Set<string>> = new Map()
  fetchPoolsBetweenRequests: Set<string> = new Set()
  dataStateId = 0
  pricer: IncrementalPricer

  constructor(
    chainId: ChainId,
    extractorServer: string,
    poolUpdateInterval: number,
    requestedPairsUpdateInterval: number,
  ) {
    this.chainId = chainId
    this.extractorServer = extractorServer
    this.poolUpdateInterval = poolUpdateInterval
    this.requestedPairsUpdateInterval = requestedPairsUpdateInterval
    this.pricer = new IncrementalPricer(
      STABLES[chainId as keyof typeof STABLES].slice() ?? [],
      STABLES[chainId as keyof typeof STABLES].map((_) => 1),
      1000,
    )
  }

  get ready() {
    return this.lastUpdatedTimestamp !== 0
  }

  start() {
    this.updatePools()
    this.updateRequestedPairs()
  }

  async updatePools() {
    try {
      const url = `${this.extractorServer}/pool-codes-bin/${this.chainId}?stateId=${this.dataStateId}`
      if (DEBUG_PRINT) console.log(url)
      const resp = await fetch(url)
      if (resp.status === 200) {
        const data = new Uint8Array(await resp.arrayBuffer())
        const start = performance.now()
        let pos = 0
        const poolNums: number[] = []
        let allNewPools: PoolCode[] = []
        while (pos < data.byteLength) {
          const {
            pools,
            extraData: { stateId, prevStateId },
            finish,
          } = deserializePoolsBinary(data, pos, (addr: string) => {
            return this.tokenMap.get(addr.toLowerCase())
          })
          pos = finish
          if (prevStateId === 0) {
            this.poolCodesMap.clear()
            this.tokenMap.clear()
            this.totalPoolNumber = 0
          } else if (prevStateId !== this.dataStateId) {
            Logger.error(
              this.chainId,
              `Incorrect router state: ${this.dataStateId} -> ${prevStateId}`,
            )
          }
          pools.forEach((p) => {
            const t0 = p.pool.token0
            const t1 = p.pool.token1
            this.tokenMap.set(tokenId(t0.address), t0 as Token)
            this.tokenMap.set(tokenId(t1.address), t1 as Token)

            const id = tokenPairId(t0.address, t1.address)
            const pl = this.poolCodesMap.get(id)
            if (pl === undefined) {
              this.poolCodesMap.set(id, [p])
              ++this.totalPoolNumber
            } else {
              if (prevStateId !== 0) {
                const addr = p.pool.address
                const len = pl.length
                for (let i = 0; i < len; ++i) {
                  if ((pl[i] as PoolCode).pool.address !== addr) continue
                  pl[i] = p
                  return
                }
              }
              pl.push(p)
              ++this.totalPoolNumber
            }
          })
          allNewPools = allNewPools.concat(pools)
          poolNums.push(pools.length)
          this.dataStateId = stateId
        }
        const updatedPrices = this.pricer.updatePrices(
          allNewPools.map((p) => p.pool),
          () =>
            Array.from(this.poolCodesMap.values())
              .flat()
              .map((p) => p.pool),
        )
        const timing = Math.round(performance.now() - start)
        console.log(
          `update: ${poolNums.map((n) => n.toString()).join('+')}/${
            this.totalPoolNumber
          } pools, ${this.tokenMap.size} tokens, ${updatedPrices}/${
            this.pricer.pricesSize
          } prices (${timing}ms cpu time)`,
        )
        this.lastUpdatedTimestamp = Date.now()
      } else {
        Logger.error(
          this.chainId,
          `Pool download failed, status=${resp.status}`,
        )
      }
    } catch (e) {
      Logger.error(this.chainId, `Pool download failed`, e)
    }
    setTimeout(() => this.updatePools(), this.poolUpdateInterval)
  }

  async updateRequestedPairs() {
    try {
      if (DEBUG_PRINT)
        console.log(`${this.extractorServer}/requested-pairs/${this.chainId}`)
      const resp = await fetch(
        `${this.extractorServer}/requested-pairs/${this.chainId}`,
      )
      if (resp.status === 200) {
        const data = (await resp.json()) as {
          tokens: string[]
          pairs: Record<number, number[]>
        }
        const start = performance.now()
        this.requestedPairs.clear()
        let pairs = 0
        for (const p in data.pairs) {
          const set = data.pairs[p]?.map(
            (n) => data.tokens[n] as string,
          ) as string[]
          this.requestedPairs.set(data.tokens[p] as string, new Set(set))
          pairs += set.length
        }
        console.log(
          `requested pairs update: ${pairs} pairs (${Math.round(
            performance.now() - start,
          )}ms cpu time)`,
        )
        this.lastUpdatedTimestamp = Date.now()
      } else {
        console.error(`Request pairs download failed, status=${resp.status}`)
      }
    } catch (e) {
      console.error(`Pool download failed, ${e}`)
    }
    setTimeout(
      () => this.updateRequestedPairs(),
      this.requestedPairsUpdateInterval,
    )
  }

  // fetch pools for the pair if we didn't do it previously
  async fetchPoolsBetween(t0: Type, t1: Type) {
    if (t0.isNative || t1.isNative) return // natives locally is processed wrapped
    const id = tokenPairId(t0, t1)
    if (this.poolCodesMap.get(id) !== undefined) return
    if (this.fetchPoolsBetweenRequests.has(id)) return // already fetched

    let addr0 = tokenAddr(t0)
    let addr1 = tokenAddr(t1)
    if (addr0 > addr1) {
      const addr = addr0
      addr0 = addr1
      addr1 = addr
    }
    if (this.requestedPairs.get(addr0)?.has(addr1)) return

    this.fetchPoolsBetweenRequests.add(id)
    try {
      if (DEBUG_PRINT)
        console.log(
          `${this.extractorServer}/pool-codes-between/${
            this.chainId
          }/${tokenAddr(t0)}/${tokenAddr(t1)}`,
        )
      const resp = await fetch(
        `${this.extractorServer}/pool-codes-between/${this.chainId}/${tokenAddr(
          t0,
        )}/${tokenAddr(t1)}`,
      )
      this.fetchPoolsBetweenRequests.delete(id)

      if (resp.status !== 200) {
        if (DEBUG_PRINT) console.log(`Responded: ${resp.status}`)
        return
      }
      const data = await resp.text()
      const pools = deserializePoolCodesJSON(data)
      pools.forEach((p) => {
        const t0 = p.pool.token0
        const t1 = p.pool.token1
        const id = tokenPairId(t0.address, t1.address)
        const pl = this.poolCodesMap.get(id)
        if (pl === undefined) this.poolCodesMap.set(id, [p])
        else pl.push(p)
      })
      if (DEBUG_PRINT)
        console.log(`Fetch pool codes between: ${pools.length} pools`)
      return pools
    } catch (e) {
      console.error(
        `Error /pool-codes-between/${this.chainId}/${tokenAddr(t0)}/${tokenAddr(
          t1,
        )}: ${e}`,
      )
      this.fetchPoolsBetweenRequests.delete(id)
      return
    }
  }

  async fetchTokenPools(t: string | Type) {
    const addr = typeof t === 'string' ? t : tokenAddr(t)
    try {
      if (DEBUG_PRINT)
        console.log(
          `${this.extractorServer}/pool-codes-for-token/${this.chainId}/${addr}`,
        )
      const resp = await fetch(
        `${this.extractorServer}/pool-codes-for-token/${this.chainId}/${addr}`,
      )
      if (resp.status !== 200) {
        if (DEBUG_PRINT) console.log(`Responded: ${resp.status}`)
        return
      }
      const data = await resp.text()
      const pools = deserializePoolCodesJSON(data)
      pools.forEach((p) => {
        const t0 = p.pool.token0
        const t1 = p.pool.token1
        const id = tokenPairId(t0.address, t1.address)
        const pl = this.poolCodesMap.get(id)
        if (pl === undefined) this.poolCodesMap.set(id, [p])
        else pl.push(p)
      })
      if (DEBUG_PRINT)
        console.log(`Fetch pool codes for token: ${pools.length} pools`)
      return pools
    } catch (e) {
      console.error(`Error /pool-codes-for-token/${this.chainId}/${addr}: ${e}`)
      return
    }
  }

  getKnownPoolsForTokens(t0: Type, t1: Type): Map<string, PoolCode> {
    this.fetchPoolsBetween(t0, t1)
    const tokens = this._getTokenListSorted(t0, t1)
    const pools: Map<string, PoolCode> = new Map()
    for (let i = 0; i < tokens.length; ++i) {
      for (let j = i + 1; j < tokens.length; ++j) {
        const pairPools = this.poolCodesMap.get(
          // @ts-ignore
          tokenPairId(tokens[i], tokens[j]),
        )
        if (pairPools !== undefined)
          pairPools.forEach((p) => pools.set(p.pool.uniqueID(), p))
      }
    }
    return pools
  }

  getToken(addr: string): Type | Promise<Type | undefined> {
    const addrL = addr.toLowerCase()
    if (addrL === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      return Native.onChain(this.chainId)
    const token = this.tokenMap.get(addrL)
    if (token !== undefined) return token
    return this.fetchToken(addr)
  }

  async fetchToken(addr: string): Promise<Token | undefined> {
    try {
      if (DEBUG_PRINT)
        console.log(`${this.extractorServer}/token/${this.chainId}/${addr}`)
      const resp = await fetch(
        `${this.extractorServer}/token/${this.chainId}/${addr}`,
      )
      if (resp.status === 422) return // token don't exist
      if (resp.status !== 200) {
        if (DEBUG_PRINT) console.log(`Responded: ${resp.status}`)
        throw new Error(`Extractor server error ${resp.status}`)
      }
      const data = (await resp.json()) as Token
      return new Token(data)
    } catch (e) {
      console.error(`Error /token/${this.chainId}/${addr}: ${e}`)
      return
    }
  }

  _getTokenListSorted(t0: Type, t1: Type): Type[] {
    const common = BASES_TO_CHECK_TRADES_AGAINST[this.chainId] ?? []
    const additionalA =
      ADDITIONAL_BASES[this.chainId]?.[t0.wrapped.address] ?? []
    const additionalB =
      ADDITIONAL_BASES[this.chainId]?.[t1.wrapped.address] ?? []

    const tokensSorted = [
      Native.onChain(this.chainId),
      t0.wrapped,
      t1.wrapped,
      ...common,
      ...additionalA,
      ...additionalB,
    ].sort((t0, t1) => (tokenId(t0) < tokenId(t1) ? -1 : 1))
    const tokensUnique: Type[] = []
    tokensSorted.forEach((t) => {
      if (tokensUnique.length === 0) tokensUnique.push(t)
      // @ts-ignore
      else if (tokenId(tokensUnique[tokensUnique.length - 1]) !== tokenId(t))
        tokensUnique.push(t)
    })

    return tokensUnique
  }

  getCurrentPoolCodes(): PoolCode[] {
    return Array.from(this.poolCodesMap.values()).flat()
  }

  getPrice(address: Address) {
    return this.pricer.prices[address]
  }

  getPriceReasoning(address: Address) {
    return this.pricer.reasoning(address)
  }

  getPrices() {
    return this.pricer.prices
  }
}
