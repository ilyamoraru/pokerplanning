import {CardType, CardState} from '../utils/card'

export type Card = {
  type: CardType
  value: number | CardState
}
