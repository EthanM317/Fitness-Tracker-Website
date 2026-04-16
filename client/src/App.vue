<script>
import { RouterLink, RouterView } from 'vue-router'
import AppLogo from './components/AppLogo.vue'

export default {
  components: {
    AppLogo
  },
  name: 'App'
}
</script>

<template>
  <div id="app">
    <nav>
      <AppLogo class="logo" />
      <RouterLink to="/">Calendar</RouterLink>
      <RouterLink to="/instructions">Instructions</RouterLink>
      <RouterLink to="/records">Personal Bests</RouterLink>
    </nav>
    <router-view />
  </div>
</template>

<style>
body {
  background-color: var(--code-bg);
  margin: 0;
}

nav {
  display: flex;
  align-items: center;
  background-color: var(--social-bg);
  padding: 12px;
  margin: 12px;
  border-radius: 30px;
  border: 1px solid var(--border);
  text-align: left;
}

nav a {
  font-weight: bold;
  color: var(--text-h);
  text-decoration: none;
  margin: 2px 10px;
}

nav a:hover {
  color: var(--accent);
}

.logo {
  margin-right: 10px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: var(--bg);
  width: 75%;
  margin: 0 auto;
  min-height: 100vh;
}
</style>
