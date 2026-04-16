<script>
    import * as d3 from 'd3'

    export default {
        name: 'AreaChart',
        props: {
            exercises: {
                type: Array,
                required: true
            }
        },
        watch: {
            exercises: {
                handler() {
                    this.updateChart()
                },
                deep: true
            }
        },
        mounted() {
            this.updateChart()
        },
        methods: {
            updateChart() {
                const chartNode = d3.select('#chart')
                chartNode.selectAll('*').remove()

                const data = this.exercises.map(e => ({
                    date: new Date(e.date),
                    exercises: e.exercises
                })).sort((a, b) => a.date - b.date)

                const marginTop = 20;
                const marginRight = 20;
                const marginBottom = 25;
                const marginLeft = 20;
                const width = 620;
                const height = 560;

                const x = d3.scaleTime()
                    .domain(d3.extent(data, d => d.date))
                    .range([marginLeft, width - marginRight]);

                const y = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.exercises) + 1])
                    .range([height - marginBottom, marginTop]);

                const area = d3.area()
                    .x(d => x(d.date))
                    .y0(y(0))
                    .y1(d => y(d.exercises));

                const line = d3.line()
                    .x(d => x(d.date))
                    .y(d => y(d.exercises));

                const svg = chartNode
                    .attr("width", width)
                    .attr("height", height);

                svg.append("path")
                    .attr("fill", "#4CAF50")
                    .attr("fill-opacity", 0.25)
                    .attr("d", area(data));

                svg.append("path")
                    .attr("fill", "none")
                    .attr("stroke", "#4CAF50")
                    .attr("stroke-width", 2)
                    .attr("d", line(data));

                svg.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", "data-circle")
                    .attr("cx", d => x(d.date))
                    .attr("cy", d => y(d.exercises))
                    .attr("r", 5)
                    .attr("fill", "#4CAF50")
                    .attr("fill-opacity", 0.25)
                    .attr("stroke", "#4CAF50")
                    .attr("stroke-width", 2);

                svg.append("g")
                    .attr("transform", `translate(-4,${height - marginBottom})`)
                    .call(d3.axisBottom(x).ticks(width / 40).tickSizeOuter(0));

                svg.append("g")
                    .attr("transform", `translate(${marginLeft},0)`)
                    .call(d3.axisLeft(y).tickValues(y.ticks().filter(d => d !== 0).filter(Number.isInteger)).tickFormat(d3.format("d")))
                    .call(g => g.selectAll(".tick line").clone()
                        .attr("x2", width - marginLeft - marginRight)
                        .attr("stroke-opacity", 0.25));

                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", 76)
                    .attr("y", 10)
                    .attr("font-size", 10)
                    .attr("fill", "currentColor")
                    .text("Daily Exercises");
            }
        }
    }
</script>

<template>
    <div class="contatiner">
        <svg id="chart"></svg>
    </div>
</template>

<style scoped>
    .container {
        background-color: var(--code-bg);
        border-radius: 12px;
        padding: 5px;
    }
</style>