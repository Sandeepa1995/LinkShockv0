<template>
  <div class="container">
  <div class="manageBusOwner" >
    <div class="text-xs-center">
      <v-icon style="font-size: 200px; color: white">
        router</v-icon>
    </div>

    <v-alert  color="warning" icon="info" transition="scale-transition" value="true" v-show="message.length>0">
      {{message}}
    </v-alert>
    <div class="container" style="background-color: darkgray">
      <v-alert color="error" icon="warning" transition="scale-transition" value="true" v-show="listmessage.length>0">
        {{listmessage}}
      </v-alert>


      <v-card style="padding-bottom: 50px">
        <v-card-title>
          Manage Links
          <v-spacer></v-spacer>
          <v-text-field
            append-icon="search"
            label="Search"
            single-line
            hide-details
            v-model="search"
          ></v-text-field>
        </v-card-title>
        <transition name="slide-y-transition">
        <div class="container" v-if="selectedShock">
          <v-layout row justify-center>
              <v-card style="width: 100%; border-style: solid; border-width: 5px; border-color: dodgerblue">
                <v-card-text>
                  <h2>Shock details</h2>
                  <h3>{{selectedShock}}</h3>
                  <v-layout row wrap>
                    <v-flex xs5></v-flex>
                    <v-flex xs2>
                      <v-switch
                        :label="`Shock is : ${getShockState()}`"
                        v-model="selectedShockState"
                        v-on:change="setShockState()"
                      ></v-switch>
                    </v-flex>
                    <v-flex xs5></v-flex>
                  </v-layout>
                  <v-btn block
                         color="info"
                         v-on:click="viewShock(selectedShock)"
                         dark style="width: 50%; margin-left: auto; margin-right: auto">Refresh</v-btn>
                  <line-chart :data="shockFormattedData"></line-chart>
                  <v-layout row wrap>
                    <v-flex md12 lg6>
                      <v-switch
                        :label="`Timed turn on is : ${getShockOnnableState()}`"
                        v-model="selectedShockOnControl"
                        v-on:change="setShockTimerState()"
                      ></v-switch>
                      <div v-if="selectedShockOnControl">
                        <h2> Turn on at </h2>
                        <v-time-picker
                          v-model="timeOn"
                          :allowed-minutes="allowedMinutes"
                          class="mt-3"
                          format="24hr"
                        ></v-time-picker>
                        <v-btn block
                               color="info"
                               v-on:click="setShcokOnTime()"
                               dark>Set the timed turn on time</v-btn>
                      </div>
                    </v-flex>
                    <v-flex md12 lg6>
                      <v-switch
                        :label="`Timed turn off is : ${getShockOffableState()}`"
                        v-model="selectedShockOffControl"
                        v-on:change="setShockTimerState()"
                      ></v-switch>
                      <div v-if="selectedShockOffControl">
                        <h2> Turn off at </h2>
                        <v-time-picker
                          v-model="timeOff"
                          :allowed-minutes="allowedMinutes"
                          class="mt-3"
                          format="24hr"
                        ></v-time-picker>
                        <v-btn block
                               color="info"
                               v-on:click="setShcokOffTime()"
                               dark>Set the timed turn off time</v-btn>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
          </v-layout>
        </div>
        </transition>
        <v-data-table
          v-bind:headers="headers"
          v-bind:items="links"
          v-bind:search="search"
          hide-actions
          item-key="link_id"
        >
          <template slot="items" slot-scope="props">
            <tr @click="props.expanded = !props.expanded">
              <td class="text-xs-left">{{ props.item.link_id }}</td>
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
            <v-layout row wrap v-for="shock in props.item.shocks" :key="shock">
              <v-flex xs12 style="margin: 10px">
                <v-btn block color="warning" dark @click="viewShock(shock)">Show {{shock}}</v-btn>
                <!--<v-card flat>-->
                  <!--<v-card-text><p><strong style="font-size: 14px">{{shock}}</strong></p>-->
                  <!--</v-card-text>-->
                <!--</v-card>-->
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12  style="margin: 10px">
                <v-btn block
                       color="success"
                       v-on:click="selectLink(props.item.link_id)"
                       dark>Add Shock</v-btn>
                <!--<v-btn block color="warning" dark @click="editBus(props.item.licence)">Edit Bus</v-btn>-->
                <!--<v-btn block color="error" dark @click="deleteBus(props.item.licence)">Delete Bus</v-btn>-->
              </v-flex>
            </v-layout>
            <!--<v-card flat>-->
              <!--<v-card-text>{{props.item.r_rows}},{{props.item.l_rows}},{{props.item.r_seats}},{{props.item.l_seats}}</v-card-text>-->
            <!--</v-card>-->
          </template>
        </v-data-table>
      </v-card>


      <!--Add new link-->
      <div>
        <v-layout row justify-center>
          <v-dialog v-model="dialog" persistent max-width="1000px">
            <v-btn slot="activator" style="margin-top: 20px">Add new Link</v-btn>
            <v-card>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap style="width: 100%">
                    <v-form v-model="valid" ref="form" style="width: 100%">
                    <v-flex xs12>
                      <v-text-field label="Link ID"
                                    :rules="linkIDRules"
                                    v-model="new_link_id"
                                    required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field label="Link Password"
                                    :rules="passwordRules"
                                    v-model="new_link_password"
                                    required></v-text-field>
                    </v-flex>
                    </v-form>
                  </v-layout>
                </v-container>
                <small>*indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="dialog = false" @click="closeForm">Close</v-btn>
                <v-btn color="blue darken-1" flat @click="clearForm">Clear</v-btn>
                <v-btn color="blue darken-1"
                       flat @click.native="dialog = false" @click="addNewLink"
                       :disabled="(!valid)"
                >Add Link</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
      </div>
      <!--End adding of link-->

      <!--Add new shock-->
      <div>
        <v-layout row justify-center>
          <v-dialog v-model="shock_add_dialog" persistent max-width="1000px">
            <v-card>
              <v-card-text>
                Add shock to <strong>{{selectedLink}}</strong>
                <v-container grid-list-md>
                  <v-layout wrap style="width: 100%">
                    <v-form v-model="validNew" ref="addShockForm" style="width: 100%">
                      <v-flex xs12>
                        <v-text-field label="Shock ID"
                                      :rules="linkIDRules"
                                      v-model="new_shock_id"
                                      required></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field label="Shock Password"
                                      :rules="passwordRules"
                                      v-model="new_shock_password"
                                      required></v-text-field>
                      </v-flex>
                    </v-form>
                  </v-layout>
                </v-container>
                <small>*indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="shock_add_dialog = false">Close</v-btn>
                <v-btn color="blue darken-1" flat @click="clearShockForm">Clear</v-btn>
                <v-btn color="blue darken-1"
                       flat @click.native="shock_add_dialog = false" @click="addShock"
                       :disabled="(!shock_add_dialog)"
                >Add Shock</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
      </div>
      <!--End adding of shock-->

    </div>
  </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import VTextField from "vuetify/es5/components/VTextField/VTextField";
  import LineChart from './LineChart';
  import hhmmss from 'hh-mm-ss';
export default {

  components: {VTextField, LineChart},
  name: 'manageBusOwner',
  data: () => ({
    user:JSON.parse(localStorage.getItem("user")),
    token:localStorage.getItem("token"),

    validSelect: true,



    valid: true,
    validNew: true,
    listmessage: 'Sorry no links were found :(',
    message:'',
    dialog: false,
    shock_add_dialog:false,
    shock_show:false,
    new_link_id:"",
    new_link_password:"",
    new_shock_id:"",
    new_shock_password:"",
    validOperator: false,
    linkIDRules: [
      (v) => !!v || 'Link ID is required'
    ],
    passwordRules: [
      (v) => !!v || 'Link password is required'
    ],

    shockFormattedData:null,

    links:[],

    headers: [
      {
        text: 'Link ID',
        value: 'link_id'
      }
    ],

    selectedLink:'',

    selectedShock:'',
    selectedShockVals:[],
    selectedShockTimes:[],
    selectedShockState:null,
    selectedShockKey:'',
    selectedShockOnControl:true,
    selectedShockOffControl:true,

    tmp: '',
    search: '',
    pagination: {},

    timeOn: '00:00',
    timeOff: '00:00'

  }),
  computed: {

  },
  methods: {
    addNewLink(){
      if (this.$refs.form.validate()) {
          axios({
            method: 'post',
            url: 'https://linkshockv2.herokuapp.com/linksetup',
            data: {
              link_id: this.new_link_id,
              password: this.new_link_password,
              user_id: this.user.id,
              email:this.user.email
            },
            headers: {'Content-Type': 'application/json','Authorization':this.token}
          }).then((response)=> {
            console.log(response.data);
            if(!response.data.success){
              this.message=response.data.msg;
            }
            else {
              this.message=response.data.msg;
            }
          })
            .catch(function (error) {
              console.log(error);
            });
      }
    },
    viewShock(shock){
      axios({
        method: 'post',
        url: 'https://linkshockv2.herokuapp.com/shockdata',
        data:{shock_id:shock },
        headers: {'Content-Type': 'application/json','Authorization':this.token}
      }).then((response) => {
        if(response.data.success){
          var offset = new Date().getTimezoneOffset();
          this.selectedShock = response.data.shock.iD;
          this.selectedShockKey = response.data.shock.ada_key;
          this.selectedShockVals=[];
          this.selectedShockTimes=[];
          this.timeOn = hhmmss.fromS(this.mod((hhmmss.toS(response.data.shock.on_time) - offset),1440));
          this.timeOff = hhmmss.fromS(this.mod((hhmmss.toS(response.data.shock.off_time) - offset),1440));
          this.selectedShockOnControl = response.data.shock.can_on;
          this.selectedShockOffControl = response.data.shock.can_off;
          axios({
            method: 'get',
            url: 'https://io.adafruit.com/api/v2/Sandeepa1995/feeds/'+this.selectedShockKey+'.state/data/',
            headers: {'Content-Type': 'application/json'}
          }).then((respStae)=> {
            if(respStae.data) {
              if (respStae.data[0].value === "1") {
                this.selectedShockState = true;
              }
              else {
                this.selectedShockState = false;
              }
              axios({
                method: 'get',
                url: 'https://io.adafruit.com/api/v2/Sandeepa1995/feeds/' + this.selectedShockKey + '.values/data',
                headers: {'Content-Type': 'application/json'}
              }).then((respVals) => {
                if(respVals.data){
                  for(let i =0; i<respVals.data.length; i++){
                    this.selectedShockVals.unshift(parseFloat(respVals.data[i].value));
                    this.selectedShockTimes.unshift((new Date(respVals.data[i].created_at)).toLocaleString());
                  }
                  this.shock_show =true;

                  this.shockFormattedData ={
                    labels: this.selectedShockTimes,
                    datasets: [
                      {
                        label: 'kWh values',
                        backgroundColor: '#2aa2f8',
                        data: this.selectedShockVals
                      }
                    ]
                  }
                }
              })
                .catch(function (error) {
                  console.log(error);
                });
            }
          })
            .catch(function (error) {
              console.log(error);
            });
        }
      })
        .catch(function (error) {
          console.log(error);
        });
    },
    addShock(){
      if (this.$refs.addShockForm.validate()) {
        axios({
          method: 'post',
          url: 'https://linkshockv2.herokuapp.com/shocksetup',
          data: {
            link_id: this.selectedLink,
            shock_id: this.new_shock_id,
            password: this.new_shock_password
          },
          headers: {'Content-Type': 'application/json','Authorization':this.token}
        }).then((response)=> {
          console.log(response.data);
          if(!response.data.success){
            this.message=response.data.msg;
          }
          else {
            this.message=response.data.msg;
          }
        })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    getShockState(){
      if (this.selectedShockState){
        return "ON"
      }else {
        return "OFF"
      }
    },
    getShockOnnableState(){
      if (this.selectedShockOnControl){
        return "ON"
      }else {
        return "OFF"
      }
    },
    getShockOffableState(){
      if (this.selectedShockOffControl){
        return "ON"
      }else {
        return "OFF"
      }
    },
    setShockState(){
      if (this.selectedShockState!==null) {
        let sendState = 0;
        if (this.selectedShockState) {
          sendState = 1
        }
        axios({
          method: 'post',
          url: 'https://io.adafruit.com/api/v2/Sandeepa1995/feeds/' + this.selectedShockKey + '.state/data',
          data: {
            value: sendState
          },
          headers: {'Content-Type': 'application/json', 'X-AIO-Key': '547b680e533849f9a9a8f096d6ae1e9c'}
        }).then((response) => {
        })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    setShockTimerState(){
      if (this.selectedShockOnControl!==null) {
        axios({
          method: 'post',
          url: 'https://linkshockv2.herokuapp.com/shock_time_state',
          data: {
            shock_id: this.selectedShock,
            can_on : this.selectedShockOnControl,
            can_off : this.selectedShockOffControl
          },
          headers: {'Content-Type': 'application/json', 'Authorization':this.token}
        }).then((response) => {
          if(!response.data.success){
            this.message=response.data.msg;
          }
          else {
            this.message=response.data.msg;
          }
        })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    setShcokOnTime(){
      var offset = new Date().getTimezoneOffset();
      // console.log(hhmmss.toS(this.timeOn));
      // console.log(hhmmss.toS(this.timeOn) - offset);
      // console.log(hhmmss.fromS((hhmmss.toS(this.timeOn) - offset)%1440))
      axios({
        method: 'post',
        url: 'https://linkshockv2.herokuapp.com/shock_time_on',
        data: {
          shock_id: this.selectedShock,
          on_time : hhmmss.fromS(this.mod((hhmmss.toS(this.timeOn) + offset),1440))
        },
        headers: {'Content-Type': 'application/json', 'Authorization':this.token}
      }).then((response) => {
        if(!response.data.success){
          this.message=response.data.msg;
        }
        else {
          this.message=response.data.msg;
        }
      })
        .catch(function (error) {
          console.log(error);
        });
    },
    setShcokOffTime(){
      var offset = new Date().getTimezoneOffset();
      // console.log(hhmmss.toS(this.timeOn));
      // console.log(hhmmss.toS(this.timeOn) - offset);
      // console.log(hhmmss.fromS((hhmmss.toS(this.timeOn) - offset)%1440))
      axios({
        method: 'post',
        url: 'https://linkshockv2.herokuapp.com/shock_time_off',
        data: {
          shock_id: this.selectedShock,
          off_time : hhmmss.fromS(this.mod((hhmmss.toS(this.timeOff) + offset),1440))
        },
        headers: {'Content-Type': 'application/json', 'Authorization':this.token}
      }).then((response) => {
        if(!response.data.success){
          this.message=response.data.msg;
        }
        else {
          this.message=response.data.msg;
        }
      })
        .catch(function (error) {
          console.log(error);
        });
    },
    closeForm(){
      this.editOpers=false;
      this.editing=false;
    },
    clearForm(){
      this.new_link_id="";
      this.new_link_password= "";
    },
    selectLink(link_id){
      this.selectedLink = link_id;
      this.shock_add_dialog = true;

    },
    clearShockForm(){
      this.new_shock_id="";
      this.new_shock_password= "";
    },
    allowedMinutes: v => (v%30 === 0),
    mod(n, p)
    {
      if ( n < 0 )
        n = p - Math.abs(n) % p;

      return n % p;
    }
  },
  mounted(){
    axios({
      method: 'post',
      url: 'https://linkshockv2.herokuapp.com/links',
      data:{user_id:this.user.id },
      headers: {'Content-Type': 'application/json','Authorization':this.token}
    }).then((response) => {
      if(response.data.success){
        if(response.data.links.length>0){
          this.listmessage="";
          // console.log(response.data.links);
        }
        for (var link in response.data.links) {
          // console.log(response.data.links[link]);
          this.links.push({
            link_id:response.data.links[link].iD,
            shocks: response.data.links[link].shocks,
          })
        }
      }
    })
      .catch(function (error) {
        console.log(error);
      });
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

  .manageBusOwner{
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
</style>
