/*大屏*/
//自调用函数
(function () {
    // 1、页面一加载就要知道页面宽度计算
    var setFont = function () {
        // 因为要定义变量可能和别的变量相互冲突，污染，所有用自调用函数
        var html = document.documentElement;// 获取html
        // 获取宽度
        var width = html.clientWidth;

        // 判断
        if (width < 1024) width = 1024
        if (width > 1920) width = 1920
        // 设置html的基准值
        var fontSize = width / 80 + 'px';
        // 设置给html
        html.style.fontSize = fontSize;
    }
    setFont();
    // 2、页面改变的时候也需要设置
    // 尺寸改变事件
    window.onresize = function () {
        setFont();
    }
})();


//时间部分
 (function(){
   function showTime(){ var date = new Date()
    var week = date.getDay()
    var weekday;
    switch(week){
        case 0: weekday = '星期天';break;
        case 1: weekday = '星期一';break;
        case 2: weekday = '星期二';break;
        case 3: weekday = '星期三';break;
        case 4: weekday = '星期四';break;
        case 5: weekday = '星期五';break;
        case 6: weekday = '星期六';break;
    }
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day= date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    var time_1=document.getElementById('time_day')
    var time_2 =document.getElementById('time_date')
    var time_3 =document.getElementById('weekday')
    time_1.innerHTML = hour +" : "+ minute +" : "+ (second<10?('0'+second):second )
    time_2.innerHTML =  year + '年' + month + "月" + day + '日'+' ' 
    time_3.innerHTML = weekday
    setTimeout(showTime,1000);
}
showTime()

})();

// circle chart
var circleDom = document.getElementById('circleChart');
var circleChart = echarts.init(circleDom);
var circle_option;
circle_option = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
     
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
};
circle_option && circleChart.setOption(circle_option);

//wind chart
{
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
              color:'rgba(31,198,255,1)'
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
                color:'rgba(31,198,255,0.5)'
            }
        },
        lineStyle:{
            normal:{
                color:'rgba(31,198,255,.7)'
  
            }
        },
        symbol:'circle',
        symbolSize:6,
        itemStyle:{
            normal:{
                color:'#1FC6FF'
            }
        }
    }]
  };
  var windChart=echarts.init(document.getElementById('windChart'));
  windChart.setOption(windOption);
}

// column chart
{var chartDomSet = document.getElementById('dataSet1');
var myChartSet = echarts.init(chartDomSet);
var optionSet;

// prettier-ignore
let dataAxis = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
// prettier-ignore
let data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
let yMax = 500;
let dataShadow = [];
for (let i = 0; i < data.length; i++) {
  dataShadow.push(yMax);
}
optionSet = {
  title: {
  
  },
  xAxis: {
    data: dataAxis,
    axisLabel: {
      inside: true,
      color: '#fff'
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    z: 10
  },
  yAxis: {
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#1FC6FF'
    }
  },
  dataZoom: [
    {
      type: 'inside'
    }
  ],
  series: [
    {
      type: 'bar',
      showBackground: true,
      itemStyle: {
        normal:{
          color:'#1FC6FF'
      }
        
      },
      
      data: data
    }
  ]
};
// Enable data zoom when user click bar.
const zoomSize = 6;
myChartSet.on('click', function (params) {
  console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
  myChart.dispatchAction({
    type: 'dataZoom',
    startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
    endValue:
      dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
  });
});

optionSet && myChartSet.setOption(optionSet);}



//wave chart
var waveChartDom = document.getElementById('wave_chart');
var waveChart = echarts.init(waveChartDom);
var waveOption;

let base = +new Date(1988, 9, 3);
let oneDay = 24 * 3600 * 1000;
let data = [[base, Math.random() * 300]];
for (let i = 1; i < 20000; i++) {
  let now = new Date((base += oneDay));
  data.push([+now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])]);
}
waveOption = {
  tooltip: {
    trigger: 'axis',
    position: function (pt) {
      return [pt[0], '10%'];
    }
  },
  title: {
    left: 'center',

  },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'time',
    boundaryGap: false
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%']
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 20
    },
    {
      start: 0,
      end: 20
    }
  ],
  series: [
    {
      name: 'Fake Data',
      type: 'line',
      smooth: true,
      symbol: 'none',
      areaStyle:{
        normal:{
            color:'rgba(31,198,255,0.5)'
        }
    },
    lineStyle:{
        normal:{
            color:'rgba(31,198,255,.7)'

        }
    },
      data: data
    }
  ]
};

waveOption && waveChart.setOption(waveOption);
