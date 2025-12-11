export enum CardType {
  numeric = 'numeric',
  state = 'state',
}
export enum CardState {
  watching,
  coffee,
  unclear
}
export type Card = {
  type: CardType
  value: number | CardState
}
