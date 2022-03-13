import { ChainId, Token } from '@pancakeswap/sdk'
import { serializeToken } from 'state/user/hooks/helpers'
import { CHAIN_ID } from './networks'
import { SerializedToken } from './types'

const { MAINNET, TESTNET } = ChainId

interface TokenList {
  [symbol: string]: Token
}

const defineTokens = <T extends TokenList>(t: T) => t

export const mainnetTokens = defineTokens({
  wht: new Token(
    MAINNET,
    '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f',
    18,
    'WHT',
    'Wrapped HT',
    'https://www.HUOBI.com/',
  ),
  // bnb here points to the wbnb contract. Wherever the currency BNB is required, conditional checks for the symbol 'BNB' can be used
  ht: new Token(MAINNET, '0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F', 18, 'HT', 'HT', 'https://www.HUOBI.com/'),
  maki: new Token(
    MAINNET,
    '0x5FaD6fBBA4BbA686bA9B8052Cf0bd51699f38B93',
    18,
    'MAKI',
    'MakiSwap Token',
    'https://makiswap.com',
  ),

} as const)

export const testnetTokens = defineTokens({
  wht: new Token(
    TESTNET,
    '0x5b2da6f42ca09c77d577a12bead0446148830687',
    18,
    'WHT',
    'Wrapped HT',
    'https://www.huobi.com/',
  ),
  maki: new Token(
    TESTNET,
    '0x6858a26bBBc8e185274969f6baf99674929Cf766',
    18,
    'MAKI',
    'MakiSwap Token',
    'https://makiswap.com/',
  ),
  husd: new Token(
    TESTNET,
    '0x814bf608A2f3d19F68272Eb887c4fECC322183C0',
    18,
    'HUSD',
    'Huobi Peg USD',
    'https://www.huobi.com',
  ),
  soy: new Token(
    TESTNET,
    '0xEd2Fb478f7fCef33E1E1d980a0135789B295a7F5',
    18,
    'SOY',
    'SoyBar Token',
    'https://makiswap.com/',
  ),

} as const)

const tokens = () => {
  const chainId = CHAIN_ID

  // If testnet - return list comprised of testnetTokens wherever they exist, and mainnetTokens where they don't
  if (parseInt(chainId, 10) === ChainId.TESTNET) {
    return Object.keys(mainnetTokens).reduce((accum, key) => {
      return { ...accum, [key]: testnetTokens[key] || mainnetTokens[key] }
    }, {} as typeof testnetTokens & typeof mainnetTokens)
  }

  return mainnetTokens
}

const unserializedTokens = tokens()

type SerializedTokenList = Record<keyof typeof unserializedTokens, SerializedToken>

export const serializeTokens = () => {
  const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
    return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
  }, {} as SerializedTokenList)

  return serializedTokens
}

export default unserializedTokens
