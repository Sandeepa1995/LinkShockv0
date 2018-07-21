<template>
  <div class="home">
    <template>
      <v-parallax
        dark
        src="/../../static/home2.jpg"
      >
        <v-layout
          align-center
          column
          justify-center
        >
          <h1 class="display-2 font-weight-thin mb-3" style="text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; color: dodgerblue">{{ msg }}</h1>
          <h1 style="text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; color: darkorange">Link all your electrical appliances!</h1>
        </v-layout>
      </v-parallax>
      <v-layout style="background-color: dodgerblue">
        <v-flex xs12 sm8 offset-sm2  style="margin-bottom: 80px; margin-top: 50px;">
          <v-card  style="padding: 20px;">
            <h2 class="text-md-center"><strong>Have you ever?</strong></h2>
            <ul class="text-md-center">
              <li><h2>Left something on and left home?</h2></li>
              <br>
              <li><h2>Wondered how much electricity that you actually conume?</h2></li>
              <br>
            </ul>
            <br>
            <h1>Well worry no more!</h1>
            <h2 class="text-md-center">LinkShock is a SmartPlug where you can link to your device through a
              <strong>Link</strong> which controls the power given to the said device through a <strong>Shock</strong>,
              and can monitor the power usage.</h2>
            <br>
            <h1>Be Smart!</h1>
            <h1 style="color: dodgerblue">Link it!</h1>
            <h1 style="color: darkorange">Avoid a Shocking surprises!</h1>
            <h1>With <strong>LinkShock!</strong></h1>
            <v-card-actions v-if="!user">
              <v-flex xs12 sm4 offset-sm4 text-xs-center>
              <v-btn flat color="blue"  router
                     to="/register">Register</v-btn>
              <v-btn flat color="orange"  router
                     to="/login">Login</v-btn>
              </v-flex>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </template>
  </div>
</template>

<script>
import VCard from "vuetify/es5/components/VCard/VCard";

export default {
  components: {VCard},
  name: 'home',
  data () {
    return {
      user:JSON.parse(localStorage.getItem("user")),
      msg: 'Welcome to LinkShock',

    }
  },
  methods:{

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

  .home{
    text-align: center;
  }

.backRow label {
  width: 40px;
  height: 40px;
  outline: 1px solid;
}

.sideRow div .fullSeats {
  width: 40px;
  height: 40px;
  outline: 1px solid;
}

.sideRow div .emptySeats {
  width: 40px;
  height: 40px;
}

.selectedSeat{
   background-color: green;
 }

.unavailableSeat{
  background-color: red;
}
</style>
