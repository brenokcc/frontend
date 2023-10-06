import React, { PureComponent } from 'react';
import { Treemap, PieChart, Pie, BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const data01 = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];
const data02 = [
  { name: 'A1', value: 100 },
  { name: 'A2', value: 300 },
  { name: 'B1', value: 100 },
  { name: 'B2', value: 80 },
  { name: 'B3', value: 40 },
  { name: 'B4', value: 30 },
];

const data03 = [
  {
    name: 'axis',
    children: [
      { name: 'Axes', size: 1302 },
      { name: 'Axis', size: 4593 },
      { name: 'AxisGridLine', size: 652 },
      { name: 'AxisLabel', size: 636 },
      { name: 'CartesianAxes', size: 6703 },
    ]
  },
];

function Example(props) {
  var height = 300;
  function render() {
    return (
        <>
            <div style={{ width: '50%', height: height, display: 'inline-block' }}>
                <ResponsiveContainer>
                    <AreaChart data={data}>
                      <Area type="monotone" dataKey="uv" fill="#82ca9d" stroke="#FFF" />
                      <Area type="monotone" dataKey="pv" fill="#8884d8" stroke="#FFF" />
                      <Tooltip /><Legend /><XAxis dataKey="name"/><YAxis />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div style={{ width: '50%', height: height, display: 'inline-block' }}>
                <ResponsiveContainer>
                    <LineChart data={data}>
                      <XAxis dataKey="name" />
                      <Tooltip /><Legend /><XAxis dataKey="name"/><YAxis />
                      <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div style={{ width: '50%', height: height, display: 'inline-block' }}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                      <XAxis dataKey="name" />
                      <Tooltip /><Legend /><XAxis dataKey="name"/><YAxis />
                      <Bar type="monotone" dataKey="pv"  fill="#8884d8"/>
                      <Bar type="monotone" dataKey="uv" fill="#82ca9d"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{ width: '50%', height: height, display: 'inline-block' }}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                      <XAxis dataKey="name" />
                      <Tooltip /><Legend /><XAxis dataKey="name"/><YAxis />
                      <Bar type="monotone" dataKey="pv"  fill="#8884d8"  stackId="a"/>
                      <Bar type="monotone" dataKey="uv" fill="#82ca9d"  stackId="a"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{ width: '50%', height: height, display: 'inline-block' }}>
                <ResponsiveContainer>
                    <PieChart>
                      <Tooltip /><Legend />
                      <Pie data={data01} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" />
                      <Pie data={data02} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#82ca9d" label />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div style={{ width: '50%', height: height, display: 'inline-block' }}>
                <ResponsiveContainer>
                    <Treemap data={data03} dataKey="size" aspectRatio={4 / 3} stroke="#fff" fill="#8884d8" label>
                      <Tooltip /><Legend />
                    </Treemap>
                </ResponsiveContainer>
            </div>
        </>
    );
  }
  return render();
}


export default Example;