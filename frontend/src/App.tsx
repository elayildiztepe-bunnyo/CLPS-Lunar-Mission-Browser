import { useMemo, useState } from 'react';
import { fromBlob } from 'geotiff';
import { Sun, Satellite, MoonStar, RadioTower, Telescope, Compass, CalendarDays, Mountain, Upload, Route, Database, ExternalLink, Activity, MapPin } from 'lucide-react';

type Raster = { width:number; height:number; values:Float32Array; min:number; max:number; noData?:number };
const regions = [
 {name:'Shackleton Rim',lat:'89.90° S',lon:'0.00° E',x:0,y:0},
 {name:'de Gerlache Ridge',lat:'88.50° S',lon:'280.00° E',x:1,y:0},
 {name:'Nobile Crater',lat:'85.00° S',lon:'53.00° E',x:2,y:0},
 {name:'Mons Mouton',lat:'84.00° S',lon:'16.00° E',x:3,y:0}
];
const nasaSources = [
 {name:'NASA GSFC PGDA · South Pole LOLA DEM',detail:'Cloud-Optimized GeoTIFF · 20 m/pixel products; choose the 80S coverage',url:'https://pgda.gsfc.nasa.gov/products/90'},
 {name:'NASA GSFC PGDA · 5 m/pixel landing-site DEMs',detail:'Site-specific elevation, slope, LOLA counts and uncertainty layers',url:'https://core2.gsfc.nasa.gov/PGDA/LOLA_5mpp/'},
 {name:'PDS Geosciences Node · LRO LOLA archive',detail:'Official LOLA EDR, RDR, GDR and documentation',url:'https://pds-geosciences.wustl.edu/missions/lro/lola.htm'}
];
function sampleStats(r:Raster){
 const stride=Math.max(1,Math.floor(Math.sqrt(r.values.length/160000)));
 let min=Infinity,max=-Infinity,count=0;
 for(let i=0;i<r.values.length;i+=stride){const v=r.values[i];if(Number.isFinite(v)&&(r.noData===undefined||v!==r.noData)){min=Math.min(min,v);max=Math.max(max,v);count++;}}
 return {min,max,count};
}
function slopeAt(r:Raster,x:number,y:number){
 const at=(xx:number,yy:number)=>r.values[Math.max(0,Math.min(r.height-1,yy))*r.width+Math.max(0,Math.min(r.width-1,xx))];
 const dx=(at(x+1,y)-at(x-1,y))/2, dy=(at(x,y+1)-at(x,y-1))/2;
 return Math.atan(Math.hypot(dx,dy)/20)*180/Math.PI;
}
export default function App(){
 const [region,setRegion]=useState(0); const [date,setDate]=useState('2026-11-08');
 const [raster,setRaster]=useState<Raster|null>(null); const [status,setStatus]=useState('No local DEM loaded');
 const [busy,setBusy]=useState(false); const [route,setRoute]=useState<number[]>([0,1,2]);
 const site=regions[region];
 const terrain=useMemo(()=>{
  if(!raster)return null;
  const cols=48,rows=32,points:string[]=[];
  for(let y=0;y<rows;y++){for(let x=0;x<cols;x++){
   const sx=Math.floor(x/(cols-1)*(raster.width-1)),sy=Math.floor(y/(rows-1)*(raster.height-1));
   const z=raster.values[sy*raster.width+sx];const px=14+x*10+y*4,py=20+y*5-x*2-(z-raster.min)/(raster.max-raster.min||1)*54;
   points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }}
  return {points,cols,rows};
 },[raster]);
 async function loadDem(file?:File){
  if(!file)return;
  setBusy(true);setStatus('Reading LOLA raster…');
  try{
   const tiff=await fromBlob(file);const image=await tiff.getImage();const rasters=await image.readRasters({samples:[0],interleave:true});
   const values=Float32Array.from(rasters as ArrayLike<number>);const noData=image.getGD appropriateNoData();
   let min=Infinity,max=-Infinity;for(const v of values){if(Number.isFinite(v)&&(noData===null||v!==noData)){min=Math.min(min,v);max=Math.max(max,v);}}
   if(!Number.isFinite(min)||!Number.isFinite(max))throw new Error('No valid elevation samples found.');
   setRaster({width:image.getWidth(),height:image.getHeight(),values,min,max,noData:noData??undefined});
   setStatus(`Loaded local raster · ${image.getWidth()} × ${image.getHeight()} px · source file: ${file.name}`);
  }catch(e){setStatus(e instanceof Error?e.message:'Could not read this GeoTIFF.');setRaster(null);}
  finally{setBusy(false);}
 }
 const meanSlope=raster?(()=>{
  let sum=0,n=0;for(let y=1;y<raster.height-1;y+=Math.max(1,Math.floor(raster.height/60)))for(let x=1;x<raster.width-1;x+=Math.max(1,Math.floor(raster.width/60))){const v=slopeAt(raster,x,y);if(Number.isFinite(v)){sum+=v;n++;}}
  return n?sum/n:0;
 })():null;
 const routeText=route.map(i=>regions[i].name).join(' → ');
 return <main className="shell"><aside className="sidebar"><div className="logo"><MoonStar/><div><b>CLPS</b><small>MISSION BROWSER</small></div></div><p className="side-label">WORKSPACE · v1.2</p><a className="active">◈　Mission overview</a><a href="#terrain">◎　LOLA terrain</a><a href="#mobility">⌁　Slope & mobility</a><a href="#route">✧　Route planner</a><a href="#sources">▤　NASA data sources</a><div className="side-foot">● Research prototype <span>v1.2</span></div></aside>
 <section className="main"><header><div><small>LUNAR SOUTH POLE</small><h1>Mission overview</h1></div><span className="dataset">● NASA DATA WORKFLOW</span></header>
 <section className="intro"><div><h2>Plan with measured lunar terrain.</h2><p>Explore LOLA elevation, derive local slopes, and sketch surface traverse routes.</p></div><label className="date"><CalendarDays size={16}/><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label></section>
 <section className="selector"><div className="section-head"><div><small>MISSION TARGET</small><h3>Candidate region</h3></div><span className="tag">REFERENCE LOCATIONS</span></div><select value={region} onChange={e=>setRegion(Number(e.target.value))}>{regions.map((s,i)=><option value={i} key={s.name}>{s.name}</option>)}</select><p className="coords"><Compass size={14}/> {site.lat}, {site.lon}　 ·　 Approximate reference coordinates; confirm against selected DEM projection.</p></section>
 <section className="metrics"><article className="metric"><div className="metric-title">DEM elevation range <Mountain size={18}/></div><strong>{raster?Math.round(raster.max-raster.min).toLocaleString():'—'}<small>m</small></strong><div className="track"><i style={{width:raster?'100%':'0%'}}/></div><p>{raster?'Computed from loaded raster':'Load LOLA GeoTIFF to calculate'}</p></article><article className="metric"><div className="metric-title">Mean sampled slope <Activity size={18}/></div><strong>{meanSlope===null?'—':meanSlope.toFixed(1)}<small>°</small></strong><div className="track"><i style={{width:meanSlope===null?'0%':Math.min(100,meanSlope/35*100)+'%'}}/></div><p>Derived from adjacent raster cells; 20 m assumed pixel spacing</p></article><article className="metric"><div className="metric-title">Terrain data <Database size={18}/></div><strong>{raster?'LOLA':'—'}</strong><div className="track"><i style={{width:raster?'100%':'0%'}}/></div><p>{raster?'User-selected GeoTIFF loaded':'No NASA measurement loaded'}</p></article></section>
 <section className="panels" id="terrain"><article className="panel"><small>LOLA DIGITAL ELEVATION MODEL</small><h3>3D terrain preview</h3><div className="terrain-view">{terrain?<svg viewBox="0 0 700 250" role="img" aria-label="Oblique terrain mesh generated from loaded elevation raster"><g fill="none" stroke="#d9b66f" strokeWidth="1" opacity=".9">{Array.from({length:terrain.rows},(_,y)=><polyline key={'r'+y} points={terrain.points.slice(y*terrain.cols,(y+1)*terrain.cols).join(' ')}/>)}{Array.from({length:terrain.cols},(_,x)=><polyline key={'c'+x} points={Array.from({length:terrain.rows},(_,y)=>terrain.points[y*terrain.cols+x]).join(' ')}/>)}</g></svg>:<div className="empty-terrain"><Mountain size={38}/><b>Load a LOLA GeoTIFF to render terrain</b><span>Elevation mesh will be derived from the selected raster — no synthetic relief is shown.</span></div>}</div><div className="upload-row"><label className="upload"><Upload size={16}/> {busy?'Reading…':'Load LOLA GeoTIFF'}<input type="file" accept=".tif,.tiff" disabled={busy} onChange={e=>loadDem(e.target.files?.[0])}/></label><span className="file-status">{status}</span></div><p className="note">GeoTIFF is read locally in this browser. Confirm projection, pixel scale, vertical datum and no-data value from its PDS/PGDA metadata before interpreting results.</p></article>
 <article className="panel" id="mobility"><small>ROVER & CREW MOBILITY</small><h3>Slope assessment</h3><div className="slope-legend"><span><i className="low"/> 0–10° · lower slope</span><span><i className="mid"/> 10–20° · caution</span><span><i className="high"/> &gt;20° · steep</span></div><div className="slope-summary"><b>{meanSlope===null?'Awaiting DEM':meanSlope.toFixed(1)+'° average sampled slope'}</b><p>Computed from neighboring elevation samples. This is a preliminary terrain indicator, not a validated rover traversability model.</p></div><div className="module"><Mountain/><div><b>Crater rims, ridges & depressions</b><p>Visible in the elevation mesh when a correctly projected raster is loaded.</p></div></div><div className="module"><Compass/><div><b>Spatial resolution</b><p>{raster?`${raster.width} × ${raster.height} pixels · pixel spacing must be verified in metadata`:'Read from the selected NASA DEM product metadata.'}</p></div></div></article></section>
 <section className="panel route-panel" id="route"><small>EXPLORATION PLANNING</small><h3>Surface traverse sketch</h3><p className="subtext">Arrange reference stops to draft a conceptual route. This does not calculate a safe or optimized path.</p><div className="route-controls">{regions.map((r,i)=><label key={r.name}><input type="checkbox" checked={route.includes(i)} onChange={e=>setRoute(old=>e.target.checked?[...old,i]:old.filter(x=>x!==i))}/>{r.name}</label>)}</div><div className="route-result"><Route size={18}/><span>{route.length?routeText:'Select at least one stop'}</span><b>{route.length} stops</b></div></section>
 <section className="panel sources" id="sources"><div className="section-head"><div><small>PRIMARY DATA & DOCUMENTATION</small><h3>NASA / PDS source catalogue</h3></div><Database color="#e5c47d"/></div>{nasaSources.map(s=><a className="source-link" key={s.name} href={s.url} target="_blank" rel="noreferrer"><div><b>{s.name}</b><p>{s.detail}</p></div><ExternalLink size={16}/></a>)}</section>
 <section className="panel caveat"><b>Scientific integrity & limitations</b><p>Elevation and slope values appear only after a user loads a raster file. No NASA dataset is silently substituted. Sunlight, Earth visibility, shadow duration, and communications geometry are not yet computed from date-specific SPICE ephemerides; those modules remain planned and are not presented as measured values. Verify LOLA product version, map projection, pixel spacing, vertical scaling, uncertainty and coverage before operational use.</p></section>
 <footer>Educational research prototype · Not a NASA product · Not for operational landing or crew-safety decisions.</footer></section></main>;
}
