import { useRefreshableQuery } from 'hooks/query/useRefreshableQuery'
import { useSelector } from 'react-redux'
import DeFiService from 'services/defi/DeFiService'
import { DeFiProtocol } from 'services/defi/types'
import { selectActiveAccount } from 'store/account'
import { convertSnakeToCamel } from 'utils/convertSnakeToCamel'
import { refetchIntervals } from 'services/defi/constants'

export const useDeFiProtocol = (protocolId: string) => {
  const addressC = useSelector(selectActiveAccount)?.address ?? ''

  return useRefreshableQuery({
    refetchInterval: refetchIntervals.deFiProtocol,
    enabled: !!addressC && !!protocolId,
    queryKey: ['deFiProtocol', addressC, protocolId],
    queryFn: () => DeFiService.getDeFiProtocol(addressC, protocolId),
    select: data => convertSnakeToCamel(data) as DeFiProtocol
  })
}