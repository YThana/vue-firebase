<script setup lang="ts">
import { useFirebaseAuth } from 'vuefire'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { GoogleAuthProvider } from 'firebase/auth'
import { ref } from 'vue'
import { FirebaseError } from 'firebase/app'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
const auth = useFirebaseAuth()!
const googleAuthProvider = new GoogleAuthProvider()
const router = useRouter()

const validationSchema = toTypedSchema(
  z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
)

const { errors, handleSubmit, defineField, isSubmitting } = useForm({
  validationSchema,
  initialValues: {
    email: '',
    password: '',
  },
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const error = ref<string>()
const loadingSignInUsingGoogle = ref<boolean>(false)

const onSubmitSignInUsingEmailPassword = handleSubmit(async (values) => {
  error.value = ''
  try {
    await signInWithEmailAndPassword(auth, values.email, values.password)
    await router.push('/home')
  } catch (e) {
    if (e instanceof FirebaseError) {
      if (e.code === 'auth/wrong-password') {
        error.value = 'wrong password entered'
      } else if (e.code === 'auth/user-not-found') {
        error.value = 'user not found'
      } else {
        return error.value
      }
    }
  }
})

const signInUsingGoogle = async () => {
  error.value = ''
  loadingSignInUsingGoogle.value = true
  try {
    await signInWithPopup(auth, googleAuthProvider)
    await router.push('/home')
  } catch (e) {
    if (e instanceof FirebaseError) {
      loadingSignInUsingGoogle.value = false
      if (e.code === 'auth/popup-closed-by-user') {
        error.value = 'google Sign-in cancelled. Please try again.'
      } else {
        error.value = e.code
      }
    }
  }
  loadingSignInUsingGoogle.value = false
}
</script>

<template>
  <div class="flex items-center justify-center w-full min-h-screen p-6">
    <div
      class="flex flex-col gap-5 ring-1 ring-slate-200 bg-slate-50 py-10 px-7 rounded-xl w-full max-w-lg"
    >
      <h1 class="font-bold text-4xl">Sign in</h1>

      <h4>
        Don't have an account?
        <span><RouterLink class="router-link" to="/sign-up">Sign up</RouterLink></span>
      </h4>

      <div
        v-if="error"
        class="relative capitalize text-red-700 group ring-1 ring-red-400 bg-red-200 px-4 py-4 rounded-md text-wh"
      >
        {{ error }}
        <button
          class="group-hover:flex hidden absolute top-2 right-2 px-3 py-1 text-sm bg-red-500 hover:bg-red-600 rounded-md text-white font-bold"
          @click="error = ''"
        >
          Close
        </button>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="onSubmitSignInUsingEmailPassword">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            name="email"
            id="email"
            type="email"
            v-model="email"
            v-bind="emailAttrs"
            :class="
              errors.email
                ? 'ring-red-500 focus:ring-red-500'
                : 'ring-slate-300 focus:ring-green-500'
            "
          />
          <span class="text-red-500">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            name="password"
            id="password"
            type="password"
            v-model="password"
            v-bind="passwordAttrs"
            :class="
              errors.password
                ? 'ring-red-500 focus:ring-red-500'
                : 'ring-slate-300 focus:ring-green-500'
            "
          />
          <span class="text-red-500">{{ errors.password }}</span>
        </div>

        <button class="btn" type="submit" :disabled="isSubmitting">
          <LoadingSpinner v-if="isSubmitting" class="text-white" />
          Sign in
        </button>
      </form>

      <hr class="border border-slate-200" />

      <button class="btn" @click="signInUsingGoogle" :disabled="loadingSignInUsingGoogle">
        <LoadingSpinner v-if="loadingSignInUsingGoogle" class="text-white" />
        Sign in using Google
      </button>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
