<script setup>
import { computed, ref } from 'vue'
import { isImageUrl, nameInitial } from '../utils/format'

const props = defineProps({
  name: { type: String, default: '' },
  avatar: { type: String, default: '' },
  size: { type: Number, default: 32 }
})

const broken = ref(false)
const showImage = computed(() => isImageUrl(props.avatar) && !broken.value)
const text = computed(() => (isImageUrl(props.avatar) ? nameInitial(props.name) : props.avatar || nameInitial(props.name)))
const style = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  fontSize: `${Math.max(11, Math.round(props.size * 0.42))}px`
}))
</script>

<template>
  <span class="user-avatar" :style="style">
    <img v-if="showImage" :src="avatar" alt="" @error="broken = true" />
    <template v-else>{{ text }}</template>
  </span>
</template>

<style scoped>
.user-avatar {
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
  background: linear-gradient(140deg, #fff1e4, #ffe3ce);
  color: var(--primary-strong);
  font-weight: 700;
  line-height: 1;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.7);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
