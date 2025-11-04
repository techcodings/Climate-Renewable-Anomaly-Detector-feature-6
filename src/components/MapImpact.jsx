import React from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
export default function MapImpact({data}){
  const byIso3 = {}; (data||[]).forEach(d=>{ if(typeof d==='string') byIso3[d]=0; else byIso3[d.iso3]=d.impact_index })
  const color = (v)=>{ if(v==null) return '#ddd'; const t=Math.max(0,Math.min(1,(v-30)/60)); const r=Math.round(255*(1-t)); const g=Math.round(200*t); return `rgb(${r},${g},120)` }
  return (<div style={{background:'#1112', padding:16, borderRadius:12}}>
    <h3>Anomaly Map (Impact Index)</h3>
    <ComposableMap projectionConfig={{scale:140}} width={600} height={300} style={{width:'100%', height:'auto'}}>
      <Geographies geography={geoUrl}>
        {({ geographies }) => geographies.map(geo => {
          const iso3 = geo.properties.ISO_A3; const v = byIso3[iso3]
          return <Geography key={geo.rsmKey} geography={geo} fill={color(v)} stroke="#555" />
        })}
      </Geographies>
    </ComposableMap>
  </div>)
}
