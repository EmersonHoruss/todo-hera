<template>
  <header class="header">
    <h1>My App</h1>
    <nav>
      <button @click="$router.push('/users')">Users</button>
      <button @click="$router.push('/todos')">Todos</button>
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #333;
  color: white;
}
nav button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
nav button:hover {
  background-color: #ddd;
}
</style>
