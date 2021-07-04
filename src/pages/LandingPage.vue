<template>
  <q-header class="text-primary bg-accent" height-hint="98" reveal>
    <q-toolbar class="row justify-end q-py-lg constrain">
      <q-btn
        color="secondary"
        icon="eva-log-in-outline"
        label="Login"
        :to="{ name: 'login' }"
      />

      <q-btn
        color="white"
        class="q-ml-md"
        outline
        label="Signup"
        :to="{ name: 'login' }"
      />
    </q-toolbar>
  </q-header>
  <q-page class="bg-accent">
    <div class="section row">
      <div
        class="col-6 row items-center text-h3 text-white q-pa-xl justify-center"
      >
        <div class="logo-container">
          <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 147 219"
          >
            <path
              class="octalla-logo-svg"
              d="M75.62,123.5c-20.28,0-35.59-3.25-46.81-9.93C14.75,105.2,7.62,91.72,7.62,73.5a68,68,0,0,1,136,0c0,18.22-7.12,31.7-21.18,40.07C111.22,120.25,95.91,123.5,75.62,123.5Z"
            />
            <ellipse
              class="octalla-logo-eyes"
              cx="58.36"
              cy="85.93"
              rx="4.36"
              ry="5.93"
            />
            <ellipse
              class="octalla-logo-eyes"
              cx="93.89"
              cy="85.93"
              rx="4.36"
              ry="5.93"
            />
            <path
              class="octalla-logo-svg"
              d="M37.47,172a15.35,15.35,0,0,1-7.59-2.07,15.69,15.69,0,0,1-7.5-9.78,4,4,0,0,1,7.74-2A7.79,7.79,0,0,0,33.85,163a6.75,6.75,0,0,0,5,.83,6.1,6.1,0,0,0,4-5.29V131a4,4,0,0,1,8,0v28.07a14.07,14.07,0,0,1-9.75,12.42A13.19,13.19,0,0,1,37.47,172Z"
            />
            <path
              class="octalla-logo-svg"
              d="M44.2,212.5a29.63,29.63,0,0,1-28.15-21.79,5.5,5.5,0,0,1,10.65-2.78A18,18,0,0,0,35.37,199a16.72,16.72,0,0,0,12.5,2c5.37-1.52,9.36-6.67,10-12.84V133a5.5,5.5,0,0,1,11,0v55.68l0,.24c-1,10.78-8.19,19.89-18,22.67A24.47,24.47,0,0,1,44.2,212.5Z"
            />
            <path
              class="octalla-logo-svg"
              d="M111.78,172a13.19,13.19,0,0,1-3.65-.51,14.07,14.07,0,0,1-9.75-12.42V131a4,4,0,0,1,8,0v27.52a6.1,6.1,0,0,0,4,5.29,6.75,6.75,0,0,0,5-.83,7.79,7.79,0,0,0,3.73-4.82,4,4,0,0,1,7.74,2,15.69,15.69,0,0,1-7.5,9.78A15.35,15.35,0,0,1,111.78,172Z"
            />
            <path
              class="octalla-logo-svg"
              d="M105.05,212.5a24.47,24.47,0,0,1-6.68-.91c-9.78-2.78-17-11.89-18-22.67l0-.49V133a5.5,5.5,0,0,1,11,0v55.17c.65,6.17,4.64,11.32,10,12.84a16.72,16.72,0,0,0,12.5-2,18,18,0,0,0,8.67-11.11,5.5,5.5,0,0,1,10.65,2.78,29.63,29.63,0,0,1-28.15,21.79Z"
            />
          </svg>
        </div>
      </div>
      <div class="col-6 column justify-center text-white q-pa-xl">
        <h1>Meet Octalla.</h1>
        <div class="text-h4">
          Mission-driven project management for mission-driven teams.
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.logo-container {
  width: 30rem;
}
.octalla-logo-svg {
  fill: white;
}

.octalla-logo-eyes {
  fill: $accent;
}

.section {
  flex-grow: 1;
}
</style>
