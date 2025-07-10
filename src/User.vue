<script setup>
import * as mutations from "./graphql/mutations";
import * as queries from "./graphql/queries";
import { generateClient } from "aws-amplify/api";
import { ref, onMounted } from "vue";

const client = generateClient();

const name = ref("");
const phone = ref("");
const age = ref("");
const address = ref("");
const users = ref([]);
const editingUser = ref(null);

async function submitForm() {
  if (!name.value || !phone.value || !age.value || !address.value) return;

  const input = {
    name: name.value,
    phone: phone.value,
    age: parseInt(age.value),
    address: address.value,
  };

  if (editingUser.value) {
    await client.graphql({
      query: mutations.updateUser,
      variables: {
        input: {
          id: editingUser.value.id,
          ...input,
        },
      },
    });
    editingUser.value = null;
  } else {
    await client.graphql({
      query: mutations.createUser,
      variables: { input },
    });
  }

  name.value = "";
  phone.value = "";
  age.value = "";
  address.value = "";
  fetchUsers();
}

async function fetchUsers() {
  const result = await client.graphql({
    query: queries.listUsers,
  });
  users.value = result.data.listUsers.items;
}

function editUser(user) {
  editingUser.value = user;
  name.value = user.name;
  phone.value = user.phone;
  age.value = user.age;
  address.value = user.address;
}

async function deleteUser(id) {
  await client.graphql({
    query: mutations.deleteUser,
    variables: { input: { id } },
  });
  fetchUsers();
}

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="flex flex-col md:flex-row gap-6 p-6 min-h-screen bg-gray-100">
    <!-- Form Section -->
    <div class="w-full md:w-1/3 bg-white p-6 rounded-xl shadow">
      <h2 class="text-2xl font-semibold mb-4">
        {{ editingUser ? "Update User" : "Create User" }}
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
          <label class="block font-medium">Phone</label>
          <input
            v-model="phone"
            type="text"
            class="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label class="block font-medium">Age</label>
          <input
            v-model="age"
            type="number"
            class="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label class="block font-medium">Address</label>
          <input
            v-model="address"
            type="text"
            class="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {{ editingUser ? "Update" : "Create" }}
        </button>
      </form>
    </div>

    <!-- Table Section -->
    <div class="w-full md:w-2/3 bg-white p-6 rounded-xl shadow overflow-x-auto">
      <h2 class="text-2xl font-semibold mb-4">Users</h2>
      <table class="w-full table-auto border-collapse">
        <thead>
          <tr class="bg-gray-200 text-left">
            <th class="p-2">Name</th>
            <th class="p-2">Phone</th>
            <th class="p-2">Age</th>
            <th class="p-2">Address</th>
            <th class="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-t hover:bg-gray-100"
          >
            <td class="p-2">{{ user.name }}</td>
            <td class="p-2">{{ user.phone }}</td>
            <td class="p-2">{{ user.age }}</td>
            <td class="p-2">{{ user.address }}</td>
            <td class="p-2 space-x-2">
              <button
                @click="editUser(user)"
                class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                @click="deleteUser(user.id)"
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
