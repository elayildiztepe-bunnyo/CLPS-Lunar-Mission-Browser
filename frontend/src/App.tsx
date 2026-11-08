import { useState } from 'react';
import { Sun, Satellite, MoonStar, RadioTower, Telescope, Compass, CalendarDays } from 'lucide-react';
const sites = [
 {name:'Shackleton Rim',lat:'89.90° S',lon:'0.00° E',sun:72,earth:84,shadow:28},
 {name:'De Gerlache Ridge',lat:'88.50° S',lon:'280.00° E',sun:64,earth:76,shadow:36},
 {name:'Mons Mouton',lat:'84.00° S',lon:'16.00° E',sun:81,earth:91,shadow:19}
];
function Metric({title,value,unit,Icon}:{title:string,value:number,unit:string,Icon:typeof Sun}) {
 return <article className="metric"><div className="metric-title">{title}<Icon size={18}/></div><strong>{value}<small>{unit}</small></strong><div className="track"><i style={{width:value+'%'}}/></div><p>Illustrative demo estimate</p></article>;
}
export default function App(){
 const [siteIndex,setSiteIndex]=useState(0); const [date,setDate]=useState('2026-11-08'); const site=sites[siteIndex];
 return <main className="shell"><aside className="sidebar"><div className="logo"><MoonStar/> <div><b>CLPS</b><small>MISSION BROWSER</small></div></div><p className="side-label">WORKSPACE</p><a className="active">◈　Mission overview</a><a>◎　Surface explorer</a><a>☼　Sunlight & shadows</a><a>⌁　Communications</a><a>✧　Shadow & ice science</a><div className="side-foot">● Prototype environment <span>v0.1</span></div></aside>
 <section className="main"><header><div><small>LUNAR SOUTH POLE</small><h1>Mission overview</h1></div><span className="dataset">● DEMO DATASET</span></header>
 <section className="intro"><div><h2>Plan beyond the horizon.</h2><p>Explore illumination, Earth visibility, and shadowed terrain across candidate lunar regions.</p></div><label className="date"><CalendarDays size={16}/><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label></section>
 <section className="selector"><div className="section-head"><div><small>MISSION TARGET</small><h3>Candidate region</h3></div><span className="tag">ILLUSTRATIVE SITES</span></div><select value={siteIndex} onChange={e=>setSiteIndex(Number(e.target.value))}>{sites.map((s,i)=><option value={i} key={s.name}>{s.name}</option>)}</select><p className="coords"><Compass size={14}/> {site.lat}, {site.lon}　 ·　 South Pole demo region</p></section>
 <section className="metrics"><Metric title="Sunlight availability" value={site.sun} unit="%" Icon={Sun}/><Metric title="Earth visibility" value={site.earth} unit="%" Icon={Satellite}/><Metric title="Shadow coverage" value={site.shadow} unit="%" Icon={MoonStar}/></section>
 <section className="panels"><article className="panel"><small>REGIONAL CONTEXT</small><h3>South pole explorer</h3><div className="moon-scene"><div className="moon"><i/><i/><i/><b>●</b></div><span>SCHEMATIC VIEW · NOT TO SCALE</span></div><p className="coords"><Compass size={14}/> {site.name}</p></article><article className="panel"><small>MISSION CONDITIONS</small><h3>Analysis modules</h3><div className="module"><Sun/><div><b>Sunlight & shadows</b><p>Illumination timeline and terrain shadow modelling planned.</p></div></div><div className="module"><RadioTower/><div><b>Earth communications</b><p>Line-of-sight and terrain obstruction analysis planned.</p></div></div><div className="module"><Telescope/><div><b>Shadow & ice science</b><p>Permanent shadow overlays and validated science layers planned.</p></div></div></article></section>
 <footer>Educational prototype · Demo values are not NASA measurements or operational mission data.</footer></section></main>;
}