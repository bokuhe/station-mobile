import { CreateTxOptions, Msg, Fee } from '@terra-money/terra.js'
import { UTIL } from 'consts'
import _ from 'lodash'

import { TxParam } from 'types/tx'
import dev from './dev'

export const createTxOptionsToTxParam = (
  txOptions: CreateTxOptions
): TxParam => {
  const msgs =
    txOptions.msgs && typeof txOptions.msgs !== 'string'
      ? txOptions.msgs.map((msg) => msg.toJSON())
      : txOptions.msgs
  const fee =
    txOptions.fee && typeof txOptions.fee !== 'string'
      ? txOptions.fee.toJSON()
      : txOptions.fee

  const ret = {
    msgs,
    fee,
    memo: txOptions.memo,
    gasPrices: txOptions.gasPrices?.toString(),
    gasAdjustment: txOptions.gasAdjustment?.toString(),
    account_number: undefined, // not use
    sequence: undefined, // not use
    feeDenoms: txOptions.feeDenoms,
  }
  return ret
}

export const txParamParser = (txParam: TxParam): CreateTxOptions => {
  let isAmino = false
  try {
    const parse = JSON.parse(txParam.msgs[0])
    isAmino = parse.type !== undefined // amino: type, proto: @type
  } catch (e: any) {
    dev.log(e)
  }

  // parse msgs
  const msgs = _.reduce(
    txParam.msgs,
    (result: Msg[], msg: string): Msg[] => {
      try {
        const jsonMsg = UTIL.jsonTryParse<any>(msg)
        if (jsonMsg) {
          const convertMsg = isAmino
            ? Msg.fromAmino(jsonMsg)
            : Msg.fromData(jsonMsg)

          result.push(convertMsg)
        }
      } catch (e: any) {
        dev.log(e)
      }

      return result
    },
    []
  )

  // parse fee
  let fee = undefined
  try {
    if (txParam.fee !== undefined) {
      const jsonFee = UTIL.jsonTryParse<any>(txParam.fee)
      fee = isAmino ? Fee.fromAmino(jsonFee) : Fee.fromData(jsonFee)
    }
  } catch (e: any) {
    dev.log(e)
  }

  return {
    ...txParam,
    msgs,
    fee,
  }
}
