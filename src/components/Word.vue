<script setup>
const props = defineProps({
  todo: Object
})

</script>

<template>
    <div class="word">
        <div class = "eng">{{ todo.eng }}</div>
        <div class = "transcription">|{{ todo.transcription }}|</div>
        <div class = "translation">{{ todo.translation }}</div>
        <div class = "progress">({{ todo.progress || '0'}}%)</div>
    </div>
</template>

<style scoped>
.word{
  margin: 0 100px;
  display: flex;
  justify-content: space-between;
}
.word>*{
  padding: 0 1.25%;
   border-left: 1px dashed;
   border-right: 1px dashed;
}
.eng{
  min-width: 25%;
}
.transcription{
  min-width: 25%;
}
.translation{
  min-width: 30%;
}
.progress{
  min-width: 10%;
  text-align:center;
}
</style>
