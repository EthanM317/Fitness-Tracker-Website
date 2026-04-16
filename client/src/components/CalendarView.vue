<script>
    import Calendar from "./Calendar.vue";
    import MonthlyDashboard from "./MonthlyDashboard.vue";

    export default {
        components: {
            Calendar,
            MonthlyDashboard
        }
    }
</script>

<template>
    <div class="view-container">
        <Calendar class="calendar" />
        <MonthlyDashboard class="dashboard" />
    </div>
</template>

<style scoped>
    .view-container {
        display: flex;
        align-items: flex-start;
        flex-grow: 0;
        gap: 20px;
        margin: 15px;
    }
    .calendar { 
        flex: 1 1 0;
    }

    .dashboard { flex: 1 1 0; }
</style>