<template>
  <div id="app">
    <div class="h-100">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
#app {
  height: 100vh;
  width: 100vw;
  max-height: 100vh;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
