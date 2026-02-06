<template>
  <div class="skeleton" :class="skeletonClasses" :style="customStyle"></div>
</template>

<script setup lang="ts">
const props = defineProps({
  variant: {
    type: String as () => 'text' | 'circle' | 'rectangle',
    default: 'rectangle'
  },
  width: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: ''
  },
  rounded: {
    type: String as () => 'none' | 'sm' | 'md' | 'lg' | 'full',
    default: 'md'
  }
})

const skeletonClasses = computed(() => {
  const classes: string[] = []
  
  if (props.variant === 'circle') {
    classes.push('rounded-full')
  } else if (props.variant === 'text') {
    classes.push('h-4', 'rounded')
  } else {
    // rectangle
    const roundedClass = {
      'none': 'rounded-none',
      'sm': 'rounded-sm',
      'md': 'rounded-md',
      'lg': 'rounded-lg',
      'full': 'rounded-full'
    }
    classes.push(roundedClass[props.rounded])
  }
  
  return classes.join(' ')
})

const customStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.width) style.width = props.width
  if (props.height) style.height = props.height
  return style
})
</script>
