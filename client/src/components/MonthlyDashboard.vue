<script>
    import DashboardCounter from './DashboardCounter.vue';
    import { ref, onMounted, computed } from 'vue';

    export default {
        components: {
            DashboardCounter
        },
        setup() {
            const exercises = ref([]);
            const loading = ref(false);

            const currentMonth = new Date().getMonth();
            const currentDate = new Date().getDate();

            async function fetchExercises() {
                loading.value = true;
                try {
                    const response = await fetch('http://localhost:3000/api/exercises');
                    if (!response.ok) {
                        throw new Error();
                    }
                    
                    const data = await response.json();
                    exercises.value = data;
                }
                catch (error) {
                    console.error("There was an error fetching exercises.");
                }
                finally {
                    loading.value = false;
                }
            }

            const totalExercises = computed(() => {        
                return exercises.value.filter(e => {
                    const exerciseDate = new Date(e.date); 
                    return exerciseDate.getMonth() === currentMonth;
                }).length;
            });

            const averageDailyExercises = computed(() => {
                return (totalExercises.value / currentDate).toFixed(3);
            });

            const averageWeight = computed(() => {
                let totalWeight = 0

                let monthly = exercises.value.filter(e => {
                    const exerciseDate = new Date(e.date); 
                    return exerciseDate.getMonth() === currentMonth;
                });

                monthly.forEach(e => {
                    totalWeight += e.weight;
                });

                return (totalWeight / totalExercises.value).toFixed(3);
            });

            onMounted(() => {
                fetchExercises();
            });

            return { totalExercises, averageDailyExercises, averageWeight };
        }
    }
</script>

<template>
    <div class="component-container">
        <h2 id="title">Monthly Overview</h2>
        <div class="chart-placeholder"></div>
        <div class="counter-bar">
            <DashboardCounter metricName="Total Exercises" :count="totalExercises" />
            <DashboardCounter metricName="Average Daily Exercises" :count="averageDailyExercises"/>
            <DashboardCounter metricName="Average Weight" :count="averageWeight"/>
        </div>
    </div>
</template>

<style scoped>
    .component-container {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .counter-bar {
        display: flex;
        align-items: flex-start;
        gap: 10px;
    }

    .chart-placeholder {
        background-color: var(--code-bg);
        border-radius: 12px;
        padding: 280px 0px;
    }

    #title {
        font-size: 36px;
        background-color: var(--code-bg);
        border-radius: 12px;
        padding: 8px 16px;
        margin: 0px;
    }
</style>