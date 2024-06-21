import * as echarts from 'echarts';
import 'echarts-gl';

var chartDom1 = document.getElementById('sensor_now');
var chartDom2 = document.getElementById('webgl');
var myChart1 = echarts.init(chartDom1);
var myChart2 = echarts.init(chartDom2);

var option1;
var option2;

option1 = {
    title: {
      text: '传感器实时数据展示'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['温度','盐度']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['06：00', '08：00', '10：00', '12：00', '14：00', '16：00', '18：00']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '温度',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: ' 盐度',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310]
      }]
      
  };
  
 
  $.getScript(
    'https://fastly.jsdelivr.net/npm/simplex-noise@2.4.0/simplex-noise.js'
  ).done(function () {
    var noise = new SimplexNoise(Math.random);
    var noise2 = new SimplexNoise(Math.random);
    function generateData() {
      var data = [];
      for (var i = 0; i <= 50; i++) {
        for (var j = 0; j <= 50; j++) {
          var dx = noise.noise2D(i / 30, j / 30);
          var dy = noise2.noise2D(i / 30, j / 30);
          var mag = Math.sqrt(dx * dx + dy * dy);
          valMax = Math.max(valMax, mag);
          valMin = Math.min(valMin, mag);
          data.push([i, j, dx, dy, mag]);
        }
      }
      return data;
    }
    var valMin = Infinity;
    var valMax = -Infinity;
    var data = generateData();
    myChart2.setOption({
      visualMap: {
        show: false,
        min: valMin,
        max: valMax,
        dimension: 4,
        inRange: {
          color: [
            '#313695',
            '#4575b4',
            '#74add1',
            '#abd9e9',
            '#e0f3f8',
            '#ffffbf',
            '#fee090',
            '#fdae61',
            '#f46d43',
            '#d73027',
            '#a50026'
          ]
        }
      },
      xAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: 'rgba(255,255,255,0.2)'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: 'rgba(255,255,255,0.2)'
          }
        }
      },
      series: [
        {
          type: 'flowGL',
          data: data,
          particleDensity: 64,
          particleSize: 5,
          itemStyle: {
            opacity: 0.5
          }
        },
        {
          type: 'custom',
          data: data,
          encode: {
            x: 0,
            y: 0
          },
          renderItem: function (params, api) {
            var x = api.value(0),
              y = api.value(1),
              dx = api.value(2),
              dy = api.value(3);
            var start = api.coord([x - dx / 2, y - dy / 2]);
            var end = api.coord([x + dx / 2, y + dy / 2]);
            return {
              type: 'line',
              shape: {
                x1: start[0],
                y1: start[1],
                x2: end[0],
                y2: end[1]
              },
              style: {
                lineWidth: 2,
                stroke: '#fff',
                opacity: 0.2
              }
            };
          }
        }
      ]
    });
  });
  myChart1.setOption(option1);
  option2 && myChart2.setOption(optio2);



//wind chart
var windOption={
  tooltip:{},
  radar:{
      indicator:[
          {name:'N',max:12},
          {name:'NNW',max:12},
          {name:'NW',max:12},
          {name:'WNW',max:12},
          {name:'W',max:12},
          {name:'WSW',max:12},
          {name:'SW',max:12},
          {name:'SSW',max:12},
          {name:'S',max:12},
          {name:'SSE',max:12},
          {name:'SE',max:12},
          {name:'ESE',max:12},
          {name:'E',max:12},
          {name:'ENE',max:12},
          {name:'NE',max:12},
          {name:'NNE',max:12}
      ],
      name:{
        textStyle:{
            color:'rgba(176,204,53,1)'
        }
      },
      axisLine: {
          lineStyle: {
              color: 'rgba(255, 255, 255, 0.4)'
          }
      },
      splitLine: {
          lineStyle: {
              color: 'rgba(255, 255, 255, 0.4)'
          }
      },
      splitArea:{
          areaStyle:{
              color:'rgba(255,255,255,0)'
          }
      }
  },
  series:[{
      type:'radar',
      data:[
          {
              value:[2.8,5.3,7.1,5.4,10.6,8.5,5.1,2.1,2.9,4.0,9.4,6.3,3.5,0.9,1,0.9],
              name:'2016'
          }
      ],
      areaStyle:{
          normal:{
              color:'rgba(176,204,53,.5)'
          }
      },
      lineStyle:{
          normal:{
              color:'rgba(176,204,53,.7)'

          }
      },
      symbol:'circle',
      symbolSize:6,
      itemStyle:{
          normal:{
              color:'#A9C33B'
          }
      }
  }]
};
var windChart=echarts.init(document.getElementById('windChart'));
windChart.setOption(windOption);