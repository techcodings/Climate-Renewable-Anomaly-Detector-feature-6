import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
export default function TimelineChart({series}){
  if(!series || !series.length) return <div style={{opacity:0.7}}>Pick a region to view temporal anomalies.</div>
  return (<div style={{background:'#1112', padding:16, borderRadius:12}}>
    <h3>Temporal Anomaly Plot</h3>
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={series}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="h" /><YAxis />
        <Tooltip /><Legend />
        <Line type="monotone" dataKey="generation" name="Generation" />
        <Line type="monotone" dataKey="expected" name="Expected" />
        <Line type="monotone" dataKey="z" name="z-score" />
      </LineChart>
    </ResponsiveContainer>
  </div>)
}
