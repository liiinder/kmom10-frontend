<template>
<main>
    <Nav />
    <h1>Random discs</h1>
    <p>
        This is a fictional page designed for the course jsframeworks at BTH.
        And the "stocks" are weighted between 5 and 50 ;)
    </p>
</main>
</template>

<script>
import Nav from './Nav.vue'
export default {
  name: 'Home',
  props: { },
  components: {
      Nav,
  },
  data() {
    return {
        name: "",
        text: ""
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  margin-top: 1em;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 70%
}
</style>
