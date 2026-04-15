<script>
    export default {
        props: {
            metricName: {
                type: String,
                default: 'New Metric'
            },
            count: {
                type: [Number, String],
                default: 0
            }
        }
    }
</script>

<template>
    <div class="container">
        <p>{{ metricName }}</p>
        <h5>{{ count }}</h5>
    </div>
</template>

<style scoped>
    .container {
        background-color: var(--code-bg);
        border-radius: 12px;
        padding: 8px 16px;
        text-align: start;
    }

    p {
        font-size: 14px;
    }

    h5 {
        color: var(--text-h);
        margin: 0px;
    }
</style>