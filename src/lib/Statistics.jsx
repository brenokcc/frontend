import {Pie, PieArea, Donut, Bar, StackedBar, Column, StackedColumn, TreeMap, Line, Area, Progress} from './Charts'


function Statistics(props){
    function render1D(){
        var rows = []
        for(var i=0; i<props.data.series.length; i++){
            rows.push([props.data.series[i][0], props.data.series[i][1]]);
        }
        return (
            <div className="statistics">
                <table>
                    <tbody>
                        {rows.map((row) => (
                           <tr key={Math.random()}>
                              {row.map((v, i) => (
                                i==0 ? <th key={Math.random()}>{v}</th> : <td key={Math.random()}>{v}</td>
                              ))}
                           </tr>
                        ))}
                    </tbody>
                </table>
                <Pie rows={rows}/>
                <Donut rows={rows}/>
                <PieArea rows={rows}/>
                <Bar rows={rows}/>
                <Column rows={rows}/>
                <StackedColumn rows={rows}/>
                <TreeMap rows={rows}/>
                <Line rows={rows}/>
                <Area rows={rows}/>
                <Progress value={27}/>
            </div>
        )
    }
    function render2D(){
        //console.log(props.data.series)

        var headers = []
        var rows = []
        var keys = Object.keys(props.data.series);
        for(var i=0; i<keys.length; i++){
            if(i==0) headers.push('');
            var row = [keys[i]];
            for(var j=0; j<props.data.series[keys[i]].length; j++){
                var serie = props.data.series[keys[i]]
                if(i==0) headers.push(serie[j][0]);
                row.push(serie[j][1]);
            }
            rows.push(row);
        }
        //console.log(headers);
        //console.log(rows);
        return (
            <div className="statistics">
                <table>
                    {headers &&
                    <thead>
                        <tr>{headers.map((k) => (<th key={Math.random()}>{k}</th>))}</tr>
                    </thead>
                    }
                    <tbody>
                        {rows.map((row) => (
                           <tr key={Math.random()}>
                              {row.map((v, i) => (
                                i == 0 ? <th key={Math.random()}>{v}</th> : <td key={Math.random()}>{v}</td>
                              ))}
                           </tr>
                        ))}
                    </tbody>
                </table>
                <Bar headers={headers} rows={rows}/>
                <StackedBar headers={headers} rows={rows}/>
                <Column headers={headers} rows={rows}/>
                <StackedColumn headers={headers} rows={rows}/>
                <Pie headers={headers} rows={rows}/>
                <Donut headers={headers} rows={rows}/>
                <PieArea headers={headers} rows={rows}/>
                <TreeMap headers={headers} rows={rows}/>
            </div>
        )
    }
    if(Array.isArray(props.data.series)) return render1D()
    else return render2D()
}

export default Statistics;