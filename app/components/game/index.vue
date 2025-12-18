<template>
  <div class="h-full flex items-center justify-center min-h-[calc(100vh-var(--ui-header-height))]">
    <div class="table-module">
      <div />
      <div class="table-module_top">
        <ul class="flex gap-2 justify-center">
          <li v-for="gamerTop in gamerFields[0]" :key="gamerTop.id">
            <UserGamerCard :value="gamerTop" :game-is-done />
          </li>
        </ul>
      </div>
      <div />
      <div class="table-module_left py-[160px]">
        <ul class="flex flex-col h-full gap-2 justify-center items-center">
          <li v-for="gamerLeft in gamerFields[2]" :key="gamerLeft.id">
            <UserGamerCard :value="gamerLeft" :game-is-done />
          </li>
        </ul>
      </div>
      <RoomField
        class="table-module_table"
        :gamers="allGamers"
        :game-is-done
        @reveal-cards="revealCards"
        @reset="resetGame"
      />
      <div class="table-module_right py-[160px]">
        <ul class="flex flex-col gap-2 h-full justify-center">
          <li v-for="gamerRight in gamerFields[3]" :key="gamerRight.id">
            <UserGamerCard :value="gamerRight" :game-is-done />
          </li>
        </ul>
      </div>
      <div />
      <div class="table-module_bottom">
        <ul class="flex gap-2 justify-center">
          <li v-for="gamerBottom in gamerFields[1]" :key="gamerBottom.id">
            <UserGamerCard :value="gamerBottom" :game-is-done />
          </li>
        </ul>
      </div>
      <div />
    </div>
    <UContainer
      class="fixed flex top-[var(--ui-header-height)] right-0 left-1/2 -translate-x-1/2 bg-white p-4"
    >
      <UiTitle severity="h2" class="">{{ taskName }}</UiTitle>
      <UButton size="xl" color="warning" class="ml-auto" @click="emit('toAnalytics')">
        Отправить в аналитику
      </UButton>
    </UContainer>
    <UContainer
      as="footer"
      class="border border-neutral-200 border-b-0 rounded-b-none rounded fixed bottom-0 left-0 left-1/2 -translate-x-1/2 bg-white p-4"
    >
      <CardDesk v-if="!gameIsDone" :gamer-vote="currentGamer?.card" @vote="emit('vote', $event)" />
      <RoomResults v-else :gamers="allGamers" @save-estimate="emit('saveEstimate', $event)" />
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  taskName: Task['title']
  gamers: Gamer[]
  currentGamer: Gamer
  gameIsDone: boolean
}>()
const emit = defineEmits<{
  (e: 'vote', card?: Card): void
  (e: 'revealCards'): void
  (e: 'update:gameIsDone', value: boolean): void
  (e: 'resetGame'): void
  (e: 'toAnalytics'): void
  (e: 'saveEstimate', estimate: number): void
}>()

const maxUsersOnDirection = 4
const allGamers = computed(() => [props.currentGamer, ...props.gamers])
const gamerFields = computed(() => {
  return allGamers.value.reduce(
    (acc, item) => {
      const [top, bottom, left, right] = acc

      if (top.length < maxUsersOnDirection || bottom.length < maxUsersOnDirection) {
        //сначала заполняем верх, потом низ
        if (!top.length || top.length < bottom.length) top.push(item)
        else bottom.push(item)
      } else {
        // потом лево, потом право
        if (!left.length || left.length < right.length) left.push(item)
        else right.push(item)
      }

      return acc
    },
    [[], [], [], []] as [User[], User[], User[], User[]]
  )
})

const revealCards = () => {
  emit('update:gameIsDone', true)
  emit('revealCards')
}
const resetGame = () => {
  emit('update:gameIsDone', false)
  emit('resetGame')
}
</script>

<style scoped>
.table-module {
  grid-gap: 0.8rem;
  display: inline-grid;
  grid-template-areas:
    'left top right'
    'left table right'
    'left bottom right';
  grid-template-columns: 10.4rem 1fr 10.4rem;
  grid-template-rows: auto 1fr auto;
  margin: 0 auto;
  min-height: 200px;
  width: auto;
}

.table-module_top {
  align-items: stretch;
  grid-area: top;
}

.table-module_left {
  align-items: stretch;
  grid-area: left;
}

.table-module_right {
  grid-area: right;
}

.table-module_bottom {
  grid-area: bottom;
}

.table-module_table {
  border-radius: 2.8rem;
  grid-area: table;
  height: auto;
  margin: 0 auto;
  min-height: 15.1rem;
  min-width: 33.8rem;
  padding: 0 1.6rem;
  position: relative;
  width: 100%;
}
</style>
