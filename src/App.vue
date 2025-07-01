<script setup>
import * as mutations from "./graphql/mutations";
import * as queries from "./graphql/queries";
import { generateClient } from "aws-amplify/api";
import { onMounted, ref } from "vue";

const client = generateClient();

const name = ref("");
const description = ref("");
const todos = ref([]);
const editingTodo = ref(null);

async function submitForm() {
  if (!name.value || !description.value) return;

  if (editingTodo.value) {
    await client.graphql({
      query: mutations.updateTodo,
      variables: {
        input: {
          id: editingTodo.value.id,
          name: name.value,
          description: description.value,
        },
      },
    });
    editingTodo.value = null;
  } else {
    await client.graphql({
      query: mutations.createTodo,
      variables: {
        input: { name: name.value, description: description.value },
      },
    });
  }

  name.value = "";
  description.value = "";
  fetchTodos();
}

async function fetchTodos() {
  const result = await client.graphql({ query: queries.listTodos });
  todos.value = result.data.listTodos.items;
}

async function deleteTodo(id) {
  await client.graphql({
    query: mutations.deleteTodo,
    variables: { input: { id } },
  });
  fetchTodos();
}

function editTodo(todo) {
  editingTodo.value = todo;
  name.value = todo.name;
  description.value = todo.description;
}

onMounted(() => {
  fetchTodos();
});
</script>

<template>
  <div class="container">
    <div class="form-container">
      <h2>{{ editingTodo ? "Update Todo" : "Create Todo" }}</h2>

      <form @submit.prevent="submitForm">
        <label>Name</label>
        <input v-model="name" required />

        <label>Description</label>
        <input v-model="description" required />

        <button type="submit">
          {{ editingTodo ? "Update" : "Create" }}
        </button>
      </form>
    </div>

    <div class="table-container">
      <h2>Todos</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="todo in todos" :key="todo.id">
            <td>{{ todo.name }}</td>
            <td>{{ todo.description }}</td>
            <td>
              <button class="edit" @click="editTodo(todo)">Edit</button>
              <button class="delete" @click="deleteTodo(todo.id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f3f3f3;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}

.container {
  display: flex;
  gap: 30px;
}

.form-container,
.table-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

form label {
  margin-bottom: 5px;
  font-weight: bold;
}

form input {
  margin-bottom: 15px;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

form button {
  background-color: #2e7d32;
  color: white;
  padding: 10px;
  border: none;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
}

form button:hover {
  background-color: #1b5e20;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

button.edit {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 6px 10px;
  margin-right: 6px;
  border-radius: 4px;
  cursor: pointer;
}

button.edit:hover {
  background-color: #0d47a1;
}

button.delete {
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}

button.delete:hover {
  background-color: #b71c1c;
}
</style>
