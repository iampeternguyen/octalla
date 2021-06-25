<template>
  <q-layout view="lHh lpR fFf">
    <q-header class="bg-white text-primary constrain" height-hint="98">
      <q-toolbar class="row justify-between q-py-lg">
        <q-img src="/logo/Logo_Full.png" width="12rem" fit="scale-down" />
        <div>Menu</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Store from 'src/stores';
import { defineComponent, ref, inject } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup() {
    const store = inject(Store.StoreKey);
    if (!store) return;

    return {};
  },
});
</script>

<style lang="scss" scoped></style>
