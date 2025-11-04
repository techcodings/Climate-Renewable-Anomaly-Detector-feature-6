import React from 'react'
export default function Alerts({alerts}){
  return (<div className="ev-card">
  <h3>⚠️ Alerts</h3>
  {alerts?.length ? alerts.map((a,i)=>
    <div key={i} style={{
      padding:"8px",
      border:"1px solid var(--border)",
      borderRadius:"8px",
      marginBottom:"6px"
    }}>
      <b>{a.type}</b> — {a.region} — sev {a.severity}<br/>
      <span style={{opacity:0.8}}>{a.message}</span>
    </div>
  ) : <div style={{opacity:0.6}}>No alerts</div>}
</div>
)
}
