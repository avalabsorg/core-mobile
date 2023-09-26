import { Network } from '@avalabs/chains-sdk'
import { useSelector } from 'react-redux'
import { selectBridgeTransactions } from 'store/bridge'
import { isAvalancheNetwork } from 'utils/network/isAvalancheNetwork'
import { isBitcoinNetwork } from 'utils/network/isBitcoinNetwork'
import { isEthereumNetwork } from 'utils/network/isEthereumNetwork'

const usePendingBridgeTransactions = (network?: Network) => {
  const pendingBridgeByTxId = useSelector(selectBridgeTransactions)

  if (network) {
    const networkNameToCheck = isBitcoinNetwork(network)
      ? BridgeNetwork.BITCOIN
      : isAvalancheNetwork(network)
      ? BridgeNetwork.AVALANCHE
      : isEthereumNetwork(network)
      ? BridgeNetwork.ETHEREUM
      : null

    return Object.values(pendingBridgeByTxId).filter(
      tx =>
        (tx.sourceChain.valueOf() === networkNameToCheck ||
          tx.targetChain.valueOf() === networkNameToCheck) &&
        tx.environment === (network.isTestnet ? 'test' : 'main')
    )
  } else {
    return Object.values(pendingBridgeByTxId)
  }
}

enum BridgeNetwork {
  AVALANCHE = 'avalanche',
  BITCOIN = 'bitcoin',
  ETHEREUM = 'ethereum'
}

export default usePendingBridgeTransactions