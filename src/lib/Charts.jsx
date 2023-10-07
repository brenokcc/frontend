import React from "react";
import ReactEcharts from "echarts-for-react";


function Pie(props){
    var radius = [['70%', '78%'], ['60%', '68%'], ['50%', '58%'], ['40%', '48%'], ['30%', '48%'], ['20%', '28%'], ['10%', '18%']]

    function series(){
        if(props.headers){
            return props.headers.slice(1).map(function(header, i){
                return {
                  name: header,
                  type: 'pie',
                  radius: radius[i],
                  emphasis: {label: {show: true, fontWeight: 'bold'}},
                  roseType: null,
                  data: props.rows.map(function(row){
                    return {name: row[0], value: row[i+1]}
                  })
                }
          })
        } else {
            return {
                  name: null,
                  type: 'pie',
                  radius: props.donut ? ['25%', '65%'] : ['0%', '75%'],
                  emphasis: {label: {show: true, fontWeight: 'bold'}},
                  roseType: props.area ? 'area' : null,
                  data: props.rows.map(function(row, i){
                    return {name: row[0], value: row[1]}
                  })
            }
        }
    }

    function render(){
        var option = {
          tooltip: {trigger: 'item'},
          legend: {},
          label: {show: true, formatter(param) {return param.name + ' (' + param.percent * 2 + '%)'; }},
          series: series()
        };
        return <ReactEcharts option={option}/>;
    }

    return render();
}

function Donut(props){
    return <Pie donut={true} headers={props.headers} rows={props.rows}/>
}

function PieArea(props){
    return <Pie area={true} headers={props.headers} rows={props.rows}/>
}

function Chart(props){
    var invert = props.invert || false;
    var type = props.type || 'bar';
    var stack = props.stack;
    var yAxis = {type: 'value'};
    var toolbox = {show: true, feature: {mark: { show: true }, saveAsImage: { show: true }}};
    var areaStyle = props.area ? {} : null;

    function xAxis(){
        if(props.headers){
            return {type: 'category', data: props.headers.slice(1)}
        } else {
            return {type: 'category', data: props.rows.map(function (row){return row[0]})}
        }
    }

    function series(){
        if(props.headers){
            return props.rows.map(function(row){
              return {
                name: row[0],
                data: row.slice(1),
                type: type,
                stack: stack,
                areaStyle: areaStyle,
              }
            })
        } else {
            return [{
                name: null,
                data: props.rows.map(function (row){return row[1]}),
                type: type,
                stack: stack,
                areaStyle: areaStyle,
              }]
        }
    }

    function render(){
        var option = {
          toolbox: toolbox,
          tooltip: { trigger: 'axis', axisPointer: {type: 'shadow'}},
          legend: {},
          label: {show: true},
          xAxis: invert? yAxis: xAxis(),
          yAxis: invert? xAxis() : yAxis,
          series: series()
        };
        return <ReactEcharts option={option}/>;
    }

    return render();
}

function Bar(props){
    return <Chart headers={props.headers} rows={props.rows}/>
}

function Line(props){
    return <Chart type="line" headers={props.headers} rows={props.rows}/>
}

function Area(props){
    return <Chart area={true} type="line" headers={props.headers} rows={props.rows}/>
}

function StackedBar(props){
    return <Chart stack="1" headers={props.headers} rows={props.rows}/>
}

function Column(props){
    return <Chart invert={true} headers={props.headers} rows={props.rows}/>
}

function StackedColumn(props){
    return <Chart invert={true} stack="1" headers={props.headers} rows={props.rows}/>
}

function TreeMap(props){

    function series(){
        if(props.headers){
            return [
                {
                  type: 'treemap',
                  roam: 'move',
                  nodeClick: true,
                  data: props.headers.slice(1).map(function(header, i){
                        return {
                          name: header,
                          type: 'pie',
                          children: props.rows.map(function(row){
                            return {name: row[0], value: row[i+1]}
                          })
                        }
                  }),
                }
              ]
        } else {
            return [
                {
                  type: 'treemap',
                  roam: 'move',
                  nodeClick: false,
                  data: props.rows.map(function(row){
                    return {
                      name: row[0],
                      value: row[1],
                    }
                  })
                }
              ]
        }
    }

    function render(){
        var option = {
            tooltip: {trigger: 'item'},
          legend: {},
          label: {show: true, formatter(param) {return param.name + ' (' + param.value + ')'; }},
          series: series()
        };
        return <ReactEcharts option={option}/>;
    }

    return render();
}

function Progress(props){
    function render(){
        var option = {
          series: [
            {
              type: 'gauge',
              startAngle: 0,
              endAngle: 360,
              min: 0,
              max: 100,
              progress: {
                show: true,
                width: 38
              },
              pointer: null,
              axisTick: null,
              splitLine: {
                length: 0,
              },
              axisLine: {
                lineStyle: {
                  width: 38
                }
              },
              axisLabel: null,
              detail: {
                backgroundColor: '#fff',
                fontSize: '2.5rem',
                width: '60%',
                lineHeight: 40,
                height: 40,
                borderRadius: 8,
                offsetCenter: [0, '0%'],
                valueAnimation: true,
                formatter: function (value) {
                  return value.toFixed(0) + '%';
                }
              },
              data: [
                {
                  value: props.value
                }
              ]
            }
          ]
        };
        return <ReactEcharts option={option}/>;
    }
    return render();
}

export {Pie, PieArea, Donut, Bar, StackedBar, Column, StackedColumn, TreeMap, Line, Area, Progress}
export default Chart;