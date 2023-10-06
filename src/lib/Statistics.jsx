
function Statistics(props){
    console.log(props.data);
    function render1D(){
        var headers = []
        var rows = []
        for(var i=0; i<props.data.series.length; i++){
            rows.push([props.data.series[i][0], props.data.series[i][1]]);
        }
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
                                i==0 ? <th key={Math.random()}>{v}</th> : <td key={Math.random()}>{v}</td>
                              ))}
                           </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
    function render2D(){
        var headers = []
        var rows = []
        var keys = Object.keys(props.data.series);
        for(var i=0; i<keys.length; i++){
            headers.push('');
            var row = [keys[i]];
            for(var j=0; j<keys.length; j++){
                var serie = props.data.series[keys[i]]
                if(i==0) headers.push(serie[j][0]);
                row.push(serie[j][1]);
            }
            rows.push(row)
        }
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
            </div>
        )
    }
    if(Array.isArray(props.data.series)) return render1D()
    else return render2D()
}

export default Statistics;