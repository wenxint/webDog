<script setup>
defineProps({
  type: { type: String, default: 'empty' }, // empty | error
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  actionText: { type: String, default: '' },
  compact: { type: Boolean, default: false }
})

defineEmits(['action'])
</script>

<template>
  <div class="state-block" :class="{ compact }">
    <div class="state-emoji" aria-hidden="true">
      {{ type === 'error' ? '😿' : '🐾' }}
    </div>
    <h3 class="state-title">
      {{ title || (type === 'error' ? '加载失败了' : '这里还空空如也') }}
    </h3>
    <p v-if="description" class="state-desc">{{ description }}</p>
    <button v-if="actionText" type="button" class="btn btn-soft btn-sm" @click="$emit('action')">
      {{ actionText }}
    </button>
    <slot />
  </div>
</template>

<style scoped>
.state-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 54px 24px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.62);
  text-align: center;
}

.state-emoji {
  display: grid;
  place-items: center;
  width: 62px;
  height: 62px;
  margin-bottom: 14px;
  border-radius: 20px;
  background: linear-gradient(140deg, #fff, #ffe9d9);
  box-shadow: 0 8px 20px rgba(255, 138, 76, 0.14);
  font-size: 28px;
}

.state-title {
  color: var(--brown);
  font-size: 16px;
}

.state-desc {
  max-width: 420px;
  margin: 7px 0 16px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.7;
}

.compact {
  padding: 30px 20px;
}

.compact .state-emoji {
  width: 48px;
  height: 48px;
  margin-bottom: 10px;
  font-size: 22px;
}
</style>
