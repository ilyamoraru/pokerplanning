<template>
  <UTable :data="value" :columns="tableColumns" @select="onSelect"> </UTable>
</template>

<script lang="ts" setup>
import type { TableColumn, TableRow } from '@nuxt/ui'

defineProps<{
  value: Task[]
}>()

const iconComponent = resolveComponent('Icon')
const linkComponent = resolveComponent('NuxtLink')
const tableColumns: TableColumn<Task>[] = [
  {
    accessorKey: 'id',
    header: 'Задача',
    cell: ({ row }) =>
      h(linkComponent, { to: `/vote/${row.getValue('id')}` }, () => row.getValue('id')),
    meta: { class: { td: 'cursor-pointer' } }
  },
  {
    accessorKey: 'title',
    header: 'Название',
    cell: ({ row }) =>
      h(linkComponent, { to: `/vote/${row.getValue('id')}` }, () => row.getValue('title')),
    meta: { class: { td: 'cursor-pointer' } }
  },
  {
    accessorKey: 'url',
    header: 'Ссылка',
    cell: ({ row }) => {
      return h('a', { href: row.getValue('url'), target: '_blank' }, [
        h(iconComponent, { name: 'mdi:external-link', size: 20 })
      ])
    },
    meta: { class: { td: 'cursor-pointer' } }
  }
]

const onSelect = (_e: Event, row: TableRow<Task>) => {
  navigateTo(`/vote/${row.id}`)
}
</script>
