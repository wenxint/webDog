<script setup>
defineProps({
  categories: { type: Array, default: () => [] },
  modelValue: { type: String, default: '' },
  showAll: { type: Boolean, default: true }
})

defineEmits(['update:modelValue'])

function categoryKey(category) {
  return category.slug || category.name || category.id
}
</script>

<template>
  <div class="chips" role="group" aria-label="分类筛选">
    <button
      v-if="showAll"
      type="button"
      class="chip"
      :class="{ active: !modelValue }"
      @click="$emit('update:modelValue', '')"
    >
      <span aria-hidden="true">🐾</span> 全部
    </button>

    <button
      v-for="category in categories"
      :key="categoryKey(category)"
      type="button"
      class="chip"
      :class="{
        active:
          modelValue === category.slug ||
          modelValue === category.name ||
          modelValue === String(category.id)
      }"
      @click="$emit('update:modelValue', categoryKey(category))"
    >
      <span aria-hidden="true">{{ category.icon || '🐾' }}</span>
      {{ category.name }}
      <em v-if="category.postCount > 0" class="chip-count">{{ category.postCount }}</em>
    </button>
  </div>
</template>

<style scoped>
.chips {
  display: flex;
  gap: 9px;
  overflow-x: auto;
  padding: 4px 2px 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.chips::-webkit-scrollbar {
  display: none;
}

.chip {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.8);
  color: var(--text-2);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  transition: all 0.18s ease;
}

.chip:hover {
  border-color: var(--primary);
  color: var(--primary-strong);
}

.chip.active {
  border-color: transparent;
  background: linear-gradient(135deg, #ff9a5f, var(--primary));
  color: #fff;
  box-shadow: 0 6px 14px rgba(255, 138, 76, 0.26);
}

.chip-count {
  padding: 0 6px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.72);
  color: var(--primary-strong);
  font-size: 11px;
  font-style: normal;
  font-weight: 700;
  line-height: 17px;
}

.chip.active .chip-count {
  background: rgba(255, 255, 255, 0.28);
  color: #fff;
}
</style>
