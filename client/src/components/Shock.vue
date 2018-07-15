<template>
  <div class="login">
    <v-card style="padding: 50px">
    <v-form>
      <v-text-field
        label="Shock ID"
        v-model="shock_id"
      ></v-text-field>
      <v-text-field
        label="Password"
        v-model="shock_pass"
      ></v-text-field>
      <v-text-field
        label="Admin Password"
        v-model="admin_pass"
      ></v-text-field>
      <v-text-field
        label="AdaFruit Feed Key"
        v-model="ada_key"
      ></v-text-field>
      <v-text-field
        label="AdaFruit Data X-AIO-Key"
        v-model="ada_aio"
      ></v-text-field>
      <v-btn
        @click="submit"
      >
        submit
      </v-btn>
    </v-form>
    </v-card>
  </div>
</template>

<script>
  import axios from 'axios'
  import VCard from "vuetify/es5/components/VCard/VCard";
export default {
  components: {VCard},
  name: 'login',
  data: () => ({
    shock_id: '',
    shock_pass: '',
    admin_pass:'',
    ada_key:'',
    ada_aio:''
  }),
  methods: {
    submit () {
          axios({
            method: 'post',
            url: 'https://linkshockv2.herokuapp.com/shock',
            data: {
              id: this.shock_id,
              admin_pass: this.admin_pass,
              password: this.shock_pass,
              ada_key: this.ada_key,
              ada_aio: this.ada_aio
            },
            headers: {'Content-Type': 'application/json'}
          }).then((response) => {
            if (!response.data.success) {
              console.log("Fail");
            }
            else {
              console.log("Success");
            }
          })
            .catch(function (error) {
              console.log(error);
            });
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
