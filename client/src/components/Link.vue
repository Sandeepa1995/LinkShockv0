<template>
  <div class="login">
    <v-card style="padding: 50px">
    <v-form>
      <v-text-field
        label="Link ID"
        v-model="link_id"
      ></v-text-field>
      <v-text-field
        label="Password"
        v-model="link_pass"
      ></v-text-field>
      <v-text-field
        label="Admin Password"
        v-model="admin_pass"
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
    link_id: '',
    link_pass: '',
    admin_pass: ''
  }),
  methods: {
    submit () {
          axios({
            method: 'post',
            url: 'http://localhost:3000/link',
            data: {
              id: this.link_id,
              password: this.link_pass,
              admin_pass: this.admin_pass
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
