<script setup>
import DiagramProgress from '../components/DiagramProgress.vue'
</script>

<template>
  <div class="progress">
    <div class="card diagram">
      <div class="diagram-lable">
        <h3 class="name">Твой прогресс</h3>
        <div class="description">Общее распределение состояний вашего словарного запаса</div>
      </div> 
      <DiagramProgress></DiagramProgress>
    </div>
    <div class="card display">
       <div class="diagram-lable">
        <h3 class="name">Советы</h3>
        <div class="description">Используйте LexiDrill по максимуму</div>
      </div> 
      <div class="tips">
        <div>&bull; Нажмите на сектор круговой диаграммы, чтобы отфильтровать список по этому статусу.</div>
        <div>&bull; Проведите пальцем по карточкам: вправо, чтобы отметить как изученные, влево, чтобы продолжить изучение.</div>
        <div>&bull; Войдите в систему, чтобы синхронизировать свой прогресс на разных устройствах.</div>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.progress{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding-bottom: 5rem;
}

 @media (max-width: 1024px) {
  .progress {
    grid-template-columns: repeat(1, 1fr);
  }
}

.card{
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--card));
}
.name{
  margin: 0;
}
.description{
      font-size: .875rem;
    color: hsl(var(--muted-foreground));
}
.card>*{
padding: 1.5rem;
}
.tips>*{
  font-size: .875rem;
  border-radius: 0.375rem;
  background-color: hsl(var(--secondary));
  padding: 0.75rem;
  margin-bottom: 0.5rem;
}
</style>