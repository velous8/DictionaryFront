<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  options: Array,
})
const modelValue = defineModel()

const isOpen = ref(false)
const selectedOption = ref(modelValue.value ?? props.options[0]) //

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  selectedOption.value = option
  modelValue.value = option
  isOpen.value = false
}

const closeDropdown = (event) => {
  if (!event.target.closest('.dropdown-container')) {
    isOpen.value = false
  }
}

// Добавляем обработчик клика по документу
if (typeof document !== 'undefined') {
  document.addEventListener('click', closeDropdown)
}
</script>

<template>
  <div class="dropdown-container">
    <button 
      type="button" 
      class="select-button" 
      role="combobox" 
      :aria-expanded="isOpen"
      aria-autocomplete="none"
      @click="toggleDropdown"
    >
      <span>{{ selectedOption }}</span>
      <svg 
        class="chevron-icon" 
        :class="{ 'rotate-180': isOpen }"
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path d="m6 9 6 6 6-6"></path>
      </svg>
    </button>

    <div v-if="isOpen" class="dropdown-menu">
      <div
        v-for="option in options"
        :key="option"
        class="dropdown-item"
        :class="{ 'selected': option === selectedOption.value }"
        @click="selectOption(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
}

.select-button {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background-color: hsl(var(--background));
  padding: 8px 12px;
  font-size: 14px;
  line-height: 20px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  width: 160px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-button:hover {
  border-color: #9ca3af;
}

.select-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.select-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.select-button span {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 1;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  opacity: 0.5;
  transition: transform 0.2s ease;
}

.chevron-icon.rotate-180 {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 1;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 8px 12px;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.dropdown-item.selected {
  background-color: #eff6ff;
  color: #1d4ed8;
}

.dropdown-item:first-child {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.dropdown-item:last-child {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}
</style>