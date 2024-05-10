import { ONE, ZERO } from '../../../math/index.js'

export abstract class FullMath {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static mulDivRoundingUp(
    a: bigint,
    b: bigint,
    denominator: bigint,
  ): bigint {
    const product = a * b
    let result = product / denominator
    if (product % denominator !== ZERO) {
      result = result + ONE
    }
    return result
  }
}
