<script>
    import DashboardCounter from './DashboardCounter.vue';

    export default {
        components: {
            DashboardCounter
        }
    }
</script>

<template>
    <div class="component-container">
        <h2 id="title">Monthly Overview</h2>
        <div class="chart-placeholder"></div>
        <div class="counter-bar">
            <DashboardCounter />
            <DashboardCounter />
            <DashboardCounter />
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