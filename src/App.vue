<template>
  <div id="app" class="app">
    <link rel="stylesheet" 
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" 
        integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" 
        crossorigin="anonymous">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
@import url('https://rsms.me/inter/inter-ui.css');
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    font-size: 100%;
    font-family: 'Inter UI', sans-serif;
    background-color: #eee;
}

.app {
    width: 80vw;
    margin: 0 auto;
    padding: 2em 6em 8em;
    color: #333;
}

h1 {
    font-size: 4em;
    font-weight: 100;
}

h2 {
    font-size: 3em;
    font-weight: 100;
    text-transform: uppercase;
}

p {
    font-size: 2em;
    font-weight: normal;
}

pre {
    background-color: #333;
    color: #ddd;
    border-left: 0.5em solid rgb(1, 134, 12);
    padding: 0.5em;
}

@media screen and (max-width: 600px) {
    .app {
        width: 100vw;
        margin: 0 auto;
        padding: 0.5em;
    }
}

</style>