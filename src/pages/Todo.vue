<script setup>
import * as mutations from "../graphql/mutations";
import * as queries from "../graphql/queries";
import { generateClient } from "aws-amplify/api";
import { ref, onMounted } from "vue";

const client = generateClient();

const name = ref("");
const description = ref("");
const todos = ref([]);
const editingTodo = ref(null);

async function submitForm() {
  if (!name.value || !description.value) return;

  const input = {
    name: name.value,
    description: description.value,
  };

  if (editingTodo.value) {
    await client.graphql({
      query: mutations.updateTodo,
      variables: {
        input: {
          id: editingTodo.value.id,
          ...input,
        },
      },
    });
    editingTodo.value = null;
  } else {
    await client.graphql({
      query: mutations.createTodo,
      variables: { input },
    });
  }

  name.value = "";
  description.value = "";
  fetchtodos();
}

async function fetchtodos() {
  const result = await client.graphql({
    query: queries.listTodos,
  });
  todos.value = result.data.listTodos.items;
}

function editTodo(todo) {
  editingTodo.value = todo;
  name.value = todo.name;
  description.value = todo.description;
}

async function deleteTodo(id) {
  await client.graphql({
    query: mutations.deleteTodo,
    variables: { input: { id } },
  });
  fetchtodos();
}

onMounted(() => {
  fetchtodos();
});
</script>

<template>
  <div class="flex flex-col md:flex-row gap-6 p-6 min-h-screen bg-gray-100">
    <!-- Form Section -->
    <div class="w-full md:w-1/3 bg-white p-6 rounded-xl shadow">
      <h2 class="text-2xl font-semibold mb-4">
        {{ editingTodo ? "Update Todo" : "Create Todo" }}
      </h2>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block font-medium">Name</label>
          <input
            v-model="name"
            type="text"
            class="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label class="block font-medium">Description</label>
          <input
            v-model="description"
            type="text"
            class="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {{ editingTodo ? "Update" : "Create" }}
        </button>
      </form>
    </div>

    <!-- Table Section -->
    <div class="w-full md:w-2/3 bg-white p-6 rounded-xl shadow overflow-x-auto">
      <h2 class="text-2xl font-semibold mb-4">Todos</h2>
      <table class="w-full table-auto border-collapse">
        <thead>
          <tr class="bg-gray-200 text-left">
            <th class="p-2">Name</th>
            <th class="p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="todo in todos"
            :key="todo.id"
            class="border-t hover:bg-gray-100"
          >
            <td class="p-2">{{ todo.name }}</td>
            <td class="p-2">{{ todo.description }}</td>
            <td class="p-2 space-x-2">
              <button
                @click="editTodo(todo)"
                class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                @click="deleteTodo(todo.id)"
                class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
