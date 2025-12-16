<template>
  <div class="h-full flex items-center justify-center min-h-[calc(100vh-var(--ui-header-height))]">
    <div class="table-module">
      <div />
      <div class="table-module_top">
        <ul class="flex gap-2 justify-center">
          <li v-for="user in userFields[0]" :key="user.id">
            <UserCard :value="user" />
          </li>
        </ul>
      </div>
      <div />
      <div class="table-module_left py-[160px]">
        <ul class="flex flex-col h-full gap-2 justify-center items-center">
          <li v-for="user in userFields[2]" :key="user.id">
            <UserCard :value="user" />
          </li>
        </ul>
      </div>
      <div class="table-module_table bg-primary-50" />
      <div class="table-module_right py-[160px]">
        <ul class="flex flex-col gap-2 h-full justify-center">
          <li v-for="user in userFields[3]" :key="user.id">
            <UserCard :value="user" />
          </li>
        </ul>
      </div>
      <div />
      <div class="table-module_bottom">
        <ul class="flex gap-2 justify-center">
          <li v-for="user in userFields[1]" :key="user.id">
            <UserCard :value="user" />
          </li>
        </ul>
      </div>
      <div />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  users: User[]
}>()

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
