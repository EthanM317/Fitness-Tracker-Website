<script>
    import DashboardCounter from './DashboardCounter.vue';
    import AreaChart from './AreaChart.vue';
    import { ref, onMounted, computed } from 'vue';

    export default {
        components: {
            DashboardCounter,
            AreaChart
        },
        setup() {
            const exercises = ref([]);
            const loading = ref(false);

            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth();
            const currentDate = new Date().getDate();

            const monthsExercises = computed(() => {
                return exercises.value.filter(e => {
                    const exerciseDate = new Date(e.date); 
                    return exerciseDate.getMonth() === currentMonth;
                });
            });

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
                let average = "--";

                monthsExercises.value.forEach(e => {
                    totalWeight += e.weight;
                });

                if(totalExercises.value > 0) {
                    average = (totalWeight / totalExercises.value).toFixed(3);
                }

                return average;
            });

            const dailyExerciseCount = computed(() => {
                const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

                let daysArray = Array.from({ length: totalDays }, (_, i) => {
                    const dayDate = new Date(currentYear, currentMonth, i + 1);
                    return {
                        date: dayDate.toISOString().split('T')[0],
                        exercises: 0
                    };
                });

                monthsExercises.value.forEach(e => {
                    const d = new Date(e.date);
                    const dayOfMonth = d.getDate();
                    if (daysArray[dayOfMonth - 1]) {
                        daysArray[dayOfMonth - 1].exercises += 1;
                    }
                });

                return daysArray
            });

            onMounted(() => {
                fetchExercises();
            });

            return { totalExercises, averageDailyExercises, averageWeight, dailyExerciseCount };
        }
    }
</script>

<template>
    <div class="component-container">
        <h2 id="title">Monthly Overview</h2>
        <AreaChart :exercises="dailyExerciseCount" />
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

    #title {
        font-size: 36px;
        background-color: var(--code-bg);
        border-radius: 12px;
        padding: 9px 16px;
        margin: 0px;
    }
</style>