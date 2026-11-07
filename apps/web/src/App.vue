<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import MobileTabBar from './components/MobileTabBar.vue'
import ToastHost from './components/ToastHost.vue'
</script>

<template>
  <AppHeader />

  <main>
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>

  <AppFooter />
  <MobileTabBar />
  <ToastHost />
</template>
