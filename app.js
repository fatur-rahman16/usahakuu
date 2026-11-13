/* ===== Konstanta & utilitas ===== */
const KEY='usahaFaturV3', OLD_KEY='usahaEsPremiumV2';
const MONTHS=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const DAYS=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const pad=n=>String(n).padStart(2,'0');
const ds=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const dt=s=>{const a=s.split('-').map(Number);return new Date(a[0],a[1]-1,a[2])};
const addDays=(s,n)=>{const d=dt(s);d.setDate(d.getDate()+n);return ds(d)};
const today=()=>ds(new Date());
const weekStart=s=>{const d=dt(s);d.setDate(d.getDate()-((d.getDay()-5+7)%7));return ds(d)};
const weekEnd=w=>addDays(w,6);
const payDate=w=>addDays(w,7);
const currentWeek=()=>weekStart(today());
const fmtD=s=>dt(s).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});
const fmtS=s=>dt(s).toLocaleDateString('id-ID',{day:'numeric',month:'short'});
const rp=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Math.round(Number(n)||0));
const num=n=>new Intl.NumberFormat('id-ID',{maximumFractionDigits:2}).format(Number(n)||0);
const weekNo=w=>{const d=dt(w);let f=weekStart(ds(new Date(d.getFullYear(),d.getMonth(),1)));if(dt(f).getMonth()!==d.getMonth())f=addDays(f,7);return Math.floor((d-dt(f))/(7*864e5))+1};
const weekLabel=w=>'Minggu '+weekNo(w)+' • '+MONTHS[dt(w).getMonth()];
function weeksOfMonth(y,m){const last=new Date(y,m+1,0);let w=weekStart(ds(new Date(y,m,1)));if(dt(w).getMonth()!==m)w=addDays(w,7);const out=[];while(dt(w)<=last){out.push(w);w=addDays(w,7)}return out}
const empty=t=>`<div class="empty">${t}</div>`;
const sumQ=(arr,type)=>arr.filter(x=>x.type===type).reduce((a,x)=>a+Number(x.qty),0);
const byNew=(a,b)=>(b.date.localeCompare(a.date))||((b.createdAt||0)-(a.createdAt||0));

const P={
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  cal:'<rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/><path d="M8 14h.01M12 14h.01M16 14h.01"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  up:'<path d="M7 17 17 7M9 7h8v8"/>',
  undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  tag:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  chevL:'<path d="m15 18-6-6 6-6"/>',
  chevR:'<path d="m9 18 6-6-6-6"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  download:'<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  upload:'<path d="M12 21V9M7 14l5-5 5 5M4 3h16"/>',
  store:'<path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M9 20v-5h6v5"/>',
  alert:'<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M3 3l18 18"/><path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.2 3.9M6.6 6.6A17 17 0 0 0 2 12s3.5 6 10 6a9.8 9.8 0 0 0 4.4-1"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
  compare:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  down:'<path d="M7 7l10 10M17 9v8H9"/>',
  moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  doc:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h8"/>',
  camera:'<path d="M4 7h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.5"/>'
};
function ic(n,s=22){return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]||''}</svg>`}

/* ===== Data ===== */
const storePct=d=>{const n=Number(d.settings&&d.settings.storePercent);return Number.isFinite(n)?n:15};
function DEFAULT(){return{v:3,profile:{name:'UsahaKu',photo:'',role:'Pemilik usaha'},products:[],transactions:[],purchases:[],payments:[],items:[],customers:[],receipts:[],reminder:remDefault(),settings:{storePercent:15}}}
function normalize(x){const d=DEFAULT();const items=Array.isArray(x.items)?x.items.slice():[];x.purchases.forEach(b=>{if(b.item&&!items.some(i=>i.toLowerCase()===String(b.item).toLowerCase()))items.push(b.item)});const products=x.products.map(p=>(p.id==='p-es'&&p.name==='Es FTR')?{...p,name:'Produk Pertama',unit:p.unit||'pcs'}:p);return{v:3,profile:(()=>{const q={...d.profile,...(x.profile||{})};if(q.name==='USAHA FATUR')q.name='UsahaKu';return q})(),products,transactions:x.transactions,purchases:x.purchases,payments:Array.isArray(x.payments)?x.payments:[],customers:Array.isArray(x.customers)?x.customers:[],receipts:Array.isArray(x.receipts)?x.receipts:[],items,reminder:{...d.reminder,...(x.reminder||{})},settings:{...d.settings,...(x.settings||{})}}}
const isV3=x=>x&&Array.isArray(x.products)&&Array.isArray(x.transactions)&&Array.isArray(x.purchases);

function migrate(old){
  const d=DEFAULT(),pid='p-es';
  const price=Number(old.settings&&old.settings.price)||1000;
  d.products=[{id:pid,name:'Produk Pertama',price,unit:'pcs',active:true}];
  if(old.settings&&Number.isFinite(Number(old.settings.storePercent))&&old.settings.storePercent!==undefined)d.settings.storePercent=Number(old.settings.storePercent);
  d.transactions=(old.transactions||[]).map(t=>({id:'t'+t.id,type:t.type==='return'?'return':'deliver',date:t.date,productId:pid,qty:Number(t.qty)||0,price,note:t.note||'',createdAt:Number(t.id)||0})).filter(t=>t.qty>0&&t.date);
  d.purchases=(old.purchases||[]).map(b=>({id:'b'+b.id,date:b.date,item:b.item||'Lainnya',productId:null,qty:Number(b.qty)||0,unit:b.unit||'',unitPrice:Number(b.unitPrice)||0,total:Number(b.total)||0,note:'',createdAt:Number(b.id)||0})).filter(b=>b.date);
  d.items=[...new Set(d.purchases.map(b=>b.item))];
  d.payments=(old.payments||[]).filter(p=>p.paid&&p.week).map(p=>{const s=calc(d,p.week);s.income=Number(p.amount)||s.income;s.surplus=s.income-s.capital;return{week:p.week,date:p.date||p.week,snap:s}});
  return d;
}
function load(){
  try{const raw=localStorage.getItem(KEY);if(raw){const x=JSON.parse(raw);if(isV3(x))return normalize(x)}}catch(e){}
  try{const old=localStorage.getItem(OLD_KEY);if(old){const x=JSON.parse(old);if(x&&Array.isArray(x.transactions))return migrate(x)}}catch(e){}
  return DEFAULT();
}

const inWeek=(arr,w)=>{const e=weekEnd(w);return arr.filter(x=>x.date>=w&&x.date<=e)};
const txIn=(d,w)=>inWeek(d.transactions,w);
const purIn=(d,w)=>inWeek(d.purchases,w);

function prodStats(d,w){
  const m=new Map();
  const get=id=>{if(!m.has(id)){const p=d.products.find(x=>x.id===id);m.set(id,{id,name:p?p.name:'Produk dihapus',deliver:0,ret:0,gross:0})}return m.get(id)};
  d.products.forEach(p=>get(p.id));
  txIn(d,w).forEach(t=>{const s=get(t.productId),v=t.qty*t.price;if(t.type==='return'){s.ret+=t.qty;s.gross-=v}else{s.deliver+=t.qty;s.gross+=v}});
  return [...m.values()];
}
function calc(d,w){
  const ps=prodStats(d,w);
  const sum=k=>ps.reduce((a,s)=>a+s[k],0);
  const deliver=sum('deliver'),ret=sum('ret'),gross=sum('gross');
  const pct=storePct(d),store=gross*pct/100,income=gross-store;
  const capital=purIn(d,w).reduce((a,b)=>a+b.total,0);
  return{deliver,ret,net:deliver-ret,gross,pct,store,income,capital,surplus:income-capital};
}
function view(d,w){const p=d.payments.find(x=>x.week===w);return p?{...p.snap,paid:true,paidAt:p.date}:{...calc(d,w),paid:false}}
function payState(d,w){if(d.payments.some(x=>x.week===w))return'paid';return today()<=weekEnd(w)?'run':'due'}

/* ===== Simpan & aksi data ===== */
function commit(){
  try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){toast('Gagal menyimpan. Penyimpanan perangkat penuh atau diblokir.','err')}
  renderAll();
}
function markPaid(w){
  if(payState(db,w)!=='due') return toast('Periode ini belum selesai. Bisa ditandai setelah Kamis.','warn');
  db.payments.push({week:w,date:today(),snap:calc(db,w)});
  commit(); toast('Ditandai sudah diterima','ok');
}
function undoPaid(w){
  if(!confirm('Batalkan tanda diterima untuk periode ini?'))return;
  db.payments=db.payments.filter(p=>p.week!==w);
  commit(); toast('Tanda diterima dibatalkan');
}
function shiftWeek(n){
  selW = n===0 ? currentWeek() : addDays(selW,n);
  if(selW>currentWeek()) selW=currentWeek();
  renderAll();
}
function shiftMonth(n){mDate=new Date(mDate.getFullYear(),mDate.getMonth()+n,1);renderAll()}
function go(p){
  page=p;
  document.querySelectorAll('.page').forEach(s=>s.classList.toggle('on',s.id==='p-'+p));
  document.querySelectorAll('.dk').forEach(b=>b.classList.toggle('on',b.dataset.go===p));
  window.scrollTo({top:0});
  renderAll();
  if(p==='wa')renderWA();
  if(p==='banding')renderBanding();
}

/* ===== Sheet & toast ===== */
function openSheet(html){$('sheetBody').innerHTML=html;$('sheet').classList.add('show')}
function closeSheet(){$('sheet').classList.remove('show');formCtx=null}
function toast(msg,type='ok'){
  const t=document.createElement('div');
  t.className='toast '+type;t.textContent=msg;
  $('toasts').appendChild(t);
  setTimeout(()=>t.classList.add('out'),2200);
  setTimeout(()=>t.remove(),2600);
}
function seg(el){
  const [target,val]=el.dataset.seg.split('|');
  $(target).value=val;
  el.parentElement.querySelectorAll(':scope>button').forEach(b=>b.classList.toggle('on',b===el));
  live();
}
function live(){
  const tot=$('f-total'); if(!tot) return;
  const qty=Number($('f-qty')?.value)||0;
  if($('f-unitp')){tot.textContent=rp(qty*(Number($('f-unitp').value)||0));return}
  const p=db.products.find(x=>x.id===$('f-prod')?.value);
  let price=p?p.price:0;
  if(formCtx&&formCtx.tx&&p&&formCtx.tx.productId===p.id)price=formCtx.tx.price;
  tot.textContent=rp(qty*price);
}

/* ===== Komponen ===== */
function periodNav(){
  const atNow=selW>=currentWeek();
  return `<div class="pn"><button class="icon-btn" data-pw="-7" aria-label="Periode sebelumnya">${ic('chevL',18)}</button><div class="pn-mid"><b>${weekLabel(selW)}</b><small>${fmtS(selW)} – ${fmtD(weekEnd(selW))}</small></div><button class="icon-btn" data-pw="7" ${atNow?'disabled':''} aria-label="Periode berikutnya">${ic('chevR',18)}</button></div>${atNow?'':`<div class="pn-now"><button class="btn ghost sm" data-pw="0">Kembali ke periode berjalan</button></div>`}`;
}
function txRow(x,act){
  const p=db.products.find(q=>q.id===x.productId), r=x.type==='return', amt=x.qty*x.price;
  return `<div class="row"><div class="bubble ${r?'r':''}">${ic(r?'undo':'up',18)}</div><div class="grow"><div class="t1">${esc(p?p.name:'Produk dihapus')}<span class="tag ${r?'r':'g'}">${r?'Kembali':'Antar'}</span></div><div class="t2">${fmtS(x.date)} • ${x.qty} × ${rp(x.price)}${x.customerId?' • '+esc(custName(x.customerId)):''}${x.note?' • '+esc(x.note):''}</div></div><div class="amt ${r?'neg':'pos'}">${r?'−':'+'}${rp(amt)}</div>${act?`<button class="icon-btn" data-act="tx-edit" data-id="${x.id}" aria-label="Edit">${ic('edit',16)}</button><button class="icon-btn danger" data-act="tx-del" data-id="${x.id}" aria-label="Hapus">${ic('trash',16)}</button>`:''}</div>`;
}
function purRow(b){
  const p=db.products.find(q=>q.id===b.productId);
  return `<div class="row"><div class="bubble b">${ic('box',18)}</div><div class="grow"><div class="t1">${esc(b.item)}</div><div class="t2">${fmtS(b.date)} • ${num(b.qty)} ${esc(b.unit)} × ${rp(b.unitPrice)} • ${p?esc(p.name):'Modal umum'}${b.note?' • '+esc(b.note):''}</div></div><div class="amt">${rp(b.total)}</div><button class="icon-btn" data-act="pur-edit" data-id="${b.id}" aria-label="Edit">${ic('edit',16)}</button><button class="icon-btn danger" data-act="pur-del" data-id="${b.id}" aria-label="Hapus">${ic('trash',16)}</button></div>`;
}
function prodRow(p){
  const n=db.transactions.filter(t=>t.productId===p.id).length;
  return `<div class="row"><div class="bubble a">${ic('tag',18)}</div><div class="grow"><div class="t1">${esc(p.name)}${p.active?'':'<span class="tag r">Nonaktif</span>'}</div><div class="t2">${rp(p.price)} per ${esc(p.unit||'pcs')} • ${n} catatan</div></div><button class="icon-btn" data-act="prod-toggle" data-id="${p.id}" aria-label="Aktif/nonaktif">${ic(p.active?'eye':'eyeoff',16)}</button><button class="icon-btn" data-act="prod-edit" data-id="${p.id}" aria-label="Edit">${ic('edit',16)}</button><button class="icon-btn danger" data-act="prod-del" data-id="${p.id}" aria-label="Hapus">${ic('trash',16)}</button></div>`;
}
function capRows(w){
  const list=purIn(db,w);
  const rows=db.products.map(p=>({name:p.name,total:list.filter(b=>b.productId===p.id).reduce((a,b)=>a+b.total,0)}));
  rows.push({name:'Modal umum',total:list.filter(b=>!b.productId).reduce((a,b)=>a+b.total,0)});
  const shown=rows.filter(r=>r.total>0);
  return shown.length?shown.map(r=>`<div class="row"><div class="bubble b">${ic('box',18)}</div><div class="grow"><div class="t1">${esc(r.name)}</div></div><div class="amt">${rp(r.total)}</div></div>`).join(''):empty('Belum ada modal di periode ini');
}
function chipFor(st){
  return {paid:'<span class="chip ok">Diterima</span>',run:'<span class="chip wait">Berjalan</span>',due:'<span class="chip due">Siap ditandai</span>'}[st];
}

/* ===== Halaman ===== */
function renderHome(){
  const w=selW, v=view(db,w), st=payState(db,w), t=today();
  const all=prodStats(db,w), ps=all.filter(s=>s.deliver||s.ret), warn=all.filter(s=>s.ret>s.deliver);
  const tdy=db.transactions.filter(x=>x.date===t);
  const tD=sumQ(tdy,'deliver'), tR=sumQ(tdy,'return');
  let pt, pb='';
  if(st==='paid'){pt='Diterima pada '+fmtD(v.paidAt);pb=`<button class="btn ghost sm" data-act="pay-undo" data-w="${w}">Batalkan</button>`}
  else if(st==='run'){pt='Periode belum selesai. Bisa ditandai setelah '+fmtD(weekEnd(w))+'.'}
  else{pt='Jatuh tempo Jumat, '+fmtD(payDate(w));pb=`<button class="btn primary sm" data-act="pay-mark" data-w="${w}">Tandai diterima</button>`}
  const recent=[...db.transactions].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,5);
  $('p-home').innerHTML=`
    ${reminderBanner()}
    ${periodNav()}
    <div class="card hero">
      <div class="eyebrow">Hasil diterima • ${weekLabel(w)}</div>
      <div class="big">${rp(v.income)}</div>
      <div class="g2 mt">
        <div class="stat"><small>Omzet kotor</small><b>${rp(v.gross)}</b></div>
        <div class="stat"><small>Bagian toko ${num(v.pct)}%</small><b>${rp(v.store)}</b></div>
        <div class="stat"><small>Modal</small><b>${rp(v.capital)}</b></div>
        <div class="stat"><small>Surplus</small><b class="${v.surplus<0?'neg':'pos'}">${rp(v.surplus)}</b></div>
      </div>
    </div>
    ${warn.length?`<div class="alert">${ic('alert',18)}<span>Barang kembali melebihi antar pada: ${warn.map(s=>esc(s.name)).join(', ')}</span></div>`:''}
    <div class="card"><div class="card-h"><h3>Pembayaran</h3>${chipFor(st)}</div><div class="pay"><span>${pt}</span>${pb}</div></div>
    <div class="card">
      <div class="card-h"><h3>Hari ini</h3><span class="fine">${DAYS[new Date().getDay()]}, ${fmtS(t)}</span></div>
      <div class="g3">
        <div class="stat"><small>Antar</small><b>${tD}</b></div>
        <div class="stat"><small>Kembali</small><b>${tR}</b></div>
        <div class="stat"><small>Bersih</small><b>${tD-tR}</b></div>
      </div>
    </div>
    <div class="card">
      <div class="card-h"><h3>Per produk</h3><span class="fine">${ps.length} produk</span></div>
      <div class="list">${ps.length?ps.map(s=>`<div class="row"><div class="bubble a">${ic('tag',18)}</div><div class="grow"><div class="t1">${esc(s.name)}</div><div class="t2">${s.deliver} antar${s.ret?` • ${s.ret} kembali`:''} • bersih ${s.deliver-s.ret}</div></div><div class="amt">${rp(s.gross)}</div></div>`).join(''):empty('Belum ada penjualan di periode ini')}</div>
    </div>
    <div class="card">
      <div class="card-h"><h3>Aktivitas terbaru</h3></div>
      <div class="list">${recent.length?recent.map(x=>txRow(x,false)).join(''):empty('Belum ada aktivitas')}</div>
    </div>`;
}

function renderKeu(){
  const w=selW, v=view(db,w);
  const tx=txIn(db,w).sort(byNew), pur=purIn(db,w).sort(byNew);
  const d=sumQ(tx,'deliver'), r=sumQ(tx,'return');
  const gross=tx.reduce((a,x)=>a+(x.type==='return'?-1:1)*x.qty*x.price,0);
  const tabs=`<div class="seg"><button class="${kv==='jual'?'on':''}" data-kv="jual">Penjualan</button><button class="${kv==='modal'?'on':''}" data-kv="modal">Modal</button></div>`;
  let body;
  if(kv==='jual'){
    body=`
      <div class="card"><div class="g2">
        <div class="stat"><small>Antar</small><b>${d}</b></div>
        <div class="stat"><small>Kembali</small><b>${r}</b></div>
        <div class="stat"><small>Bersih</small><b>${d-r}</b></div>
        <div class="stat"><small>Omzet kotor</small><b>${rp(gross)}</b></div>
      </div></div>
      <div class="card">
        <div class="card-h"><h3>Catatan penjualan</h3><button class="btn primary sm" data-act="tx-new" data-type="deliver">${ic('plus',16)} Catat</button></div>
        <div class="list">${tx.length?tx.map(x=>txRow(x,true)).join(''):empty('Belum ada catatan di periode ini')}</div>
      </div>`;
  } else {
    const total=pur.reduce((a,b)=>a+b.total,0);
    body=`
      <div class="card hero"><div class="eyebrow">Total modal</div><div class="big">${rp(total)}</div><div class="fine">${pur.length} pembelian di periode ini</div></div>
      <div class="card"><div class="card-h"><h3>Modal per produk</h3></div><div class="list">${capRows(w)}</div></div>
      <div class="card">
        <div class="card-h"><h3>Daftar pembelian</h3><button class="btn primary sm" data-act="pur-new">${ic('plus',16)} Tambah</button></div>
        <div class="list">${pur.length?pur.map(purRow).join(''):empty('Belum ada pembelian di periode ini')}</div>
      </div>`;
  }
  $('p-keu').innerHTML=`
    <div class="h1">Keuangan</div>
    <p class="sub">Penjualan dan modal per periode Jumat–Kamis</p>
    ${periodNav()}
    ${v.paid?'<div class="note">Periode ini sudah ditandai diterima. Angka hasil mengikuti saat ditandai.</div>':''}
    ${tabs}${body}`;
}

function periodCard({w,v,st}){
  let foot;
  if(st==='due') foot=`<button class="btn primary sm" data-act="pay-mark" data-w="${w}">Tandai diterima</button>`;
  else if(st==='paid') foot=`<span class="fine">Diterima ${fmtD(v.paidAt)}</span><button class="btn ghost sm" data-act="pay-undo" data-w="${w}">Batalkan</button>`;
  else foot=`<span class="fine">Berjalan sampai ${fmtD(weekEnd(w))}</span>`;
  return `<div class="card">
    <div class="card-h"><div><h3>${weekLabel(w)}</h3><div class="fine">${fmtS(w)} – ${fmtD(weekEnd(w))}</div></div>${chipFor(st)}</div>
    <div class="g2">
      <div class="stat"><small>Bersih</small><b>${v.net}</b></div>
      <div class="stat"><small>Hasil</small><b>${rp(v.income)}</b></div>
      <div class="stat"><small>Modal</small><b>${rp(v.capital)}</b></div>
      <div class="stat"><small>Surplus</small><b class="${v.surplus<0?'neg':'pos'}">${rp(v.surplus)}</b></div>
    </div>
    <div class="foot"><button class="btn ghost sm" data-act="open-week" data-w="${w}">Buka</button>${foot}</div>
  </div>`;
}

function renderRencana(){
  const y=mDate.getFullYear(), m=mDate.getMonth(), ws=weeksOfMonth(y,m);
  const items=ws.map(w=>({w,v:view(db,w),st:payState(db,w)}));
  const got=items.filter(i=>i.st==='paid').reduce((a,i)=>a+i.v.income,0);
  const wait=items.filter(i=>i.st!=='paid').reduce((a,i)=>a+i.v.income,0);
  const gross=items.reduce((a,i)=>a+i.v.gross,0);
  $('p-rencana').innerHTML=`
    <div class="h1">Rencana</div>
    <p class="sub">Status dan pembayaran per periode</p>
    <div class="pn"><button class="icon-btn" data-mo="-1" aria-label="Bulan sebelumnya">${ic('chevL',18)}</button><div class="pn-mid"><b>${MONTHS[m]} ${y}</b><small>${ws.length} periode</small></div><button class="icon-btn" data-mo="1" aria-label="Bulan berikutnya">${ic('chevR',18)}</button></div>
    <div class="card"><div class="g3">
      <div class="stat"><small>Omzet bulan ini</small><b>${rp(gross)}</b></div>
      <div class="stat"><small>Sudah diterima</small><b class="pos">${rp(got)}</b></div>
      <div class="stat"><small>Belum diterima</small><b class="${wait?'warnT':''}">${rp(wait)}</b></div>
    </div></div>
    ${items.map(periodCard).join('')}`;
}

function avatarHTML(big){return db.profile.photo?`<img src="${db.profile.photo}" alt="Foto profil">`:ic('user',big?44:22)}
function renameForm(){
  openSheet(`
    <div class="sh-head"><h2>Ubah nama</h2><button class="icon-btn" data-act="close" aria-label="Tutup">${ic('x',18)}</button></div>
    <label class="lbl">Nama</label>
    <input id="f-name" value="${esc(db.profile.name)}" maxlength="40" placeholder="Nama kamu atau nama usaha">
    <label class="lbl">Keterangan</label>
    <input id="f-role" value="${esc(db.profile.role||'')}" maxlength="40" placeholder="Contoh: Pemilik usaha">
    <button class="btn primary block" data-act="rename-save">Simpan</button>`);
}
function saveRename(){
  const n=$('f-name').value.trim();
  if(!n) return toast('Isi nama','warn');
  db.profile.name=n; db.profile.role=$('f-role').value.trim();
  closeSheet(); commit(); toast('Nama diperbarui','ok');
}
function onPhoto(e){
  const f=e.target.files[0]; e.target.value='';
  if(!f) return;
  if(!f.type.startsWith('image/')) return toast('Pilih file gambar','warn');
  const r=new FileReader();
  r.onload=()=>{
    const img=new Image();
    img.onload=()=>{
      const S=256,c=document.createElement('canvas');c.width=S;c.height=S;
      const m=Math.min(img.width,img.height),sx=(img.width-m)/2,sy=(img.height-m)/2;
      c.getContext('2d').drawImage(img,sx,sy,m,m,0,0,S,S);
      db.profile.photo=c.toDataURL('image/jpeg',0.85);
      commit(); toast('Foto profil diperbarui','ok');
    };
    img.onerror=()=>toast('Gambar tidak bisa dibuka','err');
    img.src=r.result;
  };
  r.readAsDataURL(f);
}
function addItem(){
  const v=$('s-item').value.trim();
  if(!v) return toast('Ketik nama bahan','warn');
  if(db.items.some(i=>i.toLowerCase()===v.toLowerCase())) return toast('Bahan sudah ada','warn');
  db.items.push(v); commit(); toast('Bahan ditambahkan','ok');
}
function delItem(n){db.items=db.items.filter(i=>i!==n);commit()}

function renderPribadi(){
  const monthStart=today().slice(0,8)+'01';
  $('p-pribadi').innerHTML=`
    <div class="h1">Pribadi</div>
    <div class="card profile">
      <button class="pf-avatar" data-act="photo" aria-label="Ganti foto profil">${avatarHTML(true)}<span class="av-cam">${ic('camera',14)}</span></button>
      <div class="pf-name">${esc(db.profile.name)}</div>
      <div class="fine">${esc(db.profile.role||'Pemilik usaha')}</div>
      <div class="pf-actions">
        <button class="btn ghost sm" data-act="photo">${ic('upload',16)} Ganti foto</button>
        ${db.profile.photo?`<button class="btn ghost sm" data-act="photo-del">${ic('trash',16)} Hapus foto</button>`:''}
        <button class="btn ghost sm" data-act="rename">${ic('edit',16)} Ubah nama</button>
      </div>
    </div>
    <div class="card">
      <div class="card-h"><h3>Pengaturan usaha</h3></div>
      <label class="lbl">Bagian toko (%)</label>
      <input id="s-pct" type="number" inputmode="decimal" min="0" max="100" step="0.01" value="${storePct(db)}">
      <p class="note">Bagian toko dihitung dari omzet kotor. Periode yang sudah ditandai diterima tetap memakai angka saat ditandai.</p>
      <button class="btn primary block" data-act="save-settings">Simpan pengaturan</button>
    </div>
    <div class="card">
      <div class="card-h"><h3>Produk</h3><button class="btn ghost sm" data-act="prod-new">${ic('plus',16)} Tambah</button></div>
      <div class="list">${db.products.length?db.products.map(prodRow).join(''):empty('Belum ada produk. Tekan Tambah untuk membuat produk pertama.')}</div>
    </div>
    <div class="card">
      <div class="card-h"><h3>Daftar bahan modal</h3></div>
      <p class="fine">Bahan yang Anda ketik saat mencatat modal tersimpan otomatis di sini.</p>
      <div class="chips">${db.items.length?db.items.map(i=>`<span class="chipx">${esc(i)}<button data-act="item-del" data-n="${esc(i)}" aria-label="Hapus bahan">${ic('x',12)}</button></span>`).join(''):'<span class="fine">Belum ada bahan tersimpan</span>'}</div>
      <label class="lbl">Tambah bahan</label>
      <div class="inline"><input id="s-item" placeholder="Contoh: Pop Ice"><button class="btn primary sm" data-act="item-add">Tambah</button></div>
    </div>
    ${remCard()}
    <div class="card">
      <div class="card-h"><h3>Laporan</h3></div>
      <div class="two">
        <div><label class="lbl">Dari</label><input type="date" id="lp-from" value="${monthStart}"></div>
        <div><label class="lbl">Sampai</label><input type="date" id="lp-to" value="${today()}"></div>
      </div>
      <div class="g2 mt">
        <button class="btn ghost" data-act="report-csv">${ic('download',18)} Unduh CSV</button>
        <button class="btn ghost" data-act="report-view">${ic('doc',18)} Lihat / PDF</button>
      </div>
      <p class="note">CSV bisa dibuka di Excel. Untuk PDF, pilih "Cetak / simpan PDF" lalu pilih Simpan sebagai PDF.</p>
    </div>
    <div class="card">
      <div class="card-h"><h3>Data</h3></div>
      <div class="g2">
        <button class="btn ghost" data-act="backup">${ic('download',18)} Backup</button>
        <button class="btn ghost" data-act="restore">${ic('upload',18)} Pulihkan</button>
      </div>
      <p class="note">Data tersimpan di perangkat ini. Lakukan backup secara berkala agar tidak hilang.</p>
    </div>
    ${lockCard()}
    ${pwaCard()}`;
}

function renderAll(){
  $('todayTxt').textContent=new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  $('brandName').textContent=db.profile.name;
  $('avHeader').innerHTML=avatarHTML(false);
  renderHome(); renderKeu(); renderRencana(); renderPribadi(); renderPelanggan();
}

/* ===== Formulir ===== */
let formCtx=null;
function plusSheet(){
  const mi=(act,extra,icon,cls,title,sub)=>`<button class="menu-it" data-act="${act}" ${extra}><span class="bubble ${cls}">${ic(icon,20)}</span><span class="grow"><span class="t1 blk">${title}</span><span class="t2 blk">${sub}</span></span>${ic('chevR',18)}</button>`;
  openSheet(`
    <div class="sh-head"><h2>Tambah</h2><button class="icon-btn" data-act="close" aria-label="Tutup">${ic('x',18)}</button></div>
    ${mi('tx-new','data-type="deliver"','up','','Catat penjualan','Penjualan ke toko')}
    ${mi('tx-new','data-type="return"','undo','r','Barang kembali','Barang yang dikembalikan dari toko')}
    ${mi('pur-new','','box','b','Pembelian modal','Bahan, plastik, pemanis, galon')}
    ${mi('prod-new','','tag','a','Produk baru','Tambah jenis produk dan harga')}`);
}
function txForm(id,type){
  const t=id?db.transactions.find(x=>x.id===id):null;
  if(id&&!t) return;
  const prods=db.products.filter(p=>p.active||(t&&p.id===t.productId));
  if(!prods.length){toast('Tambah produk dulu di menu Pribadi','warn');go('pribadi');return}
  const tp=t?t.type:(type||'deliver');
  const selId=t?t.productId:prods[0].id;
  formCtx={tx:t};
  openSheet(`
    <div class="sh-head"><h2>${t?'Edit catatan':'Catat penjualan'}</h2><button class="icon-btn" data-act="close" aria-label="Tutup">${ic('x',18)}</button></div>
    <div class="seg" style="margin-top:12px">
      <button class="${tp==='deliver'?'on':''}" data-seg="f-type|deliver">Antar ke toko</button>
      <button class="${tp==='return'?'on':''}" data-seg="f-type|return">Barang kembali</button>
    </div>
    <input type="hidden" id="f-type" value="${tp}">
    <label class="lbl">Produk</label>
    <select id="f-prod">${prods.map(p=>`<option value="${p.id}" ${p.id===selId?'selected':''}>${esc(p.name)} • ${rp(p.price)}</option>`).join('')}</select>
    <label class="lbl">Pelanggan (opsional)</label>
    <select id="f-cust"><option value="">Tanpa pelanggan</option>${db.customers.map(c=>`<option value="${c.id}" ${t&&t.customerId===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select>
    <div class="two">
      <div><label class="lbl">Tanggal</label><input type="date" id="f-date" value="${t?t.date:today()}"></div>
      <div><label class="lbl">Jumlah</label><input type="number" id="f-qty" inputmode="numeric" min="1" step="1" value="${t?t.qty:''}" placeholder="0"></div>
    </div>
    <label class="lbl">Catatan</label>
    <input id="f-note" value="${esc(t?t.note:'')}" placeholder="Opsional, misal: antar pagi">
    <div class="totalbar"><span>Total</span><b id="f-total">${rp(0)}</b></div>
    <button class="btn primary block" data-act="tx-save" data-id="${t?t.id:''}">Simpan</button>`);
  live();
}
function saveTx(id){
  const type=$('f-type').value, pid=$('f-prod').value, date=$('f-date').value;
  const qty=Number($('f-qty').value), note=$('f-note').value.trim();
  const p=db.products.find(x=>x.id===pid);
  const cust=$('f-cust')?($('f-cust').value||null):null;
  if(!p) return toast('Pilih produk','warn');
  if(!date) return toast('Isi tanggal','warn');
  if(!(qty>0)||!Number.isInteger(qty)) return toast('Jumlah harus bilangan bulat lebih dari 0','warn');
  if(id){
    const t=db.transactions.find(x=>x.id===id); if(!t) return;
    if(t.productId!==pid){t.productId=pid;t.price=p.price}
    Object.assign(t,{type,date,qty,note,customerId:cust});
  } else {
    db.transactions.push({id:uid(),type,date,productId:pid,qty,price:p.price,note,customerId:cust,createdAt:Date.now()});
  }
  closeSheet(); commit(); toast(id?'Perubahan disimpan':'Catatan tersimpan','ok');
}
function purForm(id){
  const b=id?db.purchases.find(x=>x.id===id):null;
  if(id&&!b) return;
  const prods=db.products.filter(p=>p.active||(b&&b.productId===p.id));
  formCtx=null;
  openSheet(`
    <div class="sh-head"><h2>${b?'Edit modal':'Catat pembelian modal'}</h2><button class="icon-btn" data-act="close" aria-label="Tutup">${ic('x',18)}</button></div>
    <label class="lbl">Untuk</label>
    <select id="f-target"><option value="">Modal umum (semua produk)</option>${prods.map(p=>`<option value="${p.id}" ${b&&b.productId===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select>
    <label class="lbl">Bahan / barang</label>
    <input id="f-item" list="items-list" value="${esc(b?b.item:'')}" placeholder="Ketik atau pilih bahan">
    <datalist id="items-list">${db.items.map(x=>`<option value="${esc(x)}">`).join('')}</datalist>
    <div class="two">
      <div><label class="lbl">Tanggal</label><input type="date" id="f-date" value="${b?b.date:today()}"></div>
      <div><label class="lbl">Jumlah</label><input type="number" id="f-qty" inputmode="decimal" min="0" step="any" value="${b?b.qty:''}" placeholder="0"></div>
    </div>
    <div class="two">
      <div><label class="lbl">Satuan</label><input id="f-unit" value="${esc(b?b.unit:'')}" placeholder="pack / galon"></div>
      <div><label class="lbl">Harga satuan</label><input type="number" id="f-unitp" inputmode="numeric" min="0" value="${b?b.unitPrice:''}" placeholder="0"></div>
    </div>
    <label class="lbl">Catatan</label>
    <input id="f-note" value="${esc(b?b.note||'':'')}" placeholder="Opsional">
    <div class="totalbar"><span>Total</span><b id="f-total">${rp(0)}</b></div>
    <button class="btn primary block" data-act="pur-save" data-id="${id||''}">Simpan</button>`);
  live();
}
function savePur(id){
  const target=$('f-target').value||null, item=$('f-item').value.trim(), date=$('f-date').value;
  const qty=Number($('f-qty').value), unit=$('f-unit').value.trim(), note=$('f-note').value.trim();
  const rawPrice=$('f-unitp').value, unitPrice=Number(rawPrice);
  if(!date) return toast('Isi tanggal','warn');
  if(!item) return toast('Isi nama bahan','warn');
  if(!(qty>0)) return toast('Jumlah harus lebih dari 0','warn');
  if(rawPrice===''||!(unitPrice>=0)) return toast('Isi harga satuan','warn');
  if(!db.items.some(i=>i.toLowerCase()===item.toLowerCase()))db.items.push(item);
  const rec={date,item,productId:target,qty,unit,unitPrice,total:Math.round(qty*unitPrice),note};
  if(id){const b=db.purchases.find(x=>x.id===id); if(b) Object.assign(b,rec)}
  else db.purchases.push({id:uid(),createdAt:Date.now(),...rec});
  closeSheet(); commit(); toast('Pembelian tersimpan','ok');
}
function prodForm(id){
  const p=id?db.products.find(x=>x.id===id):null;
  formCtx=null;
  openSheet(`
    <div class="sh-head"><h2>${p?'Edit produk':'Produk baru'}</h2><button class="icon-btn" data-act="close" aria-label="Tutup">${ic('x',18)}</button></div>
    <label class="lbl">Nama produk</label>
    <input id="f-pname" value="${esc(p?p.name:'')}" placeholder="Contoh: Ukuran Jumbo">
    <label class="lbl">Harga jual</label>
    <input id="f-pprice" type="number" inputmode="numeric" min="1" value="${p?p.price:''}" placeholder="1000">
    <label class="lbl">Satuan</label>
    <input id="f-punit" value="${esc(p?p.unit||'':'')}" placeholder="pcs / pack / gelas">
    <p class="note">Perubahan harga hanya berlaku untuk catatan baru. Catatan lama tetap memakai harga saat dicatat.</p>
    <button class="btn primary block" data-act="prod-save" data-id="${id||''}">Simpan</button>`);
}
function saveProd(id){
  const name=$('f-pname').value.trim(), price=Number($('f-pprice').value), unit=$('f-punit').value.trim()||'pcs';
  if(!name) return toast('Isi nama produk','warn');
  if(!(price>0)) return toast('Harga harus lebih dari 0','warn');
  if(id){const p=db.products.find(x=>x.id===id); if(p){p.name=name;p.price=price;p.unit=unit}}
  else db.products.push({id:uid(),name,price,unit,active:true});
  closeSheet(); commit(); toast('Produk tersimpan','ok');
}
function delProd(id){
  if(db.transactions.some(t=>t.productId===id)) return toast('Produk ini sudah punya catatan. Nonaktifkan saja.','warn');
  if(!confirm('Hapus produk ini?')) return;
  db.products=db.products.filter(p=>p.id!==id);
  db.purchases.forEach(b=>{if(b.productId===id)b.productId=null});
  commit(); toast('Produk dihapus');
}
function saveSettings(){
  const raw=$('s-pct').value.trim(), pct=Number(raw);
  if(raw===''||!(pct>=0&&pct<=100)) return toast('Bagian toko harus antara 0 dan 100','warn');
  db.settings.storePercent=pct;
  commit(); toast('Pengaturan disimpan','ok');
}


/* ===== Backup ===== */
function backup(){
  const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='backup-usahaku-'+today()+'.json';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function restore(e){
  const f=e.target.files[0]; e.target.value='';
  if(!f) return;
  const r=new FileReader();
  r.onload=()=>{
    let next;
    try{
      const x=JSON.parse(r.result);
      if(!x||!Array.isArray(x.transactions)||!Array.isArray(x.purchases)) throw new Error('bad');
      next=isV3(x)?normalize(x):migrate(x);
    }catch(err){return toast('File backup tidak valid','err')}
    if(!confirm('Data sekarang akan diganti dengan backup ini. Lanjut?')) return;
    db=next; commit(); toast('Data berhasil dipulihkan','ok');
  };
  r.readAsText(f);
}

/* ===== Aksi & event ===== */
const ACT={
  close:()=>closeSheet(),
  plus:()=>plusSheet(),
  'tx-new':d=>txForm(null,d.type),
  'tx-edit':d=>txForm(d.id),
  'tx-save':d=>saveTx(d.id||null),
  'tx-del':d=>{if(!confirm('Hapus catatan ini?'))return;db.transactions=db.transactions.filter(x=>x.id!==d.id);commit();toast('Catatan dihapus')},
  'pur-new':()=>purForm(null),
  'pur-edit':d=>purForm(d.id),
  'pur-save':d=>savePur(d.id||null),
  'pur-del':d=>{if(!confirm('Hapus pembelian ini?'))return;db.purchases=db.purchases.filter(x=>x.id!==d.id);commit();toast('Pembelian dihapus')},
  'prod-new':()=>prodForm(null),
  'prod-edit':d=>prodForm(d.id),
  'prod-save':d=>saveProd(d.id||null),
  'prod-toggle':d=>{const p=db.products.find(x=>x.id===d.id);if(p){p.active=!p.active;commit()}},
  'prod-del':d=>delProd(d.id),
  'pay-mark':d=>markPaid(d.w),
  'pay-undo':d=>undoPaid(d.w),
  'open-week':d=>{selW=d.w;go('home')},
  'save-settings':()=>saveSettings(),
  photo:()=>$('photoFile').click(),
  'photo-del':()=>{db.profile.photo='';commit();toast('Foto dihapus')},
  rename:()=>renameForm(),
  'rename-save':()=>saveRename(),
  'item-add':()=>addItem(),
  'item-del':d=>delItem(d.n),
  'report-csv':()=>downloadCSV(),
  'report-view':()=>reportView(),
  print:()=>window.print(),
  'rem-save':()=>saveReminder(),
  'rem-done':()=>markRemDone(),
  'rem-notify':()=>requestNotif(),
  'pwa-install':()=>installPwa(),
  'menu-toggle':()=>$('dd').classList.toggle('show'),
  'open-pel':()=>{closeMenu();pelView=null;go('pelanggan')},
  'open-wa':()=>{closeMenu();go('wa')},
  'open-banding':()=>{closeMenu();go('banding')},
  'open-tentang-app':()=>{closeMenu();openTentangApp()},
  'open-tentang-dev':()=>{closeMenu();openTentangDev()},
  'cust-new':()=>custForm(null),
  'cust-open':d=>{pelView=d.id;renderPelanggan();window.scrollTo({top:0})},
  'cust-back':()=>{pelView=null;renderPelanggan();window.scrollTo({top:0})},
  'cust-edit':d=>custForm(d.id),
  'cust-save':d=>saveCust(d.id||null),
  'cust-del':d=>delCust(d.id),
  'rcp-new':d=>rcpForm(d.id),
  'rcp-save':d=>saveRcp(d.id),
  'rcp-del':d=>delRcp(d.id),
  'wa-make':()=>{const f=$('wa-from').value,t=$('wa-to').value;if(!f||!t||f>t)return toast('Rentang tanggal tidak valid','warn');waFrom=f;waTo=t;renderWA()},
  'wa-send':()=>window.open('https://wa.me/?text='+encodeURIComponent($('wa-text').value),'_blank'),
  'wa-copy':()=>{navigator.clipboard.writeText($('wa-text').value).then(()=>toast('Teks disalin','ok')).catch(()=>toast('Gagal menyalin, salin manual','warn'))},
  'cmp-make':()=>{cmpA=$('cmp-a').value;cmpB=$('cmp-b').value;renderBanding()},
  'theme-toggle':()=>toggleTheme(),
  accent:d=>setAccent(d.k),
  backup:()=>backup(),
  restore:()=>$('restoreFile').click()
};

document.addEventListener('click',e=>{
  const el=e.target.closest('[data-go],[data-pw],[data-mo],[data-kv],[data-seg],[data-act]');
  if(!el||el.disabled) return;
  const d=el.dataset;
  if(d.go) return go(d.go);
  if(d.pw!==undefined) return shiftWeek(Number(d.pw));
  if(d.mo!==undefined) return shiftMonth(Number(d.mo));
  if(d.kv) {kv=d.kv;return renderAll()}
  if(d.seg) return seg(el);
  if(d.act&&ACT[d.act]) ACT[d.act](d,el);
});

/* ===== Laporan ===== */
const STATUS_TXT={paid:'Diterima',run:'Berjalan',due:'Belum diterima'};
function periodsIn(from,to){const out=[];let w=weekStart(from);while(w<=to){out.push(w);w=addDays(w,7)}return out}
function prodName(id){const p=db.products.find(q=>q.id===id);return p?p.name:'Produk dihapus'}
function buildReport(from,to){
  const periods=periodsIn(from,to).map(w=>({w,v:view(db,w),st:payState(db,w)}));
  const tx=db.transactions.filter(x=>x.date>=from&&x.date<=to).sort((a,b)=>a.date.localeCompare(b.date)||(a.createdAt||0)-(b.createdAt||0));
  const pur=db.purchases.filter(x=>x.date>=from&&x.date<=to).sort((a,b)=>a.date.localeCompare(b.date));
  return {periods,tx,pur};
}
function reportHTML(from,to){
  const R=buildReport(from,to);
  const T=k=>R.periods.reduce((a,i)=>a+i.v[k],0);
  const rowsP=R.periods.map(i=>`<tr><td>${fmtS(i.w)} – ${fmtS(weekEnd(i.w))}</td><td>${i.v.deliver}</td><td>${i.v.ret}</td><td>${i.v.net}</td><td>${rp(i.v.gross)}</td><td>${num(i.v.pct)}%</td><td>${rp(i.v.store)}</td><td>${rp(i.v.income)}</td><td>${rp(i.v.capital)}</td><td>${rp(i.v.surplus)}</td><td>${STATUS_TXT[i.st]}</td></tr>`).join('');
  const rowsT=R.tx.map(x=>`<tr><td>${fmtD(x.date)}</td><td>${esc(prodName(x.productId))}</td><td>${x.type==='return'?'Kembali':'Antar'}</td><td>${x.qty}</td><td>${rp(x.price)}</td><td>${rp((x.type==='return'?-1:1)*x.qty*x.price)}</td><td>${esc(x.note)}</td></tr>`).join('');
  const rowsB=R.pur.map(b=>`<tr><td>${fmtD(b.date)}</td><td>${esc(b.item)}</td><td>${b.productId?esc(prodName(b.productId)):'Modal umum'}</td><td>${num(b.qty)} ${esc(b.unit)}</td><td>${rp(b.unitPrice)}</td><td>${rp(b.total)}</td></tr>`).join('');
  return `<div class="report" id="printArea">
    <h2>Laporan ${esc(db.profile.name)}</h2>
    <p>Rentang ${fmtD(from)} – ${fmtD(to)}. Ringkasan periode dihitung Jumat–Kamis penuh.</p>
    <h3>Ringkasan periode</h3>
    <div class="tw"><table>
      <thead><tr><th>Periode</th><th>Antar</th><th>Kembali</th><th>Bersih</th><th>Omzet</th><th>%</th><th>Toko</th><th>Hasil</th><th>Modal</th><th>Surplus</th><th>Status</th></tr></thead>
      <tbody>${rowsP||'<tr><td colspan="11">Tidak ada periode</td></tr>'}</tbody>
      <tfoot><tr><th>Total</th><th>${T('deliver')}</th><th>${T('ret')}</th><th>${T('net')}</th><th>${rp(T('gross'))}</th><th></th><th>${rp(T('store'))}</th><th>${rp(T('income'))}</th><th>${rp(T('capital'))}</th><th>${rp(T('surplus'))}</th><th></th></tr></tfoot>
    </table></div>
    <h3>Rincian penjualan</h3>
    <div class="tw"><table><thead><tr><th>Tanggal</th><th>Produk</th><th>Jenis</th><th>Jumlah</th><th>Harga</th><th>Total</th><th>Catatan</th></tr></thead>
      <tbody>${rowsT||'<tr><td colspan="7">Tidak ada penjualan</td></tr>'}</tbody></table></div>
    <h3>Rincian modal</h3>
    <div class="tw"><table><thead><tr><th>Tanggal</th><th>Bahan</th><th>Untuk</th><th>Jumlah</th><th>Harga satuan</th><th>Total</th></tr></thead>
      <tbody>${rowsB||'<tr><td colspan="6">Tidak ada pembelian</td></tr>'}</tbody></table></div>
  </div>`;
}
function reportCSV(from,to){
  const R=buildReport(from,to);
  const q=v=>{const s=String(v??'');return /[;"\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};
  const row=a=>a.map(q).join(';');
  const L=[];
  L.push(row(['LAPORAN',db.profile.name]), row(['Rentang',from,to]), '');
  L.push(row(['RINGKASAN PERIODE']));
  L.push(row(['Mulai (Jumat)','Antar','Kembali','Bersih','Omzet kotor','Bagian toko %','Bagian toko','Hasil','Modal','Surplus','Status']));
  R.periods.forEach(i=>L.push(row([i.w,i.v.deliver,i.v.ret,i.v.net,Math.round(i.v.gross),i.v.pct,Math.round(i.v.store),Math.round(i.v.income),Math.round(i.v.capital),Math.round(i.v.surplus),STATUS_TXT[i.st]])));
  L.push('');
  L.push(row(['TRANSAKSI PENJUALAN']));
  L.push(row(['Tanggal','Produk','Jenis','Jumlah','Harga satuan','Total','Catatan']));
  R.tx.forEach(x=>L.push(row([x.date,prodName(x.productId),x.type==='return'?'Kembali':'Antar',x.qty,x.price,(x.type==='return'?-1:1)*x.qty*x.price,x.note])));
  L.push('');
  L.push(row(['PEMBELIAN MODAL']));
  L.push(row(['Tanggal','Bahan','Untuk','Jumlah','Satuan','Harga satuan','Total']));
  R.pur.forEach(b=>L.push(row([b.date,b.item,b.productId?prodName(b.productId):'Modal umum',b.qty,b.unit,b.unitPrice,b.total])));
  return '﻿'+L.join('\r\n');
}
function rangeVals(){
  const from=$('lp-from').value, to=$('lp-to').value;
  if(!from||!to){toast('Isi tanggal dari dan sampai','warn');return null}
  if(from>to){toast('Tanggal "dari" harus sebelum "sampai"','warn');return null}
  return {from,to};
}
function downloadCSV(){
  const r=rangeVals(); if(!r) return;
  const blob=new Blob([reportCSV(r.from,r.to)],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob); a.download=`laporan-${r.from}-${r.to}.csv`; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function reportView(){
  const r=rangeVals(); if(!r) return;
  openSheet(`
    <div class="sh-head no-print"><h2>Laporan</h2><button class="icon-btn" data-act="close" aria-label="Tutup">${ic('x',18)}</button></div>
    <div class="no-print" style="margin-top:12px"><button class="btn primary block" data-act="print">${ic('doc',18)} Cetak / simpan PDF</button></div>
    ${reportHTML(r.from,r.to)}`);
}

/* ===== Pengingat ===== */
const WEEKDAYS=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
function remDefault(){return{on:true,mode:'weekly',weekday:5,monthDay:1,everyDays:14,anchor:today(),time:'08:00',message:'Waktunya rekap penjualan dan tandai pembayaran periode.',lastDone:'',notifiedFor:''}}
function lastDue(r,now){
  const t=ds(now);
  if(r.mode==='weekly'){for(let i=0;i<7;i++){const d=addDays(t,-i);if(dt(d).getDay()===Number(r.weekday))return d}return null}
  if(r.mode==='monthly'){
    const cand=(y,m)=>ds(new Date(y,m,Math.min(Number(r.monthDay)||1,new Date(y,m+1,0).getDate())));
    const y=now.getFullYear(),m=now.getMonth();
    const c=cand(y,m); if(c<=t) return c;
    return m===0?cand(y-1,11):cand(y,m-1);
  }
  if(r.mode==='custom'){
    const n=Math.max(1,Number(r.everyDays)||1);
    const diff=Math.round((dt(t)-dt(r.anchor))/864e5);
    if(diff<0) return null;
    return addDays(r.anchor,Math.floor(diff/n)*n);
  }
  return null;
}
function reminderDue(now=new Date()){
  const r=db.reminder; if(!r||!r.on) return null;
  const d=lastDue(r,now); if(!d||d<=(r.lastDone||'')) return null;
  const hm=pad(now.getHours())+':'+pad(now.getMinutes());
  if(d===ds(now)&&hm<r.time) return null;
  return d;
}
function reminderBanner(){
  if(!reminderDue()) return '';
  return `<div class="remind"><span class="rm-ic">${ic('target',18)}</span><div class="grow"><b>Pengingat</b><div class="fine">${esc(db.reminder.message||'Waktunya rekap penjualan.')}</div></div><button class="btn primary sm" data-act="rem-done">Sudah</button></div>`;
}
function markRemDone(){
  const d=reminderDue(); if(!d) return;
  db.reminder.lastDone=d; commit(); toast('Pengingat ditandai selesai','ok');
}
function checkReminder(){
  const d=reminderDue();
  if(!d||db.reminder.notifiedFor===d) return;
  db.reminder.notifiedFor=d;
  try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){}
  if(!('Notification' in window)||Notification.permission!=='granted'){renderAll();return}
  const opts={body:db.reminder.message||'Waktunya rekap penjualan.',icon:'icon-192.png',tag:'usaha-fatur-reminder'};
  if(navigator.serviceWorker&&navigator.serviceWorker.controller){
    navigator.serviceWorker.ready.then(reg=>reg.showNotification('UsahaKu',opts)).catch(()=>{});
  } else {
    try{new Notification('UsahaKu',opts)}catch(e){}
  }
  renderAll();
}
function saveReminder(){
  const r=db.reminder;
  r.on=$('rm-on').value==='1';
  r.mode=$('rm-mode').value;
  r.weekday=Number($('rm-wday').value);
  r.monthDay=Math.min(28,Math.max(1,Number($('rm-mday').value)||1));
  r.everyDays=Math.max(1,Number($('rm-every').value)||1);
  r.anchor=$('rm-anchor').value||today();
  r.time=$('rm-time').value||'08:00';
  r.message=$('rm-msg').value.trim();
  r.notifiedFor='';
  commit(); toast('Pengingat disimpan','ok');
}
function requestNotif(){
  if(!('Notification' in window)) return toast('Browser ini tidak mendukung notifikasi','warn');
  Notification.requestPermission().then(()=>renderAll());
}
function remCard(){
  const r=db.reminder;
  const perm=('Notification' in window)?Notification.permission:'unsupported';
  const permTxt={granted:'diizinkan',denied:'diblokir di pengaturan browser',unsupported:'tidak didukung',default:'belum diizinkan'}[perm];
  return `<div class="card">
    <div class="card-h"><h3>Pengingat</h3><span class="chip ${r.on?'ok':'wait'}">${r.on?'Aktif':'Nonaktif'}</span></div>
    <div class="two">
      <div><label class="lbl">Status</label><select id="rm-on"><option value="1" ${r.on?'selected':''}>Aktif</option><option value="0" ${r.on?'':'selected'}>Nonaktif</option></select></div>
      <div><label class="lbl">Jenis</label><select id="rm-mode">
        <option value="weekly" ${r.mode==='weekly'?'selected':''}>Setiap minggu</option>
        <option value="monthly" ${r.mode==='monthly'?'selected':''}>Setiap bulan</option>
        <option value="custom" ${r.mode==='custom'?'selected':''}>Setiap beberapa hari</option></select></div>
    </div>
    <div class="two">
      <div><label class="lbl">Hari (mingguan)</label><select id="rm-wday">${WEEKDAYS.map((d,i)=>`<option value="${i}" ${Number(r.weekday)===i?'selected':''}>${d}</option>`).join('')}</select></div>
      <div><label class="lbl">Tanggal (bulanan, 1–28)</label><input type="number" id="rm-mday" min="1" max="28" value="${r.monthDay}"></div>
    </div>
    <div class="two">
      <div><label class="lbl">Setiap (hari)</label><input type="number" id="rm-every" min="1" value="${r.everyDays}"></div>
      <div><label class="lbl">Mulai dari</label><input type="date" id="rm-anchor" value="${r.anchor}"></div>
    </div>
    <div class="two">
      <div><label class="lbl">Jam</label><input type="time" id="rm-time" value="${r.time}"></div>
      <div><label class="lbl">Pesan</label><input id="rm-msg" value="${esc(r.message||'')}" placeholder="Contoh: Rekap dan tagih pembayaran" maxlength="120"></div>
    </div>
    <p class="note">Pengingat selalu muncul di Beranda saat jadwalnya tiba. Notifikasi di HP hanya bisa muncul saat aplikasi terbuka atau masih berjalan di latar belakang, karena aplikasi ini tidak punya server.</p>
    <div class="inline" style="align-items:center">
      ${perm==='default'?`<button class="btn ghost sm" data-act="rem-notify">Izinkan notifikasi</button>`:`<span class="fine">Notifikasi: ${permTxt}</span>`}
      <button class="btn primary sm" data-act="rem-save" style="margin-left:auto">Simpan pengingat</button>
    </div>
  </div>`;
}

/* ===== Pasang sebagai aplikasi (PWA) ===== */
let deferredPrompt=null;
function isStandalone(){return window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}
function installPwa(){
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(()=>{deferredPrompt=null;renderAll()});
}
function pwaCard(){
  if(isStandalone()) return `<div class="card"><div class="card-h"><h3>Aplikasi</h3><span class="chip ok">Terpasang</span></div><p class="fine">UsahaKu sudah dibuka dari layar utama.</p></div>`;
  const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  let body;
  if(deferredPrompt) body=`<button class="btn primary block" data-act="pwa-install">${ic('download',18)} Pasang aplikasi</button>`;
  else if(ios) body=`<p class="note">Di iPhone: buka di Safari, ketuk ikon Bagikan, lalu pilih "Tambah ke Layar Utama".</p>`;
  else body=`<p class="note">Di Chrome Android: buka menu titik tiga di kanan atas, lalu pilih "Tambahkan ke layar utama" atau "Pasang aplikasi". Tombol Pasang akan muncul di sini kalau browser mengizinkan.</p>`;
  return `<div class="card"><div class="card-h"><h3>Pasang sebagai aplikasi</h3></div><p class="fine">Pasang UsahaKu di layar utama HP supaya bisa dibuka seperti aplikasi biasa.</p>${body}</div>`;
}

/* ===== Pelanggan & piutang ===== */
let pelView=null;
let cmpA=addDays(currentWeek(),-7), cmpB=currentWeek();
let waFrom=today().slice(0,8)+'01', waTo=today();
const custName=id=>{const c=db.customers.find(x=>x.id===id);return c?c.name:'Pelanggan dihapus'};
const custSales=id=>db.transactions.filter(t=>t.customerId===id).reduce((a,t)=>a+(t.type==='return'?-1:1)*t.qty*t.price,0);
const custPaid=id=>db.receipts.filter(r=>r.customerId===id).reduce((a,r)=>a+Number(r.amount),0);
const custBal=id=>custSales(id)-custPaid(id);
function waLink(phone,text){let n=String(phone||'').replace(/\D/g,'');if(n.startsWith('0'))n='62'+n.slice(1);return 'https://wa.me/'+n+'?text='+encodeURIComponent(text)}

function renderPelanggan(){
  if(pelView){const c=db.customers.find(x=>x.id===pelView);if(c)return renderCustDetail(c);pelView=null}
  const rows=db.customers.map(c=>({c,bal:custBal(c.id)})).sort((a,b)=>b.bal-a.bal);
  const totalPiu=rows.filter(r=>r.bal>0).reduce((a,r)=>a+r.bal,0);
  $('p-pelanggan').innerHTML=`
    <button class="btn ghost sm back" data-go="home">${ic('chevL',16)} Kembali</button>
    <div class="h1">Pelanggan & piutang</div>
    <p class="sub">Catat siapa yang membeli dan siapa yang belum membayar</p>
    <div class="card hero">
      <div class="eyebrow">Total piutang</div>
      <div class="big">${rp(totalPiu)}</div>
      <div class="fine">${rows.filter(r=>r.bal>0).length} pelanggan belum lunas • ${db.customers.length} pelanggan</div>
    </div>
    <button class="btn primary block" data-act="cust-new">${ic('plus',18)} Tambah pelanggan</button>
    <div class="card mt"><div class="list">${rows.length?rows.map(({c,bal})=>`
      <button class="row cust-row" data-act="cust-open" data-id="${c.id}">
        <div class="bubble">${ic('user',18)}</div>
        <div class="grow"><div class="t1">${esc(c.name)}</div><div class="t2">${esc(c.phone||'Tanpa nomor')}</div></div>
        <div class="amt ${bal>0?'warnT':bal<0?'pos':''}">${bal<0?'Lebih bayar ':''}${rp(Math.abs(bal))}</div>
      </button>`).join(''):empty('Belum ada pelanggan. Tekan Tambah pelanggan.')}</div></div>`;
}
function renderCustDetail(c){
  const bal=custBal(c.id);
  const sales=db.transactions.filter(t=>t.customerId===c.id).sort(byNew);
  const rc=db.receipts.filter(r=>r.customerId===c.id).sort((a,b)=>b.date.localeCompare(a.date));
  const msg=`Halo ${c.name}, tagihan ${rp(bal)} dari ${db.profile.name}. Mohon pembayarannya. Terima kasih.`;
  const wa=c.phone?`<a class="btn primary sm" href="${waLink(c.phone,msg)}" target="_blank" rel="noopener">${ic('chat',16)} Tagih WhatsApp</a>`:'';
  $('p-pelanggan').innerHTML=`
    <button class="btn ghost sm back" data-act="cust-back">${ic('chevL',16)} Semua pelanggan</button>
    <div class="h1">${esc(c.name)}</div>
    <p class="sub">${esc(c.phone||'Tanpa nomor')}${c.note?' • '+esc(c.note):''}</p>
    <div class="card hero">
      <div class="eyebrow">${bal<0?'Lebih bayar':'Piutang'}</div>
      <div class="big">${rp(Math.abs(bal))}</div>
      <div class="g2 mt">
        <div class="stat"><small>Total belanja</small><b>${rp(custSales(c.id))}</b></div>
        <div class="stat"><small>Sudah dibayar</small><b>${rp(custPaid(c.id))}</b></div>
      </div>
    </div>
    <div class="inline wrapx">
      <button class="btn primary sm" data-act="rcp-new" data-id="${c.id}">${ic('plus',16)} Catat pembayaran</button>
      ${wa}
      <button class="btn ghost sm" data-act="cust-edit" data-id="${c.id}">${ic('edit',16)} Ubah</button>
      <button class="btn ghost sm" data-act="cust-del" data-id="${c.id}">${ic('trash',16)} Hapus</button>
    </div>
    <div class="card mt"><div class="card-h"><h3>Pembayaran</h3></div><div class="list">${rc.length?rc.map(r=>`
      <div class="row"><div class="bubble">${ic('check',18)}</div>
        <div class="grow"><div class="t1">${fmtD(r.date)}</div><div class="t2">${esc(r.note||'Pembayaran')}</div></div>
        <div class="amt pos">${rp(r.amount)}</div>
        <button class="icon-btn danger" data-act="rcp-del" data-id="${r.id}" aria-label="Hapus">${ic('trash',16)}</button></div>`).join(''):empty('Belum ada pembayaran')}</div></div>
    <div class="card"><div class="card-h"><h3>Belanja</h3></div><div class="list">${sales.length?sales.map(x=>txRow(x,true)).join(''):empty('Belum ada belanja. Catat penjualan dan pilih pelanggan ini.')}</div></div>`;
}
function custForm(id){
  const c=id?db.customers.find(x=>x.id===id):null;
  openSheet(`
    <div class="sh-head"><h2>${c?'Ubah pelanggan':'Pelanggan baru'}</h2><button class="icon-btn" data-act="close" aria-label="Tutup">${ic('x',18)}</button></div>
    <label class="lbl">Nama</label>
    <input id="f-cname" value="${esc(c?c.name:'')}" maxlength="40" placeholder="Nama toko atau orang">
    <label class="lbl">Nomor WhatsApp (opsional)</label>
    <input id="f-cphone" type="tel" inputmode="tel" value="${esc(c?c.phone:'')}" placeholder="Contoh: 081234567890">
    <label class="lbl">Catatan (opsional)</label>
    <input id="f-cnote" value="${esc(c?c.note||'':'')}" maxlength="80" placeholder="Contoh: warung dekat pasar">
    <button class="btn primary block" data-act="cust-save" data-id="${id||''}">Simpan</button>`);
}
function saveCust(id){
  const name=$('f-cname').value.trim(), phone=$('f-cphone').value.trim(), note=$('f-cnote').value.trim();
  if(!name) return toast('Isi nama pelanggan','warn');
  if(id){const c=db.customers.find(x=>x.id===id);if(c)Object.assign(c,{name,phone,note})}
  else db.customers.push({id:uid(),name,phone,note,createdAt:Date.now()});
  closeSheet(); commit(); toast('Pelanggan tersimpan','ok');
}
function delCust(id){
  if(db.transactions.some(t=>t.customerId===id)||db.receipts.some(r=>r.customerId===id))
    return toast('Pelanggan punya riwayat dan tidak bisa dihapus','warn');
  if(!confirm('Hapus pelanggan ini?')) return;
  db.customers=db.customers.filter(c=>c.id!==id); pelView=null;
  commit(); toast('Pelanggan dihapus');
}
function rcpForm(cid){
  openSheet(`
    <div class="sh-head"><h2>Catat pembayaran</h2><button class="icon-btn" data-act="close" aria-label="Tutup">${ic('x',18)}</button></div>
    <div class="two">
      <div><label class="lbl">Tanggal</label><input type="date" id="f-rdate" value="${today()}"></div>
      <div><label class="lbl">Jumlah</label><input type="number" id="f-ramount" inputmode="numeric" min="1" placeholder="0"></div>
    </div>
    <label class="lbl">Catatan (opsional)</label>
    <input id="f-rnote" maxlength="80" placeholder="Contoh: transfer BCA">
    <button class="btn primary block" data-act="rcp-save" data-id="${cid}">Simpan pembayaran</button>`);
}
function saveRcp(cid){
  const date=$('f-rdate').value, amount=Number($('f-ramount').value), note=$('f-rnote').value.trim();
  if(!date) return toast('Isi tanggal','warn');
  if(!(amount>0)) return toast('Jumlah harus lebih dari 0','warn');
  db.receipts.push({id:uid(),customerId:cid,date,amount,note,createdAt:Date.now()});
  closeSheet(); commit(); toast('Pembayaran dicatat','ok');
}
function delRcp(id){
  if(!confirm('Hapus catatan pembayaran ini?')) return;
  db.receipts=db.receipts.filter(r=>r.id!==id); commit(); toast('Pembayaran dihapus');
}

/* ===== Kirim laporan WhatsApp ===== */
function waSummary(from,to){
  const R=buildReport(from,to);
  const T=k=>R.periods.reduce((a,i)=>a+i.v[k],0);
  const L=[`*Laporan ${db.profile.name}*`,`Rentang: ${fmtD(from)} – ${fmtD(to)}`,'',
    `Antar: ${T('deliver')} • Kembali: ${T('ret')} • Bersih: ${T('net')}`,
    `Omzet kotor: ${rp(T('gross'))}`,`Bagian toko: ${rp(T('store'))}`,
    `Hasil diterima: ${rp(T('income'))}`,`Modal: ${rp(T('capital'))}`,`Surplus: ${rp(T('surplus'))}`];
  if(R.periods.length){
    L.push('','*Per periode*');
    R.periods.forEach(i=>L.push(`• ${fmtS(i.w)} – ${fmtS(weekEnd(i.w))}: hasil ${rp(i.v.income)}, surplus ${rp(i.v.surplus)} (${STATUS_TXT[i.st]})`));
  }
  const piu=db.customers.map(c=>({n:c.name,b:custBal(c.id)})).filter(x=>x.b>0);
  if(piu.length){
    L.push('','*Piutang pelanggan (saat ini)*');
    piu.forEach(x=>L.push(`• ${x.n}: ${rp(x.b)}`));
    L.push(`Total piutang: ${rp(piu.reduce((a,x)=>a+x.b,0))}`);
  }
  return L.join('\n');
}
function renderWA(){
  $('p-wa').innerHTML=`
    <button class="btn ghost sm back" data-go="home">${ic('chevL',16)} Kembali</button>
    <div class="h1">Kirim laporan WhatsApp</div>
    <p class="sub">Ringkasan dibuat otomatis. Anda bisa mengedit teksnya sebelum dikirim.</p>
    <div class="card">
      <div class="two">
        <div><label class="lbl">Dari</label><input type="date" id="wa-from" value="${waFrom}"></div>
        <div><label class="lbl">Sampai</label><input type="date" id="wa-to" value="${waTo}"></div>
      </div>
      <button class="btn ghost block" data-act="wa-make">Buat ringkasan</button>
    </div>
    <div class="card">
      <label class="lbl" style="margin-top:0">Isi pesan</label>
      <textarea id="wa-text" rows="14">${esc(waSummary(waFrom,waTo))}</textarea>
      <div class="g2 mt">
        <button class="btn ghost" data-act="wa-copy">${ic('copy',18)} Salin</button>
        <button class="btn primary" data-act="wa-send">${ic('chat',18)} Kirim</button>
      </div>
      <p class="note">Tombol Kirim membuka WhatsApp. Pilih kontak tujuan di sana.</p>
    </div>`;
}

/* ===== Perbandingan periode ===== */
function recentWeeks(n){const out=[];let w=currentWeek();for(let i=0;i<n;i++){out.push(w);w=addDays(w,-7)}return out}
function diffCell(a,b,fmt,neutral){
  const d=b-a, pct=a?Math.round(d/Math.abs(a)*100):null;
  const cls=(d===0||neutral)?'':(d>0?'pos':'neg');
  const arrow=d===0?'':ic(d>0?'up':'down',14);
  return `<div class="amt ${cls}">${arrow}${d>0?'+':d<0?'−':''}${fmt(Math.abs(d))}${(pct!==null&&d!==0)?`<small>${pct>0?'+':''}${pct}%</small>`:''}</div>`;
}
function renderBanding(){
  const weeks=recentWeeks(26);
  const opt=sel=>weeks.map(w=>`<option value="${w}" ${w===sel?'selected':''}>${fmtS(w)} – ${fmtS(weekEnd(w))}</option>`).join('');
  const A=view(db,cmpA), B=view(db,cmpB);
  const metric=(label,k,fmt,neutral)=>`<div class="cmp-r"><div class="t1">${label}</div><div class="amt">${fmt(A[k]||0)}</div><div class="amt">${fmt(B[k]||0)}</div>${diffCell(A[k]||0,B[k]||0,fmt,neutral)}</div>`;
  const pa=prodStats(db,cmpA), pb=prodStats(db,cmpB);
  const ids=[...new Set([...pa,...pb].map(s=>s.id))];
  const prodRows=ids.map(id=>{
    const a=pa.find(s=>s.id===id)||{gross:0}, b=pb.find(s=>s.id===id)||{gross:0};
    const p=db.products.find(x=>x.id===id);
    return `<div class="cmp-r"><div class="t1">${esc(p?p.name:'Produk dihapus')}</div><div class="amt">${rp(a.gross)}</div><div class="amt">${rp(b.gross)}</div>${diffCell(a.gross,b.gross,rp,false)}</div>`;
  }).join('');
  $('p-banding').innerHTML=`
    <button class="btn ghost sm back" data-go="home">${ic('chevL',16)} Kembali</button>
    <div class="h1">Perbandingan periode</div>
    <p class="sub">Bandingkan dua periode Jumat–Kamis untuk melihat naik atau turunnya</p>
    <div class="card">
      <div class="two">
        <div><label class="lbl">Periode A (lama)</label><select id="cmp-a">${opt(cmpA)}</select></div>
        <div><label class="lbl">Periode B (baru)</label><select id="cmp-b">${opt(cmpB)}</select></div>
      </div>
      <button class="btn primary block" data-act="cmp-make">Bandingkan</button>
    </div>
    <div class="card">
      <div class="cmp-r cmp-h"><div></div><div class="amt">A</div><div class="amt">B</div><div class="amt">Selisih</div></div>
      <div class="fine" style="margin:0 0 6px">A: ${fmtS(cmpA)} – ${fmtS(weekEnd(cmpA))} • B: ${fmtS(cmpB)} – ${fmtS(weekEnd(cmpB))}</div>
      ${metric('Antar','deliver',num)}
      ${metric('Kembali','ret',num)}
      ${metric('Bersih','net',num)}
      ${metric('Omzet kotor','gross',rp)}
      ${metric('Hasil','income',rp)}
      ${metric('Modal','capital',rp,true)}
      ${metric('Surplus','surplus',rp)}
    </div>
    ${trendCard()}
    <div class="card"><div class="card-h"><h3>Omzet per produk</h3></div>${prodRows||empty('Belum ada produk')}</div>`;
}

/* ===== Menu ===== */
const APP_VERSION='1.1.0';
function openTentangApp(){
  openSheet(`
    <div class="sh-head"><h2>Tentang aplikasi</h2><button class="icon-btn" data-act="close" aria-label="Tutup">${ic('x',18)}</button></div>
    <div class="about-card">
      <div class="about-logo">${ic('home',30)}</div>
      <h3>UsahaKu</h3>
      <small>Versi ${APP_VERSION}</small>
    </div>
    <p class="about-txt">UsahaKu membantu Anda mencatat penjualan, modal, dan pembayaran dengan rapi dalam satu aplikasi.</p>
    <ul class="about-list">
      <li>Catat penjualan dan keuangan harian</li>
      <li>Kelola modal dan pembelian</li>
      <li>Pantau pelanggan dan piutang</li>
      <li>Kirim laporan lewat WhatsApp</li>
      <li>Bandingkan dua periode</li>
    </ul>`);
}
function openTentangDev(){
  openSheet(`
    <div class="sh-head"><h2>Tentang developer</h2><button class="icon-btn" data-act="close" aria-label="Tutup">${ic('x',18)}</button></div>
    <div class="dev-card">
      <div class="dev-photo">${ic('user',44)}<img src="foto-developer.jpg" alt="Foto developer" onerror="this.remove()"></div>
      <h3>Miftah Faturahman</h3>
      <small>Developer UsahaKu</small>
    </div>
    <blockquote class="dev-quote">Aplikasi Ini Dibuat Untuk Para Pedangan Agar Bisa Mempermudah Dalam Menjalankan Usahanya Seperti saya :), Semoga Aplikasi Yang saya Buat ini berguna dan juga mohon maaf bila ada kesalahan atau bug yg didapatkan dalam aplikasi ini kalian bisa melaporkan di email saya faturahmanmiftah@gmail.com, terimakasih atas kerjasamanya :) .</blockquote>`);
}
function closeMenu(){$('dd').classList.remove('show')}

/* ===== Tema ===== */
function currentTheme(){return document.documentElement.dataset.theme==='light'?'light':'dark'}
function applyTheme(t){
  document.documentElement.dataset.theme=t;
  const m=document.querySelector('meta[name="theme-color"]');
  if(m) m.content=t==='light'?'#f1f3f1':'#0c0e0d';
  applyAccent();
}
function syncThemeMenu(){
  const t=currentTheme();
  const i=$('themeIc'), s=$('themeSub');
  if(i) i.innerHTML=ic(t==='dark'?'sun':'moon',18);
  if(s) s.textContent=t==='dark'?'Sekarang gelap. Ketuk untuk terang':'Sekarang terang. Ketuk untuk gelap';
}
function toggleTheme(){
  const t=currentTheme()==='dark'?'light':'dark';
  try{localStorage.setItem('usahaTheme',t)}catch(e){}
  applyTheme(t); syncThemeMenu(); closeMenu();
}

/* ===== Warna aksen ===== */
const ACCENTS={
  ultra:{name:'Ultra Violet',d:['95,75,139','71,56,104'],l:['76,60,111','57,45,83'],sw:'#5F4B8B',on:'#ffffff'},
  peri:{name:'Very Peri',d:['102,103,171','76,77,128'],l:['82,82,137','61,62,103'],sw:'#6667AB',on:'#ffffff'},
  iris:{name:'Blue Iris',d:['90,91,159','68,68,119'],l:['72,73,127','54,55,95'],sw:'#5A5B9F',on:'#ffffff'},
  serenity:{name:'Serenity',d:['146,168,209','110,126,157'],l:['117,134,167','88,101,125'],sw:'#92A8D1',on:'#141414'},
  orchid:{name:'Radiant Orchid',d:['181,101,167','136,76,125'],l:['145,81,134','109,61,100'],sw:'#B565A7',on:'#ffffff'},
  honey:{name:'Honeysuckle',d:['217,79,112','163,59,84'],l:['174,63,90','130,47,67'],sw:'#D94F70',on:'#ffffff'}
};
function loadAccent(){
  let k='ultra';
  try{k=localStorage.getItem('usahaAccent')||'ultra'}catch(e){}
  document.documentElement.dataset.accent=ACCENTS[k]?k:'ultra';
}
function currentAccent(){const k=document.documentElement.dataset.accent;return ACCENTS[k]?k:'ultra'}
function applyAccent(){
  const A=ACCENTS[currentAccent()], st=document.documentElement.style;
  const pair=currentTheme()==='light'?A.l:A.d;
  st.setProperty('--a',pair[0]);
  st.setProperty('--a2',pair[1]);
  st.setProperty('--on-accent',A.on);
}
function setAccent(k){
  if(!ACCENTS[k]) return;
  document.documentElement.dataset.accent=k;
  try{localStorage.setItem('usahaAccent',k)}catch(e){}
  applyAccent(); syncAccentMenu();
}
function syncAccentMenu(){
  const box=$('swatches'); if(!box) return;
  box.innerHTML=Object.entries(ACCENTS).map(([k,A])=>`<button class="sw ${k===currentAccent()?'on':''}" data-act="accent" data-k="${k}" aria-label="Warna ${A.name}"><span class="sw-dot" style="background:${A.sw}"></span><span>${A.name}</span></button>`).join('');
}

/* ===== Inisialisasi ===== */
/* ===== Tren omzet ===== */
function trendCard(){
  const weeks=recentWeeks(8).reverse();
  const rows=weeks.map(w=>{const v=view(db,w);return{w,gross:Number(v.gross)||0,sur:Number(v.surplus)||0}});
  if(!rows.some(r=>r.gross||r.sur)) return `<div class="card"><div class="card-h"><h3>Tren 8 periode terakhir</h3></div>${empty('Belum ada data untuk ditampilkan grafik')}</div>`;
  const W=320,H=190,pl=8,pr=8,pt=12,pb=28,ch=H-pt-pb;
  const all=rows.flatMap(r=>[r.gross,r.sur]);
  const hi=Math.max(0,...all), lo=Math.min(0,...all), span=(hi-lo)||1;
  const y=v=>pt+(hi-v)/span*ch;
  const slot=(W-pl-pr)/rows.length, bw=Math.min(14,slot*0.34), zero=y(0);
  const bar=(v,xc,cls)=>{const top=Math.min(y(v),zero), h=Math.max(1,Math.abs(y(v)-zero));return `<rect x="${(xc-bw/2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="3" class="${cls}"/>`};
  const bars=rows.map((r,i)=>{
    const cx=pl+slot*i+slot/2;
    return bar(r.gross,cx-bw/2-1,'tr-g')+bar(r.sur,cx+bw/2+1,r.sur<0?'tr-n':'tr-s')+`<text x="${cx.toFixed(1)}" y="${H-8}" text-anchor="middle" class="tr-t">${r.w.slice(8,10)}/${r.w.slice(5,7)}</text>`;
  }).join('');
  const last=rows[rows.length-1];
  return `<div class="card">
    <div class="card-h"><h3>Tren 8 periode terakhir</h3></div>
    <svg class="trend" viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik tren omzet dan surplus"><line x1="${pl}" x2="${W-pr}" y1="${zero.toFixed(1)}" y2="${zero.toFixed(1)}" class="tr-ax"/>${bars}</svg>
    <div class="legend"><span><i class="lg tr-g"></i>Omzet kotor</span><span><i class="lg tr-s"></i>Surplus</span><span><i class="lg tr-n"></i>Rugi</span></div>
    <p class="fine" style="margin:10px 0 0">Periode terakhir: omzet ${rp(last.gross)}, surplus ${rp(last.sur)}. Satu batang per periode Jumat–Kamis.</p>
  </div>`;
}

/* ===== Kunci aplikasi (PIN + sidik jari/wajah) ===== */
P.fp='<path d="M12 10.5a1.5 1.5 0 0 0-1.5 1.5v1.2c0 2.6.7 4.9 1.9 6.8"/><path d="M8.2 13.2A4 4 0 0 1 16 14v.8c0 1.6-.2 3.1-.6 4.5"/><path d="M5.5 14.5A6.5 6.5 0 0 1 12 6.5a6.5 6.5 0 0 1 6.5 6.5v.5"/><path d="M3.5 12.5A8.5 8.5 0 0 1 12 3.5a8.5 8.5 0 0 1 8.5 8.5"/>';
const LOCK_KEY='usahaLock';
const readLock=()=>{try{return JSON.parse(localStorage.getItem(LOCK_KEY)||'null')||{}}catch(e){return{}}};
const writeLock=x=>{try{x?localStorage.setItem(LOCK_KEY,JSON.stringify(x)):localStorage.removeItem(LOCK_KEY)}catch(e){}};
const lockOn=()=>!!readLock().hash;
const b64=buf=>{let s='';new Uint8Array(buf).forEach(b=>s+=String.fromCharCode(b));return btoa(s)};
const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const randBytes=n=>crypto.getRandomValues(new Uint8Array(n));
async function hashPin(pin,salt){
  const s=salt+':'+pin;
  if(window.crypto&&crypto.subtle){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return 's:'+b64(b)}
  let h=5381;for(const c of s)h=((h*33)^c.charCodeAt(0))>>>0;return 'd:'+h;
}
async function bioAvailable(){
  try{return !!(location.hostname&&window.PublicKeyCredential&&await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())}catch(e){return false}
}
async function bioRegister(){
  const cred=await navigator.credentials.create({publicKey:{challenge:randBytes(32),rp:{name:'UsahaKu',id:location.hostname},user:{id:randBytes(16),name:'usaha-fatur',displayName:'UsahaKu'},pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],authenticatorSelection:{authenticatorAttachment:'platform',userVerification:'required',residentKey:'discouraged'},timeout:60000}});
  return b64(cred.rawId);
}
async function bioVerify(id){
  const a=await navigator.credentials.get({publicKey:{challenge:randBytes(32),allowCredentials:[{type:'public-key',id:unb64(id)}],userVerification:'required',rpId:location.hostname,timeout:60000}});
  return !!a;
}

let lockBuf='', lockBusy=false, hiddenAt=0;
function dotsHTML(){const n=readLock().len||4;return Array.from({length:n},(_,i)=>`<span class="ldot ${i<lockBuf.length?'on':''}"></span>`).join('')}
function renderLock(){
  const bio=!!readLock().bio;
  const keys=[1,2,3,4,5,6,7,8,9].map(k=>`<button class="lk" data-lk="${k}">${k}</button>`).join('');
  $('lock').innerHTML=`
    <div class="lock-in">
      <div class="lock-av">${avatarHTML(true)}</div>
      <div class="lock-name">${esc(db.profile.name)}</div>
      <div class="fine">Masukkan PIN untuk membuka</div>
      <div class="ldots" id="ldots">${dotsHTML()}</div>
      <div class="fine lockmsg" id="lockMsg"></div>
      <div class="lkeys">
        ${keys}
        ${bio?`<button class="lk lk-ic" data-lk="bio" aria-label="Buka dengan sidik jari atau wajah">${ic('fp',24)}</button>`:'<span></span>'}
        <button class="lk" data-lk="0">0</button>
        <button class="lk lk-ic" data-lk="del" aria-label="Hapus angka">${ic('chevL',22)}</button>
      </div>
    </div>`;
}
function setLockMsg(t){const m=$('lockMsg');if(m)m.textContent=t}
function unlockApp(){lockBuf='';lockBusy=false;const el=$('lock');el.hidden=true;el.innerHTML=''}
function showLock(silent){
  lockBuf='';lockBusy=false;
  $('lock').hidden=false;renderLock();
  if(readLock().bio) lockBio(silent);
}
function lockPress(k){
  if(lockBusy) return;
  if(k==='bio') return lockBio(false);
  if(k==='del'){lockBuf=lockBuf.slice(0,-1);setLockMsg('');const el=$('ldots');if(el)el.innerHTML=dotsHTML();return}
  const n=readLock().len||4;
  if(lockBuf.length>=n) return;
  lockBuf+=k;
  const el=$('ldots');if(el)el.innerHTML=dotsHTML();
  if(lockBuf.length===n) lockCheck();
}
async function lockCheck(){
  lockBusy=true;
  const L=readLock(), h=await hashPin(lockBuf,L.salt);
  if(h===L.hash) return unlockApp();
  const box=$('ldots'); if(box){box.classList.remove('bad');void box.offsetWidth;box.classList.add('bad')}
  setLockMsg('PIN salah, coba lagi');
  setTimeout(()=>{lockBuf='';lockBusy=false;const el=$('ldots');if(el)el.innerHTML=dotsHTML()},450);
}
async function lockBio(silent){
  if(lockBusy) return; lockBusy=true;
  try{ if(await bioVerify(readLock().bio)) return unlockApp(); }catch(e){}
  lockBusy=false;
  if(!silent) setLockMsg('Verifikasi dibatalkan. Gunakan PIN.');
}

function lockCard(){
  const on=lockOn(), L=readLock();
  return `<div class="card">
    <div class="card-h"><h3>Kunci aplikasi</h3><span class="chip ${on?'ok':''}">${on?'Aktif':'Mati'}</span></div>
    <p class="fine">Minta PIN${L.bio?' atau sidik jari / wajah':''} setiap kali aplikasi dibuka atau kembali dari latar belakang lebih dari 30 detik.</p>
    <div class="g2 mt">
      <button class="btn ghost" data-act="lock-form">${ic('edit',18)} ${on?'Ubah PIN':'Atur PIN'}</button>
      ${on?`<button class="btn ghost" data-act="lock-off">${ic('x',18)} Matikan kunci</button>`:'<span></span>'}
    </div>
  </div>`;
}
async function lockForm(){
  const on=lockOn(), L=readLock(), bioOK=await bioAvailable();
  openSheet(`
    <div class="sh-head"><h2>${on?'Ubah PIN':'Atur PIN'}</h2><button class="icon-btn" data-act="close" aria-label="Tutup">${ic('x',18)}</button></div>
    <label class="lbl">PIN baru (4 sampai 6 angka)</label>
    <input id="f-pin" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password">
    <label class="lbl">Ulangi PIN</label>
    <input id="f-pin2" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password">
    ${bioOK?`<label class="chk-row"><input type="checkbox" id="f-bio" ${L.bio?'checked':''}><span><b>Pakai sidik jari / wajah juga</b><small>Muncul tombol sidik jari di layar kunci</small></span></label>`:`<p class="note">Sidik jari atau wajah tidak tersedia di perangkat ini. Kunci memakai PIN saja.</p>`}
    <button class="btn primary block" data-act="lock-save">Simpan</button>`);
}
async function lockSave(){
  const p=$('f-pin').value.trim(), p2=$('f-pin2').value.trim();
  if(!/^\d{4,6}$/.test(p)) return toast('PIN harus 4 sampai 6 angka','warn');
  if(p!==p2) return toast('Ulangi PIN belum sama','warn');
  const prev=readLock(), bioBox=$('f-bio');
  let bio=prev.bio||'';
  if(bioBox){
    if(bioBox.checked&&!bio){try{bio=await bioRegister()}catch(e){bio='';toast('Sidik jari tidak bisa diaktifkan, pakai PIN saja','warn')}}
    else if(!bioBox.checked) bio='';
  }
  const salt=b64(randBytes(16));
  writeLock({salt,hash:await hashPin(p,salt),len:p.length,bio});
  closeSheet(); renderAll(); toast('Kunci aplikasi disimpan','ok');
}
function lockOffForm(){
  openSheet(`
    <div class="sh-head"><h2>Matikan kunci</h2><button class="icon-btn" data-act="close" aria-label="Tutup">${ic('x',18)}</button></div>
    <label class="lbl">Masukkan PIN sekarang</label>
    <input id="f-cur" type="password" inputmode="numeric" maxlength="6" autocomplete="current-password">
    <button class="btn primary block" data-act="lock-off-ok">Matikan kunci</button>`);
}
async function lockOffOk(){
  const L=readLock(), v=$('f-cur').value.trim();
  if(await hashPin(v,L.salt)!==L.hash) return toast('PIN salah','err');
  writeLock(null); closeSheet(); renderAll(); toast('Kunci dimatikan','ok');
}
Object.assign(ACT,{
  'lock-form':()=>lockForm(),
  'lock-save':()=>lockSave(),
  'lock-off':()=>lockOffForm(),
  'lock-off-ok':()=>lockOffOk()
});
function initLock(){
  $('lock').addEventListener('click',e=>{const b=e.target.closest('[data-lk]');if(b)lockPress(b.dataset.lk)});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){hiddenAt=Date.now();return}
    if(lockOn()&&$('lock').hidden&&Date.now()-hiddenAt>30000) showLock(true);
  });
  if(lockOn()) showLock(true);
}

let db=load();
let selW=currentWeek(), kv='jual', page='home';
let mDate=new Date(new Date().getFullYear(),new Date().getMonth(),1);

document.querySelectorAll('[data-i]').forEach(el=>{el.innerHTML=ic(el.dataset.i,Number(el.dataset.s)||22)});
$('restoreFile').addEventListener('change',restore);
$('photoFile').addEventListener('change',onPhoto);
$('sheet').addEventListener('click',e=>{if(e.target.id==='sheet')closeSheet()});
$('sheet').addEventListener('input',live);
$('sheet').addEventListener('change',live);
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;if(page==='pribadi')renderAll()});
window.addEventListener('appinstalled',()=>{deferredPrompt=null;renderAll()});
document.addEventListener('click',e=>{if(e.target.isConnected&&!e.target.closest('.hdr-r'))closeMenu()});
checkReminder();
setInterval(checkReminder,60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkReminder()});
loadAccent();
applyTheme(currentTheme());
syncThemeMenu();
syncAccentMenu();
renderAll();
if('serviceWorker' in navigator){
  let reloaded=false;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!reloaded){reloaded=true;location.reload()}});
  window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
initLock();
(()=>{const sp=document.getElementById('splash');if(!sp)return;const t0=Date.now();let done=false;
const hide=()=>{if(done)return;done=true;setTimeout(()=>{sp.classList.add('out');setTimeout(()=>sp.remove(),600)},Math.max(0,1800-(Date.now()-t0)))};
if(document.readyState==='complete')hide();else window.addEventListener('load',hide);setTimeout(hide,4000);})();
