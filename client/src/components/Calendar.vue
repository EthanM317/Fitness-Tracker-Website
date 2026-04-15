<template>
  <div class="calendar">
    <h1>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
      </svg>
      Exercise Tracker
    </h1>
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
        const localYear = date.getFullYear();
        const localMonth = String(date.getMonth() + 1).padStart(2, '0');
        const localDay = String(date.getDate()).padStart(2, '0');

        days.push({
          date: `${localYear}-${localMonth}-${localDay}`,
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
  min-height: 60px;
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
