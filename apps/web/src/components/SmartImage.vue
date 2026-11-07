<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  emoji: { type: String, default: '🐾' },
  label: { type: String, default: '' },
  tone: { type: String, default: 'default' },
  ratio: { type: String, default: 'card' }, // card | hero | thumb
  eager: { type: Boolean, default: false }
})

const failed = ref(false)
const loaded = ref(false)

watch(
  () => props.src,
  () => {
    failed.value = false
    loaded.value = false
  }
)
</script>

<template>
  <div class="smart-image" :class="[`tone-${tone}`, `ratio-${ratio}`]">
    <!-- 渐变占位始终垫在底层：图片加载中或加载失败都不会出现空白/裂图 -->
    <div class="smart-image-fallback" aria-hidden="true">
      <span class="fallback-emoji">{{ emoji }}</span>
      <span v-if="label" class="fallback-label">{{ label }}</span>
    </div>

    <img
      v-if="src && !failed"
      :src="src"
      :alt="alt"
      :class="{ 'is-loaded': loaded }"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      @load="loaded = true"
      @error="failed = true"
    />
  </div>
</template>

<style scoped>
.smart-image {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #f6e8da;
}

.ratio-card {
  aspect-ratio: 16 / 10;
}

.ratio-hero {
  aspect-ratio: 16 / 9;
}

.ratio-thumb {
  aspect-ratio: 4 / 3;
}

.smart-image img {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.smart-image img.is-loaded {
  opacity: 1;
}

.smart-image-fallback {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: linear-gradient(135deg, var(--tone-a), var(--tone-b));
}

.smart-image-fallback::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.35;
  background-image: radial-gradient(rgba(255, 255, 255, 0.7) 1.5px, transparent 1.5px);
  background-size: 20px 20px;
}

.fallback-emoji {
  position: relative;
  z-index: 1;
  font-size: 36px;
  line-height: 1;
  filter: drop-shadow(0 6px 12px rgba(120, 70, 40, 0.16));
}

.fallback-label {
  position: relative;
  z-index: 1;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: rgba(107, 74, 54, 0.66);
}

.ratio-hero .fallback-emoji {
  font-size: 52px;
}

.tone-cat {
  --tone-a: #ffe1c7;
  --tone-b: #ffc9d4;
}

.tone-dog {
  --tone-a: #ffe7c9;
  --tone-b: #ffd3a6;
}

.tone-exotic {
  --tone-a: #e3f2e8;
  --tone-b: #cbe6d8;
}

.tone-health {
  --tone-a: #e5f0fa;
  --tone-b: #d5e6f7;
}

.tone-feeding {
  --tone-a: #fff0c9;
  --tone-b: #ffe1b0;
}

.tone-behavior {
  --tone-a: #ede4ff;
  --tone-b: #e0d2ff;
}

.tone-default {
  --tone-a: #ffe9d9;
  --tone-b: #ffdcc6;
}
</style>
