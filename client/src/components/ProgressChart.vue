<template>
  <div class="progress-chart">
    <h2>Progress Chart</h2>
    <div id="chart"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'ProgressChart',
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
      const svg = d3.select('#chart')
      svg.selectAll('*').remove()

      if (this.exercises.length === 0) return

      const data = this.exercises.map(e => ({
        date: new Date(e.date),
        weight: e.weight
      })).sort((a, b) => a.date - b.date)

      const margin = { top: 20, right: 30, bottom: 30, left: 40 }
      const width = 600 - margin.left - margin.right
      const height = 400 - margin.top - margin.bottom

      const svgElement = svg
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width])

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.weight)])
        .range([height, 0])

      svgElement.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))

      svgElement.append('g')
        .call(d3.axisLeft(y))

      const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.weight))

      svgElement.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('d', line)
    }
  }
}
</script>

<style scoped>
.progress-chart {
  margin: 20px auto;
  max-width: 800px;
}

#chart {
  border: 1px solid #ddd;
}
</style>