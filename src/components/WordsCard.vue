<script setup>
//  --ИМПОРТЫ--
const props = defineProps({
 word: Object,
 isActive: Boolean
})

const emit =defineEmits(['toggle','know','unknown'])

</script>

<template>
        <div class="top-card">
            <div class = "eng">{{ word.eng }}</div>
            <div class = "transcription">[{{ word.transcription }}]</div>
        </div>

        <div class="bot-card" >
            <div class = "translation" :class="{noActive: !isActive}">{{ word.translation }}</div>
            <button class="button show" @click="emit('toggle')">
                <span v-if="isActive">
                    <img class="logo" src="../assets/hideLogo.svg"> Скрыть перевод 
                </span>
                <span v-else>
                    <img class="logo" src="../assets/showLogo.svg"> Показать перевод
                </span>
               
            </button>
            <div class="line"></div>
            <div class="answer">
                <button class="button dont-know" @click="emit('unknown')">Я не знал</button>
                <button class="primary-button know" @click="emit('know')"><img class="logo" src="../assets/knowLogo.svg">Знал</button>
            </div>
        </div>
</template>

<style scoped>






.eng{
    font-size: 1.3rem;
    font-weight: bold
}
.transcription{
    margin-top: .5rem;
  color: hsl(var(--muted-foreground))
}
.translation{
    font-size: 1.2em;
}
.show{
  height: 2.5rem;
  border-radius: 2rem;
}
.show>span{
    display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
}

.noActive{
    Visibility:hidden;
}

.line{
  background-color: hsl(var(--border));
  height: 1px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  width: 100%;
}

.logo{
      width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

.answer{
    display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  width: 100%;
}

.bot-card{
      padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>