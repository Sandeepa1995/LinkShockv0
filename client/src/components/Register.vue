<template>
  <div class="register">
    <v-alert color="error" icon="warning" transition="scale-transition" value="true" v-show="message.length>0">
      {{message}}
    </v-alert>
    <v-layout style="background-color: dodgerblue">
      <v-flex xs12 sm8 offset-sm2  style="margin-bottom: 80px; margin-top: 50px;">
        <div class="text-xs-center">
        <v-icon style="font-size: 200px; color: white">
          person_add</v-icon>
        </div>
    <v-card style="padding: 50px">
      <h3>{{ title }}</h3>
    <v-form v-model="valid" ref="form">
      <v-text-field
        label="Name"
        v-model="name"
        :rules="nameRules"
        :counter="60"
        required
      ></v-text-field>
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
        :counter="15"
        type="password"
        required
      ></v-text-field>
      <v-text-field
        label="Confirm Password"
        v-model="confirmedPW"
        ref="confirmedPW"
        v-bind:counter="password.length"
        :rules="[() => !!confirmedPW || 'Please confirm the password entered above',
                () => confirmedPW==password || 'The entered passwords do not match'
        ]"
        type="password"
        required
      ></v-text-field>
      <v-btn
        @click="submit"
        :disabled="!valid"
      >
        submit
      </v-btn>
      <v-btn @click="clear">clear</v-btn>
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
  name: 'register',
  data: () => ({
    title: 'Register to LinkShock',
    valid: true,
    message: '',
    name: '',
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => v && v.length <= 60 || 'Name must be less than 60 characters'
    ],
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
      (v) => v && v.length <= 254 || 'Email must be less than 254 characters'
    ],
    password: '',
    confirmedPW:'',
    pWRules: [
      (v) => !!v || 'Password is required',
      (v) => v && v.length <= 15 || 'Password must be less than 15 characters'
    ]
  }),
  methods: {
    submit () {
      if (this.password === this.confirmedPW) {
        if (this.$refs.form.validate()) {
          axios({
            method: 'post',
            url: 'https://linkshockv2.herokuapp.com/register',
            data: {
              name: this.name,
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
              sessionStorage.setItem("message", response.data.msg);
              this.$router.push('/login');
            }
          })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
      else {
        alert("Passwords do not match");
      }
    },
    clear () {
      this.$refs.form.reset();
      this.message='';
    }

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

</style>
