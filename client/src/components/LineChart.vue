<script>
  import { Line } from 'vue-chartjs';

  export default {
    extends: Line,
    props: ['data'],
      data() {
      return {
        //Chart.js options that controls the appearance of the chart
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              }
            }],
            xAxes: [{
              gridLines: {
                display: false
              }
            }]
          },
          legend: {
            display: false
          },
          responsive: true,
          maintainAspectRatio: false
        }
      }
    },
    mounted() {
      this.renderLineChart();
    },
    computed: {
      chartData: function() {
        return this.data;
      }
    },
    methods:{
      renderLineChart: function() {
        this.renderChart(
            this.chartData, this.options
        );
      }
    },
    watch: {
      data: function() {
        //this.renderChart(this.data, this.options);
        this.renderLineChart();
      }
    }
  }
</script>
