export enum CardState {
  watching,
  coffee,
  unclear
}

export enum CardType {
  numeric = 'numeric',
  state = 'state'
}

export const cardStateMap: Record<CardState, { title: string; icon: string }> = {
  [CardState.watching]: {
    title: 'Наблюдаю',
    icon: 'mdi:eye-outline'
  },
  [CardState.coffee]: {
    title: 'Чиллю',
    icon: 'mdi:coffee'
  },
  [CardState.unclear]: {
    title: 'Сложновато',
    icon: 'mdi:head-thinking-outline'
  }
}
