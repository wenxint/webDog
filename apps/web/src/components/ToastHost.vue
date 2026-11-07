<script setup>
import { useToast } from '../composables/useToast'

const { items } = useToast()
</script>

<template>
  <div class="toast-host" aria-live="polite" aria-atomic="false">
    <TransitionGroup name="toast">
      <div
        v-for="toast in items"
        :key="toast.id"
        class="toast"
        :class="`toast-${toast.type}`"
        role="status"
      >
        <span class="toast-icon" aria-hidden="true">
          {{ toast.type === 'error' ? '😿' : '🐾' }}
        </span>
        <span>{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-host {
  position: fixed;
  left: 50%;
  bottom: calc(82px + env(safe-area-inset-bottom, 0px));
  z-index: 120;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: max-content;
  max-width: calc(100vw - 32px);
  transform: translateX(-50%);
  pointer-events: none;
}

.toast {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: var(--radius-full);
  background: rgba(59, 42, 33, 0.92);
  color: #fff;
  font-size: 13px;
  line-height: 1.5;
  box-shadow: 0 12px 28px rgba(59, 42, 33, 0.24);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.toast-error {
  background: rgba(147, 63, 45, 0.94);
}

.toast-icon {
  font-size: 15px;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (min-width: 768px) {
  .toast-host {
    bottom: 30px;
  }
}
</style>
