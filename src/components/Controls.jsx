import React from 'react'
export default function Controls({sigma, onSigma, onDetect, onMap, onRegion, regions, selected}){
  return (<div className="ev-card ev-grid" style={{gap:10}}>
  <h3 style={{color:"var(--accent)"}}>⚙️ Detector Controls</h3>

  <div className="ev-grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12}}>
    <label>Threshold σ
      <input type="number" step="0.1" value={sigma} onChange={e=>onSigma(Number(e.target.value))}/>
    </label>

    <button onClick={onDetect}>Run Detection</button>
    <button onClick={onMap}>Heatmap</button>

    <label>Region
      <select value={selected} onChange={e=>onRegion(e.target.value)}>
        {regions.map(r=> <option key={r}>{r}</option>)}
      </select>
    </label>
  </div>
</div>
)
}
