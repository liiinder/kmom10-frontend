<template>
<div>
    <Nav />
    <h2>Logga in</h2>
    <form @submit.prevent="submitForm">
        <legend for="email">Email</legend>
        <input type="email" name="email" v-model="email" required>
        <legend for="password">Lösenord (minst 8 tecken)</legend>
        <button
            type="button"
            id="showPassword"
            :class="showPassword ? 'green' : 'red'"
            @click="showPassword = showPassword ? false : true">
            <i v-if="showPassword" class="fas fa-eye"> visar</i>
            <i v-else class="fas fa-eye-slash"> dolt</i>
        </button>
        <input
            :type="showPassword ? 'text' : 'password'"
            name="password"
            class="password"
            v-model="password" 
            required minlength="8">
        <div class="clearfix">
            <input type="submit" value="Logga in">
        </div>
        <label for="register">Har du inget konto och vill registrera dig?</label>
        <button type="button" class="accept" @click="reg = reg ? false : true">
            <i v-if="reg" class="fas fa-check"></i>
            <i v-else class="fas fa-square-full"></i>
            <input type="checkbox" class="hidden" name="register" :value="reg" :checked="reg" tabindex="-1">
        </button>
    </form>
    <h2 v-if="message">{{ message }}</h2>
</div>
</template>
<script>
import Nav from './Nav.vue'
import axios from 'axios'
export default {
    name: 'Login',
    components: {
        Nav
    },
    methods: {
        submitForm() {
            if (this.reg) {
                axios.post(`${this.$store.getters.apiURL}/auth/register`, {
                    email: this.email,
                    password: this.password
                }).then(response => {
                    this.message = response.data.msg;
                    this.login();
                }).catch(e => {
                    this.message = e.response.data.msg;
                });
            } else {
                this.login();
            }
        },
        login() {
            axios.post(`${this.$store.getters.apiURL}/auth/login`, {
                email: this.email,
                password: this.password
            }).then(response => {
                this.message = response.data.msg;
                this.$store.dispatch('setUser', response.data.user);
                this.$store.dispatch('setToken', response.data.token);
                this.$router.push('User');
            }).catch(e => {
                // console.log("e: " + JSON.stringify(e));
                this.message = e.response.data.msg;
            });
        }
    },
    data() {
        return {
            showPassword: true,
            email: "",
            password: "",
            message: "",
            reg: false
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

legend {
    margin-top: 1em;
}

legend:after {
    content:':';
}

input {
    background-color: #fff;
    padding: 0.25em;
    font-size: 1.2em;
    width: 100%;
}

input[type=submit] {
    width: auto;
    float: right;
    margin: 0.5em 0;
    padding: 0.25em 0.5em;
}

input:focus,
button:focus,
button:focus i {
    background-color: #ccc;
}

button:focus i.fa-square-full {
    color: #ccc;
}

button i.fa-square-full {
    color: #fff;
}

button {
    z-index: 1;
    padding: 0.25em;
    font-size: 1.2em;
    font-weight: bold;
    background-color: #fff;
}

button.accept {
    margin-left: 0.75em;
}

i {
    position: relative;
    top: 0;
    left: 0;
    float: left;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0);
    font-size: 1.0em;
}

.password {
    width: 80%;
}

#showPassword {
    width: 20%;
}

.green {
    background-color: lightgreen;
}

.red {
    background-color: #faa;
}

.hidden {
    position: relative;
    bottom: -10px;
    left: -10px;
    z-index: -1;
    width: 1px;
    height: 1px;
}

.depowrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.5em;
}

.logout {
    margin-top: 1em;
    width: 15vw;
    font-weight: normal;
}

.clearfix {
    overflow: auto;
}

.clearfix::after {
    content: "";
    clear: both;
    display: table;
}

</style>