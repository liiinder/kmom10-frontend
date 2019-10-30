<template>
    <div>
        <Nav />
        <h2 v-if="loading">{{ loading }}</h2>
        <reactive-line-chart v-else :chart-data="chartData" :options="chartOptions"/>
        <div class="wrapper">
            <div class="stock" v-for="(brand, index) in chartData.datasets" :key="index">
                <h1>{{ brand.label }}</h1>
                <button v-if="token" @click="buyStock(brand)">
                    Köp nu!!!
                </button>
                <p>
                    Pris: {{ Math.round(brand.data[brand.data.length -1]*100)/100 }}kr
                </p>
            </div>
        </div>
        <h2 v-if="message">{{message}}</h2>
        <!-- <pre>{{ message }}</pre> -->
    </div>
</template>

<script>
import Nav from './Nav.vue'
import io from 'socket.io-client'
import axios from 'axios'
import ReactiveLineChart from "./ReactiveLineChart.js";
export default {
    name: 'Stocks',
    components: {
        Nav, ReactiveLineChart
    },
    data() {
        return {
            email: (this.$store.getters.getUser) ? this.$store.getters.getUser.email : "",
            message: "",
            loading: "Hämtar data från servern",
            token: this.$store.getters.getToken,
            chartData: {},
            chartOptions: {
                maintainAspectRatio: false,
                animation: false,
                legend: {
                    position: "bottom"
                },
                responsive: true,
                lineTension: 1,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false,
                            padding: 0,
                        }
                    }]
                }
            },
            socket: io(this.$store.getters.apiURL)
        }
    },
    methods: {
        logout() {
            this.$store.dispatch('setUser', "");
            this.$store.dispatch('setToken', "");
            this.$router.push('Login');
        },
        formatDate(date) {
            let d = new Date(date);

            return d.getFullYear() + "-" +
                ('0' + (d.getMonth() + 1)).slice(-2) + "-" +
                ('0' + d.getDate()).slice(-2) + " " +
                ('0' + d.getHours()).slice(-2) + ":" +
                ('0' + d.getMinutes()).slice(-2) + ":" +
                ('0' + d.getSeconds()).slice(-2);
        },
        buyStock(brand) {
            axios.post(`${this.$store.getters.apiURL}/auth/stock`, {
                email: this.email,
                price: Math.round(brand.data[brand.data.length -1] * 100) / 100,
                company: brand.label,
                amount: 1
            }, {
                headers: {'x-access-token': this.$store.getters.getToken}
            }).then(response => {
                this.message = response.data.msg;
                this.$store.dispatch('setUser', response.data.user);
            }).catch(e => {
                // console.log("e: " + JSON.stringify(e));
                if (e.response.data.msg == "Invalid Token") {
                    this.logout();
                }
                this.message = e.response.data.msg;
            });
        },
    },
    mounted() {
        this.socket.on('stocks', (data) => {
            this.chartData = { datasets: data, labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]};
            this.loading = "";
        });
    }
}
</script>

<style lang="css" scoped>
.wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.5em;
}

.stock {
    padding: 1em;
    border: 1px solid #aaa;
}

pre {
    margin-top: 3em;
}

button {
    background-color: lightgreen;
    font-weight: bold;
    font-size: 1.2em;
    padding: 1em 2em;
    float: right;
}

button:active {
    background-color: #ccc;
}

@media screen and (max-width: 600px) {
    .wrapper {
        grid-template-columns: 1fr;
    }

    h1 {
        font-size: 1.5em;
    }

    p {
        font-size: 1.1em;
    }

    button {
        padding: 0.5em 0.75em;
    }
}

</style>