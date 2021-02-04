<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
html,body{
  height: 100%;
  padding: 0;
  margin: 0;
}
#app{
  height: 100%;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

</style>
