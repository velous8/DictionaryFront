<script setup>
const props = defineProps({
  todo: Object
})

</script>

<template>
    <div class="word-data">
      <div class="word">
        <div class = "eng">{{ todo.eng }}</div>
        <div class = "transcription">[{{ todo.transcription }}]</div>
        <div class = "translation">{{ todo.translation }}</div> 
      </div>
        
      <div class = "progress">({{ todo.progress || '0'}}%)</div>     
    </div>
    
</template>

<style scoped>
.word-data{
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  padding: 0.75rem 1rem;
}
.eng{
  font-weight: bold
}
.transcription{
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: hsl(var(--muted-foreground))
}
</style>
