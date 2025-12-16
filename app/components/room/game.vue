<template>
  <div class="h-full flex items-center justify-center min-h-[calc(100vh-var(--ui-header-height))]">
    <div class="table-module">
      <div />
      <div class="table-module_top">
        <ul class="flex gap-2 justify-center">
          <li v-for="userTop in userFields[0]" :key="userTop.id">
            <UserGamerCard :value="userTop" :game-is-done />
          </li>
        </ul>
      </div>
      <div />
      <div class="table-module_left py-[160px]">
        <ul class="flex flex-col h-full gap-2 justify-center items-center">
          <li v-for="userLeft in userFields[2]" :key="userLeft.id">
            <UserGamerCard :value="userLeft" :game-is-done />
          </li>
        </ul>
      </div>
      <RoomField
        class="table-module_table"
        :gamers="users"
        :game-is-done
        @reveal-cards="revealCards"
        @reset="resetGame"
      />
      <div class="table-module_right py-[160px]">
        <ul class="flex flex-col gap-2 h-full justify-center">
          <li v-for="userRight in userFields[3]" :key="userRight.id">
            <UserGamerCard :value="userRight" :game-is-done />
          </li>
        </ul>
      </div>
      <div />
      <div class="table-module_bottom">
        <ul class="flex gap-2 justify-center">
          <li v-for="userBottom in userFields[1]" :key="userBottom.id">
            <UserGamerCard :value="userBottom" :game-is-done />
          </li>
        </ul>
      </div>
      <div />
    </div>
    <CardDesk
      class="fixed bottom-4 left-0 left-1/2 -translate-x-1/2 bg-white p-4"
      :user-vote="user?.card"
      @vote="onUserVote"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  users: Gamer[]
  user: Gamer
}>()
const emit = defineEmits<{
  (e: 'vote', card?: Card): void
}>()

const gameIsDone = ref(false)

const maxUsersOnDirection = 4
const userFields = computed(() => {
  return props.users.reduce(
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
  gameIsDone.value = true
}
const resetGame = () => {
  gameIsDone.value = false
}

const onUserVote = (card?: Card) => {
  emit('vote', card)
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
