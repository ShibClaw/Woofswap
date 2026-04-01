import { Interface } from '@ethersproject/abi'
import { getMulticallContract } from './contractHelpers'


export const multicall = async (abi, calls,web3) => {

  const multi = getMulticallContract(web3)
  const itf = new Interface(abi)

  const calldata = calls.map((call) => ({
    target: call.address.toLowerCase(),
    callData: itf.encodeFunctionData(call.name, call.params),
  }))

    // const { returnData } = await multi.aggregate(calldata)

    // const { returnData } = await multi.methods.aggregate(calldata).call()

    // const [_, result] = await multicall.aggregate.staticCall(calls);

  const { returnData } = await multi.aggregate.staticCall(calldata);

  const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

  return res
}
