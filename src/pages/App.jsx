import React, { useEffect, useState } from "react";
import Controls from "../components/Controls";
import TimelineChart from "../components/TimelineChart";
import SeverityTable from "../components/SeverityTable";
import MapImpact from "../components/MapImpact";
import Alerts from "../components/Alerts";

const API = import.meta.env.VITE_API_URL || "http://localhost:8002";

export default function App() {
  const [data, setData] = useState(null);
  const [regions, setRegions] = useState([]);
  const [series, setSeries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selected, setSelected] = useState("USA");
  const [sigma, setSigma] = useState(2.5);

  // Load sample dataset
  useEffect(() => {
    (async () => {
      const r = await fetch(`${API}/sample-data`);
      const j = await r.json();
      setData(j.data);
      setSigma(j.threshold_sigma);
      setRegions(j.data.regions.map((x) => x.iso3));
      setSelected(j.data.regions[0].iso3);
    })();
  }, []);

  // Run anomaly detection
  async function runDetect() {
    const r = await fetch(`${API}/detect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, threshold_sigma: sigma }),
    });

    const j = await r.json();
    setRegions(j.regions);

    const a = await fetch(`${API}/alerts`);
    const aj = await a.json();
    setAlerts(aj.alerts || []);

    runTimeline(selected);
  }

  // Update heatmap
  async function runMap() {
    const r = await fetch(`${API}/heatmap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, threshold_sigma: sigma }),
    });
    const j = await r.json();
    setRegions(j.regions);
  }

  // Time-series anomaly view
  async function runTimeline(regionCode) {
    setSelected(regionCode);
    const r = await fetch(`${API}/timeline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ region: regionCode, data }),
    });
    const j = await r.json();
    setSeries(j.series);
  }

  return (
    <div className="app-wrap">

      {/* Title */}
      <h1
        style={{
          color: "var(--accent)",
          textShadow: "0 0 6px var(--accent)",
          marginBottom: "6px",
        }}
      >
        🌤️ Climate & Renewable Anomaly Detector
      </h1>

      <p style={{ opacity: 0.75, marginBottom: 15 }}>
        AI-powered anomaly detection for climate + renewable energy systems.
      </p>

      {/* Controls Panel */}
      <div className="ev-card">
        <Controls
          sigma={sigma}
          onSigma={setSigma}
          onDetect={runDetect}
          onMap={runMap}
          selected={selected}
          onRegion={runTimeline}
          regions={regions}
        />
      </div>

      {/* 2 Column Dashboard */}
      <div className="ev-grid ev-2col" style={{ marginTop: 16 }}>

        {/* Left Column */}
        <div className="ev-grid">
          <div className="ev-card">
            <TimelineChart series={series} />
          </div>
          <div className="ev-card">
            <Alerts alerts={alerts} />
          </div>
        </div>

        {/* Right Column */}
        <div className="ev-grid">
          <div className="ev-card">
            <SeverityTable
              rows={regions.map((r) => ({
                iso3: r,
                severity:
                  alerts.filter((a) => a.region === r).length || 0
              }))}
              onPick={(r) => runTimeline(r.iso3)}
            />
          </div>

          <div className="ev-card">
            <MapImpact data={regions} />
          </div>
        </div>
      </div>
    </div>
  );
}
