<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="prevMonth">&lt;</button>
      <h2>{{ currentMonthName }} {{ currentYear }}</h2>
      <button @click="nextMonth">&gt;</button>
    </div>
    <div class="calendar-grid">
      <div v-for="day in daysOfWeek" :key="day" class="day-header">{{ day }}</div>
      <div
        v-for="day in calendarDays"
        :key="day.date"
        :class="['calendar-day', { 'other-month': !day.isCurrentMonth, 'today': day.isToday }]"
        @click="selectDate(day.date)"
      >
        {{ day.day }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  data() {
    return {
      currentDate: new Date(),
      daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
  },
  computed: {
    currentMonthName() {
      return this.currentDate.toLocaleString('default', { month: 'long' })
    },
    currentYear() {
      return this.currentDate.getFullYear()
    },
    calendarDays() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())

      const days = []
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        const isCurrentMonth = date.getMonth() === month
        const isToday = date.toDateString() === today.toDateString()
        days.push({
          date: date.toISOString().split('T')[0],
          day: date.getDate(),
          isCurrentMonth,
          isToday
        })
      }
      return days
    }
  },
  methods: {
    prevMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1)
    },
    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
    },
    selectDate(date) {
      this.$router.push({ name: 'DayView', params: { date } })
    }
  }
}
</script>

<style scoped>
button {
  background-color: var(--social-bg);
  padding: 1px 10px;
}

.calendar-header * {
  font-size: 36px;
}

.calendar {
  max-width: 800px;
  margin: 0 auto;
}

.calendar h1 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 2.5em;
  font-weight: bold;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 2px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day-header {
  font-weight: bold;
  padding: 10px;
  background-color: var(--code-bg);
  border: 1px solid var(--text);
}

.calendar-day {
  padding: 10px;
  border: 1px solid var(--text);
  cursor: pointer;
  min-height: 90px;
  font-size: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.calendar-day:hover {
  background-color: #e0e0e0;
}

.other-month {
  color: #999;
}

.today {
  background-color: #ffff99;
  color: var(--red-1);
}
</style>