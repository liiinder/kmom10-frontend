<template>
<div>
    <Nav />
        <form @submit.prevent="submitForm">
        <legend for="name">Namn</legend>
        <input type="text" name="name" v-model="name" required minlength="2">
        <legend for="email">Email</legend>
        <input type="email" name="email" v-model="this.$store.getters.getUser.email" required disabled>
        <legend>Födelsedag</legend>
        <select name="year" v-model="selectedYear" required>
            <option disabled value="">År</option>
            <option
                v-for="(n,index) in 120"
                :key="index"
                :value="date.getFullYear()-index">
                {{ date.getFullYear()-index }}
            </option>    
        </select>
        <select name="month" v-model="selectedMonth" required>
            <option disabled value="">Månad</option>
            <optgroup label="bokstäver">
                <option v-for="(month, index) in months" :key="index" :value="('00' + (index+1)).slice(-2)">{{ month }}</option>
            </optgroup>
            <optgroup label="siffror">
                <option v-for="(month, index) in 12" :key="index" :value="('00' + (index+1)).slice(-2)">{{ ("00" + month).slice(-2) }}</option>            
            </optgroup>
        </select>
        <select name="day" v-model="selectedDay" required>
            <option disabled value="">Dag</option>
            <option
                v-for="day in getDaysInMonth(selectedYear, selectedMonth)"
                :key="day"
                :value="('00' + day).slice(-2)">{{ ("00" + day).slice(-2) }}
            </option>
        </select>
        <br>
        <label for="gdrp">Godkänner du att vi inte följer GDPR?</label>
        <button type="button" class="accept" @click="accept = accept ? false : true">
            <i v-if="accept" class="fas fa-check"></i>
            <i v-else class="fas fa-square-full"></i>
            <input type="checkbox" class="hidden" required :value="accept" :checked="accept" tabindex="-1">
        </button>
        <br>
        <div class="depowrap">
            <div>
                <legend for="balance">Balans</legend>
                <input type="text" name="balance" :value="twoD(this.$store.getters.getUser.balance)+'kr'" disabled>
            </div>
            <div>
                <legend for="deposit">Insättning</legend>
                <input type="number" name="deposit" v-model="deposit">
            </div>
        </div>
        <div class="clearfix">
            <button type="button" class="logout red" @click="logout">
                Logga ut
            </button>
            <input type="submit" class="green" value="Uppdatera">
        </div>
        <br>
        </form>
        <table v-if="stockData" class="table-stacked">
            <tr v-if="this.$store.getters.getUser.stocks">
                <th>Företag</th>
                <th>Antal</th>
                <th>Inköpsvärde</th>
                <th>Värde</th>
                <th>À-pris</th>
                <th></th>
            </tr>
            <tr v-for="stock in this.$store.getters.getUser.stocks" :key="stock._id">
                <td data-title="Företag">{{ stock.company }}</td>
                <td data-title="Antal" class="textright">{{ stock.amount }} st</td>
                <td data-title="Inköpsvärde" class="textright">{{ twoD(stock.paid) }} kr</td>
                <td data-title="Värde" class="textright" :class="(twoD((stock.amount * stockData[stock.company])) < stock.paid) ? 'red' : 'green'">{{ twoD((stock.amount * stockData[stock.company])) }} kr</td>
                <td data-title="À-pris" class="textright">{{ stockData[stock.company] }} kr</td>
                <td class="buy-sell">
                    <button @click="transaction(stock.company, -1)">Sälj</button>
                    <button @click="transaction(stock.company, 1)">Köp</button>
                </td>
            </tr>
        </table>
        <!-- <pre>{{ this.$store.getters.getUser }}</pre> -->
        <!-- <pre>{{ stockData }}</pre> -->
    <h2 v-if="message">{{ message }}</h2>
</div>
</template>

<script>
import Nav from './Nav.vue'
import axios from 'axios'
import io from 'socket.io-client'

export default {
    name: 'User',
    components: {
        Nav
    },
    mounted() {
        if (!this.$store.getters.getToken) {
            this.$router.push('Login');
        } else {
            this.user = this.$store.getters.getUser;
        }
        this.socket.on('stocks', (data) => {
            let temp = {}
            data.forEach((stock) => {
                temp[stock.label] = this.twoD(stock.data[stock.data.length -1]);
            });
            // this.message = data;
            this.stockData = temp;
        });
    },
    methods: {
        twoD(num) {
            return Math.round(num * 100) / 100;
        },
        getDaysInMonth(year, month) {
            return new Date(year, month, 0).getDate();
        },
        submitForm() {
            axios.post(`${this.$store.getters.apiURL}/auth/update`, {
                user: this.$store.getters.getUser,
                birth: this.selectedYear+this.selectedMonth+this.selectedDay,
                name: this.name,
                deposit: this.deposit,
                // password: this.password
            }, {
                headers: {'x-access-token': this.$store.getters.getToken}                
            }).then(response => {
                this.message = response.data.msg;
                this.$store.dispatch('setUser', response.data.user);
                this.deposit = "";
            }).catch(e => {
                // console.log("e: " + JSON.stringify(e));
                if (e.response.data.msg == "Invalid Token") {
                    this.logout();
                }
                this.message = e.response.data.msg;
            });
        },
        logout() {
            this.$store.dispatch('setUser', "");
            this.$store.dispatch('setToken', "");
            this.$router.push('Login');
        },
        transaction(brand, amount) {
            axios.post(`${this.$store.getters.apiURL}/auth/stock`, {
                email: this.$store.getters.getUser.email,
                price: this.twoD(this.stockData[brand]),
                company: brand,
                amount: amount
            }, {
                headers: {'x-access-token': this.$store.getters.getToken+"ad"}
            }).then(response => {
                this.$store.dispatch('setUser', response.data.user);
                this.message = response.data.msg;
            }).catch(e => {
                // console.log("e: " + JSON.stringify(e));
                if (e.response.data.msg == "Invalid Token") {
                    this.logout();
                }
                this.message = e.response.data.msg;
            });
        },
    },
    data() {
        return {
            stockData: {},
            date: new Date(),
            months: [" januari "," februari "," mars "," april "," maj "," juni "," juli "," augusti "," september "," oktober"," november "," december "],
            accept: true,
            deposit: "",
            name: (this.$store.getters.getUser) ? this.$store.getters.getUser.name : "",
            selectedYear: (this.$store.getters.getUser) ? this.$store.getters.getUser.birth.slice(0, 4) : "",
            selectedMonth: (this.$store.getters.getUser) ? this.$store.getters.getUser.birth.slice(4, 6) : "",
            selectedDay: (this.$store.getters.getUser) ? this.$store.getters.getUser.birth.slice(6, 8) : "",
            message: "",
            socket: io(this.$store.getters.apiURL)
        }
    }
}
</script>

<style scoped>
legend {
    margin-top: 1em;
}

legend:after {
    content:':';
}

select,
option,
input {
    background-color: #fff;
    padding: 0.25em;
    font-size: 1.2em;
    width: 100%;
}

select,
option {
    width: 33.33%;
    margin-bottom: 1em;
}


input[type=submit] {
    width: auto;
    float: right;
    margin-top: 1em;
}

input:focus,
button:focus,
select:focus,
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
    /* width: 15vw; */
    font-weight: normal;
}

.buy-sell button {
    margin: 0 0.25em;
    padding: 0.25em 0.5em;
}

.clearfix {
    overflow: auto;
}

.clearfix::after {
    content: "";
    clear: both;
    display: table;
}

th,td {
    padding: 0 1em;
}

.textright {
    text-align: right;
}

@media screen and (max-width: 600px) {
    .table-stacked {
        display: block;
    }

    .table-stacked tr {
        display: block;
        margin-bottom: 1em;
    }

    /* We do not use display: none; for accessibility reasons */
    .table-stacked th {
        position: absolute;
        top: -9999px;
        left: -9999px;
    }

    .table-stacked td {
        display: block;
        border: none;
        border-bottom: 1px solid #eee;
        position: relative;
        padding-left: 50%;
        white-space: normal;
        text-align:right;
    }

    .table-stacked td:before {
        /* För att visa tabell rubrik */
        content: attr(data-title);
        /* Använder top och left för efterlikna padding */
        position: absolute;
        top: 0;
        left: 0.33rem;
        width: 45%;
        padding-right: 0.55rem;
        white-space: nowrap;
        text-align:left;
        font-weight: bold;
    }

    .table-stacked td.buy-sell {
        padding: 0
    }
}
</style>
