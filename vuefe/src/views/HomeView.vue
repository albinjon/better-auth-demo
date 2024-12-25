<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
        ></div>
      </div>

      <div v-else>
        <!-- Logged In State -->
        <div v-if="session" class="bg-white p-8 rounded-lg shadow-md">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900">Welcome!</h2>
            <p class="mt-2 text-gray-600">{{ session.user?.email }}</p>
          </div>
          <div class="mt-6">
            <button
              type="button"
              @click="handleLogout"
              class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-md transition duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>

        <!-- Login/Register Forms -->
        <div v-else class="bg-white p-8 rounded-lg shadow-md">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900">
              {{ isRegistering ? "Create Account" : "Sign In" }}
            </h2>
          </div>

          <!-- Email Input -->
          <div class="mb-4">
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="text"
              required
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="you@example.com"
            />
          </div>

          <!-- Password Input -->
          <div class="mb-4">
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="••••••••"
            />
          </div>

          <!-- Name Input (Registration only) -->
          <div v-if="isRegistering" class="mb-4">
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              v-model="name"
              type="text"
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="John Doe"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mb-4 text-center">
            <p class="text-red-500 text-sm">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <div class="mb-4">
            <button
              type="button"
              @click="isRegistering ? handleRegister() : handleLogin()"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-md transition duration-200"
            >
              {{ isRegistering ? "Create Account" : "Sign In" }}
            </button>
          </div>

          <!-- Toggle Register/Login -->
          <div class="text-center">
            <button
              type="button"
              @click="toggleRegister"
              class="text-blue-500 hover:text-blue-600 text-sm font-medium transition duration-200"
            >
              {{
                isRegistering
                  ? "Already have an account? Sign in"
                  : "Need an account? Create one"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authClient } from "@/api/auth-client";
import { ref, onMounted } from "vue";

interface User {
  id: string;
  email: string;
  name?: string;
}

// State
const session = ref<string>();
const loading = ref(true);
const error = ref("");
const email = ref("");
const password = ref("");
const name = ref("");
const isRegistering = ref(false);

// Handlers (to be implemented)
const checkSession = async () => {
  try {
    console.log("Checking session...");
    const res = await authClient.getSession();
    session.value = res.data?.session.token;
    loading.value = false;
  } catch (err) {
    console.error("Session check failed:", err);
    loading.value = false;
  }
};

const handleLogin = async () => {
  try {
    error.value = "";
    authClient.signIn.email({
      email: email.value,
      password: password.value,
      fetchOptions: {
        onSuccess: checkSession,
      },
    });
    // TODO: Implement login logic
  } catch (err) {
    console.error("Login failed:", err);
    error.value = "Login failed";
  }
};

const handleRegister = async () => {
  try {
    await authClient.signUp.email({
      email: email.value,
      password: password.value,
      name: name.value,
      fetchOptions: {
        onSuccess: checkSession,
      },
    });
    error.value = "";
    // TODO: Implement registration logic
  } catch (err) {
    console.error("Registration failed:", err);
    error.value = "Registration failed";
  }
};

const handleLogout = async () => {
  try {
    console.log("Logout attempt");
    await authClient.signOut({
      fetchOptions: {
        onSuccess: checkSession,
      },
    });
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

const toggleRegister = () => {
  isRegistering.value = !isRegistering.value;
  error.value = "";
  email.value = "";
  password.value = "";
  name.value = "";
};

// Check session on mount
onMounted(checkSession);
</script>
