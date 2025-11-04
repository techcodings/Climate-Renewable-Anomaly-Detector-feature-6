import React from 'react'
export default function SeverityTable({rows, onPick}){
  if(!rows || !rows.length) return <div style={{background:'#1112', padding:16, borderRadius:12}}>Run detection to see severity ranking.</div>
  return (<div className="ev-card">
  <h3>📊 Severity Ranking</h3>
  <table style={{width:"100%", color:"var(--text)"}}>
    <thead><tr><th>Region</th><th>Severity</th></tr></thead>
    <tbody>
      {rows.map((r,i)=>
        <tr key={i} onClick={()=>onPick(r)} style={{cursor:"pointer"}}>
          <td>{r.iso3}</td>
          <td style={{textAlign:"center"}}>{r.severity}</td>
        </tr>
      )}
    </tbody>
  </table>
</div>
)
}
