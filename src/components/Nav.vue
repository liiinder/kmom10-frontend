<template>
<nav>
    <ul>
        <li><router-link to="/"><i class="fas fa-home" alt="Home"></i></router-link></li>
        <li><router-link to="/stocks">Aktier</router-link></li>
        <li v-if="this.$store.getters.getToken"><router-link to="/user">Profil</router-link></li>
        <li v-else><router-link to="/login">Login</router-link></li>
    </ul>
</nav>
</template>

<script>
export default {
    name: 'Nav',
    props: { }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
    list-style-type: none;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

li {
    justify-self: center;
}

li a {
    text-decoration: none;
    color: white;
    font-size: 1.4em;
    border: 3px solid #0be6d7;
    background-color: rgb(53, 195, 251);
    color: #333;
    font-weight: bold;
    border-radius: 0.10em;
    padding: 0.2em 0.5em;
}

li a:hover {
    text-decoration: underline;
    background-color: #bbb;
}

i {
    background-color: rgba(0, 0, 0, 0.0);
}

nav {
    margin-bottom: 2em;
}

@media screen and (max-width: 600px) {

}
</style>