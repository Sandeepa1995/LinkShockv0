<template>
  <div class="login">
    <v-layout style="background-color: dodgerblue">
      <v-flex xs12 sm8 offset-sm2  style="margin-bottom: 80px; margin-top: 50px;">
        <div class="text-xs-center">
          <v-icon style="font-size: 200px; color: white">
            lock_open</v-icon>
        </div>
    <v-card style="padding: 50px">
    <h3>{{ title }}</h3>
    <v-alert color="error" icon="warning" transition="scale-transition" value="true" v-show="message">
      {{message}}
    </v-alert>
    <v-alert color="success" icon="check_circle" transition="scale-transition" value="true" v-show="passedmessage">
      {{passedmessage}}
    </v-alert>
    <v-form v-model="valid" ref="form">
      <v-text-field
        label="E-mail"
        v-model="email"
        :rules="emailRules"
        :counter="254"
        required
      ></v-text-field>
      <v-text-field
        label="Password"
        v-model="password"
        ref="password"
        :rules="pWRules"
        :counter="60"
        type="password"
        required
      ></v-text-field>
      <v-btn
        @click="submit"
        :disabled="!valid"
      >
        submit
      </v-btn>
    </v-form>
    </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import axios from 'axios'
  import VCard from "vuetify/es5/components/VCard/VCard";
export default {
  components: {VCard},
  name: 'login',
  data: () => ({
    title: 'Login to LinkShock',
    valid: true,
    message: '',
    passedmessage:'',
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
      (v) => v && v.length <= 254 || 'Email must be less than 254 characters'
    ],
    password: '',
    pWRules: [
      (v) => !!v || 'Password is required',
      (v) => v && v.length <= 60 || 'Password must be less than 60 characters'
    ]
  }),
  mounted(){
    this.passedmessage=localStorage.getItem("message");
    localStorage.setItem("message","");
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
          axios({
            method: 'post',
            url: 'https://linkshockv2.herokuapp.com/authenticate',
            data: {
              email: this.email,
              password: this.password
            },
            headers: {'Content-Type': 'application/json'}
          }).then((response) => {
            console.log(response.data);
            if (!response.data.success) {
              this.message = response.data.msg;
            }
            else {
              localStorage.setItem("user",JSON.stringify(response.data.user));
              localStorage.setItem("token",response.data.token);
              this.$router.push('/home');
              location.reload();
            }
          })
            .catch(function (error) {
              console.log(error);
            });
      }
    }
  }
}
</script>

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
</style>
