<script setup lang="ts">
import { signOut } from 'firebase/auth'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentUser = useCurrentUser()
const auth = useFirebaseAuth()!

const logOut = async () => {
  await signOut(auth)
  await router.push({ path: '/sign-in' })
}
</script>

<template>
  <div class="flex flex-col gap-4 justify-center px-6 py-10">
    <h1 class="text-4xl text-center font-bold">Home page</h1>
    <pre>{{ currentUser }}</pre>
    <button class="btn" @click="logOut">Sign out</button>
  </div>
</template>

<style scoped lang="postcss">
.btn {
  @apply w-full bg-green-500 hover:bg-green-600 py-2 px-4 rounded-xl mt-4 text-white font-bold;
}
</style>
