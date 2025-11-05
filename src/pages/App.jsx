import React, { useEffect, useState } from "react";
import Controls from "../components/Controls";
import TimelineChart from "../components/TimelineChart";
import SeverityTable from "../components/SeverityTable";
import MapImpact from "../components/MapImpact";
import Alerts from "../components/Alerts";
import "../components/styles.css";

// ✅ Use Netlify Functions endpoint
const API = "https://lambent-blini-607b09.netlify.app/.netlify/functions/api";

export default function App() {
  const [data, setData] = useState(null);
  const [regions, setRegions] = useState([]);
  const [series, setSeries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selected, setSelected] = useState("");
  const [sigma, setSigma] = useState(2.5);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/sample-data`);
        const j = await r.json();

        setData(j.data);
        setSigma(j.threshold_sigma);

        const regionList = j.data?.regions?.map(x => x.iso3) || [];
        setRegions(regionList);
        setSelected(regionList[0] || "");
      } catch (e) {
        console.error("Sample data error", e);
      }
    })();
  }, []);

  async function runDetect() {
    try {
      const r = await fetch(`${API}/detect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, threshold_sigma: sigma }),
      });

      const j = await r.json();
      setRegions(j.regions || []);

      const a = await fetch(`${API}/alerts`);
      const aj = await a.json();
      setAlerts(aj.alerts || []);

      runTimeline(selected);
    } catch (e) {
      console.error("Detect error", e);
    }
  }

  async function runMap() {
    try {
      const r = await fetch(`${API}/heatmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, threshold_sigma: sigma }),
      });

      const j = await r.json();
      setRegions(j.regions || []);
    } catch (e) {
      console.error("Heatmap error", e);
    }
  }

  async function runTimeline(regionCode) {
    try {
      setSelected(regionCode);

      const r = await fetch(`${API}/timeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region: regionCode, data }),
      });

      const j = await r.json();
      setSeries(j.series || []);
    } catch (e) {
      console.error("Timeline error", e);
    }
  }

  return (
    <div className="app-wrap">
      <h1 className="title">🌤️ Climate & Renewable Anomaly Detector</h1>
      <p className="subtitle">
        AI-powered anomaly detection for climate + renewable energy systems.
      </p>

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

      <div className="ev-grid ev-2col">
        <div className="ev-grid">
          <div className="ev-card">
            <TimelineChart series={series} />
          </div>
          <div className="ev-card">
            <Alerts alerts={alerts} />
          </div>
        </div>

        <div className="ev-grid">
          <div className="ev-card">
            <SeverityTable
              rows={regions.map(r => ({
                iso3: r,
                severity: alerts.filter(a => a.region === r).length || 0
              }))}
              onPick={r => runTimeline(r.iso3)}
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
