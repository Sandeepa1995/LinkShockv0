<template>
  <v-app>
    <v-toolbar dark class="light-blue darken-2">
      <v-toolbar-side-icon
        @click.native="sideNav=!sideNav"
        class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-icon dark style="padding-left: 20px">wifi_tethering</v-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">{{title}}</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems"
               :key="item.title"
               router
               :to="item.link">
          <v-icon left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>
        <v-btn flat v-show="loggable" @click="logout">
          <v-icon left>lock</v-icon>
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>Mythic &copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      fixed:true,
      title: 'LinkShock'
    }
  },
  computed:{
    loggable(){
      if(localStorage.getItem("user")){
        return true
      }
      else{
        return false
      }
    },
    menuItems(){
      let menuItems = [
        {icon:"person_add", title:"Register",link:'/register'},
        {icon:"lock_open", title:"Login",link:'/login'}
      ];
      if(localStorage.getItem("user")){
        menuItems = [
          {icon:"router", title:"SuperLink",link:'/superlink'}
        ]
      }
      return menuItems
    }
  },
  name: 'App',
  mounted(){
    this.user=localStorage.getItem('user');
  },
  methods: {
    logout(){
      localStorage.setItem("token",null);
      localStorage.setItem("user",null);
      localStorage.clear();
//        localStorage.setItem("message","User logged out");
      this.$router.push('/');
      location.reload();
    }
  }
}
</script>
