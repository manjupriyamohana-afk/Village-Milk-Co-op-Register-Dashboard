const members = [
  {id:"M001", name:"Ramesh K."},
  {id:"M002", name:"Suresh P."},
  {id:"M003", name:"Lakshmi N."},
  {id:"M004", name:"Raman S."},
  {id:"M005", name:"Ramanan S."},
  {id:"M006", name:"Kavitha R."},
  {id:"M007", name:"Murugan T."},
  {id:"M008", name:"Vijaya D."},
  {id:"M009", name:"Meena B."},
  {id:"M010", name:"Anitha M."},
  {id:"M011", name:"Velu M."},
  {id:"M012", name:"Geetha N."},
];
 
function randomDate(){
  const start = new Date(2024,0,1).getTime();
  const end = new Date(2024,11,31).getTime();
  const d = new Date(start + Math.random()*(end-start));
  return d.getDate() + " " + d.toLocaleString("en-US",{month:"short"}) + " " + d.getFullYear();
}
 
function buildData(){
  const rows = [];
 
  for(let i=1; i<=97; i++){
    const mem = members[Math.floor(Math.random()*members.length)];
    const session = Math.random() < 0.5 ? "Morning" : "Evening";
    const noFat = Math.random() < 0.12;
    const noQty = Math.random() < 0.03;
 
    const qty = noQty ? "" : +(1 + Math.random()*8).toFixed(2);
    const fat = noFat ? "" : +(3 + Math.random()*3.5).toFixed(1);
    const rate = fat === "" ? "" : +(28 + (fat-3.5)*3).toFixed(2);
    const amount = (qty === "" || rate === "") ? "" : +(qty*rate).toFixed(2);
 
    let delayChance = 0.12;
    if(noFat) delayChance += 0.35;
    if(noQty) delayChance += 0.35;
    if(typeof qty === "number" && qty < 3) delayChance += 0.15;
    const payment = Math.random() < delayChance ? "Delayed" : "On-Time";
 
    let riskScore = 0;
    if(noFat) riskScore += 2;
    if(noQty) riskScore += 2;
    if(typeof qty === "number" && qty < 3) riskScore += 1;
    if(session === "Evening") riskScore += 0.5;
    const risk = riskScore >= 2 ? "High Risk" : "Low Risk";
 
    rows.push({
      entryId: "E"+String(i).padStart(3,"0"),
      memberId: mem.id, memberName: mem.name,
      date: randomDate(), session, qty, fat, rate, amount, payment, risk
    });
  }
 
  // an entry with no matching member on file
  rows.push({entryId:"E098", memberId:"M099", memberName:"", date:randomDate(),
    session:"Morning", qty:2.4, fat:3.6, rate:30, amount:72, payment:"On-Time", risk:"Low Risk"});
 
  // two similarly-named members, extra entries close together on purpose
  rows.push({entryId:"E099", memberId:"M004", memberName:"Raman S.", date:randomDate(),
    session:"Evening", qty:4.1, fat:3.9, rate:31.2, amount:127.9, payment:"On-Time", risk:"Low Risk"});
  rows.push({entryId:"E100", memberId:"M005", memberName:"Ramanan S.", date:randomDate(),
    session:"Morning", qty:5.3, fat:4.1, rate:32, amount:169.6, payment:"Delayed", risk:"High Risk"});
 
  return rows;
}
 
const data = buildData();
 
// ---- top stat cards ----
 
function showStats(){
  const litres = data.reduce((sum,r) => sum + (typeof r.qty === "number" ? r.qty : 0), 0);
  const amount = data.reduce((sum,r) => sum + (typeof r.amount === "number" ? r.amount : 0), 0);
  const activeMembers = new Set(data.filter(r => r.memberName).map(r => r.memberId)).size;
  const highRisk = data.filter(r => r.risk === "High Risk").length;
 
  statLitres.textContent = litres.toFixed(2) + " L";
  statAmount.textContent = "₹" + amount.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
  statMembers.textContent = activeMembers;
  statRisk.textContent = highRisk;
}
 
// ---- records table, search + filters ----
 
function cell(v){
  return (v === "" || v == null) ? '<span class="na">N/A</span>' : v;
}
 
function drawTable(){
  const q = searchBox.value.trim().toLowerCase();
  const sess = sessionFilter.value, pay = paymentFilter.value, risk = riskFilter.value;
 
  const rows = data.filter(r => {
    const text = (r.memberName+" "+r.memberId+" "+r.entryId).toLowerCase();
    if(q && !text.includes(q)) return false;
    if(sess !== "all" && r.session !== sess) return false;
    if(pay !== "all" && r.payment !== pay) return false;
    if(risk !== "all" && r.risk !== risk) return false;
    return true;
  });
 
  countBar.textContent = `Showing ${rows.length} of ${data.length} records`;
 
  if(rows.length === 0){
    tableWrap.innerHTML = `<table><tbody><tr><td class="empty">No records match your search or filters. Try clearing them.</td></tr></tbody></table>`;
    return;
  }
 
  let html = `<table><thead><tr>
    <th>Date</th><th>Session</th><th>Member</th><th>Qty (L)</th><th>Fat %</th>
    <th>Rate</th><th>Amount</th><th>Payment</th><th>Risk</th>
  </tr></thead><tbody>`;
 
  for(const r of rows){
    const payPill = r.payment === "Delayed" ? `<span class="pill delayed">Delayed</span>` : `<span class="pill ontime">On-Time</span>`;
    const riskPill = r.risk === "High Risk" ? `<span class="pill high">High Risk</span>` : `<span class="pill low">Low Risk</span>`;
    const clickable = r.memberName ? "clickable" : "";
 
    html += `<tr class="${clickable}" data-id="${r.memberId}">
      <td>${r.date}</td>
      <td>${r.session}</td>
      <td><span class="name">${cell(r.memberName)}</span><span class="id">${r.memberId}</span></td>
      <td>${typeof r.qty === "number" ? r.qty : cell(r.qty)}</td>
      <td>${typeof r.fat === "number" ? r.fat+"%" : cell(r.fat)}</td>
      <td>${typeof r.rate === "number" ? "₹"+r.rate.toFixed(2) : cell(r.rate)}</td>
      <td>${typeof r.amount === "number" ? "₹"+r.amount.toFixed(2) : cell(r.amount)}</td>
      <td>${payPill}</td>
      <td>${riskPill}</td>
    </tr>`;
  }
 
  html += "</tbody></table>";
  tableWrap.innerHTML = html;
 
  tableWrap.querySelectorAll(".clickable").forEach(tr => {
    tr.addEventListener("click", () => openProfile(tr.dataset.id));
  });
}
 
// ---- member tiles ----
 
function drawMembers(){
  let html = "";
  for(const mem of members){
    const recs = data.filter(r => r.memberId === mem.id);
    const litres = recs.reduce((sum,r) => sum + (typeof r.qty === "number" ? r.qty : 0), 0);
    const delayed = recs.filter(r => r.payment === "Delayed").length;
 
    html += `<div class="tile" data-id="${mem.id}">
      <div class="tname">${mem.name}</div>
      <div class="tid">${mem.id}</div>
      <div class="trow"><span>${recs.length} entries</span><span><b>${litres.toFixed(1)} L</b></span><span>${delayed} delayed</span></div>
    </div>`;
  }
  membersGrid.innerHTML = html;
  membersGrid.querySelectorAll(".tile").forEach(t => t.addEventListener("click", () => openProfile(t.dataset.id)));
}
 
// ---- switching between dashboard and profile ----
 
function goDashboard(){
  profile.style.display = "none";
  dashboard.style.display = "";
  window.scrollTo(0,0);
}
 
function openProfile(id){
  const mem = members.find(m => m.id === id);
  if(!mem) return;
 
  const recs = data.filter(r => r.memberId === id).sort((a,b) => new Date(b.date) - new Date(a.date));
  const litres = recs.reduce((sum,r) => sum + (typeof r.qty === "number" ? r.qty : 0), 0);
  const amount = recs.reduce((sum,r) => sum + (typeof r.amount === "number" ? r.amount : 0), 0);
  const onTime = recs.filter(r => r.payment === "On-Time").length;
  const delayed = recs.filter(r => r.payment === "Delayed").length;
  const onTimePct = recs.length ? Math.round((onTime/recs.length)*100) : 0;
 
  pName.textContent = mem.name;
  pId.textContent = mem.id;
  pLitres.textContent = litres.toFixed(2) + " L";
  pAmount.textContent = "₹" + amount.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
  pOnTime.textContent = `${onTime} (${onTimePct}%)`;
  pDelayed.textContent = delayed;
 
  if(recs.length === 0){
    profileTableWrap.innerHTML = `<div class="loading">No collection history found for this member.</div>`;
  } else {
    let html = `<table><thead><tr>
      <th>Date</th><th>Session</th><th>Qty (L)</th><th>Fat %</th><th>Rate</th><th>Amount</th><th>Payment</th><th>Risk</th>
    </tr></thead><tbody>`;
 
    for(const r of recs){
      const payPill = r.payment === "Delayed" ? `<span class="pill delayed">Delayed</span>` : `<span class="pill ontime">On-Time</span>`;
      const riskPill = r.risk === "High Risk" ? `<span class="pill high">High Risk</span>` : `<span class="pill low">Low Risk</span>`;
      html += `<tr>
        <td>${r.date}</td>
        <td>${r.session}</td>
        <td>${typeof r.qty === "number" ? r.qty : cell(r.qty)}</td>
        <td>${typeof r.fat === "number" ? r.fat+"%" : cell(r.fat)}</td>
        <td>${typeof r.rate === "number" ? "₹"+r.rate.toFixed(2) : cell(r.rate)}</td>
        <td>${typeof r.amount === "number" ? "₹"+r.amount.toFixed(2) : cell(r.amount)}</td>
        <td>${payPill}</td>
        <td>${riskPill}</td>
      </tr>`;
    }
    html += "</tbody></table>";
    profileTableWrap.innerHTML = html;
  }
 
  dashboard.style.display = "none";
  profile.style.display = "";
  window.scrollTo(0,0);
}
 
// ---- element refs ----
 
const dashboard = document.getElementById("dashboard");
const profile = document.getElementById("profile");
const tableWrap = document.getElementById("tableWrap");
const countBar = document.getElementById("countBar");
const searchBox = document.getElementById("searchBox");
const sessionFilter = document.getElementById("sessionFilter");
const paymentFilter = document.getElementById("paymentFilter");
const riskFilter = document.getElementById("riskFilter");
const membersGrid = document.getElementById("membersGrid");
const profileTableWrap = document.getElementById("profileTableWrap");
const statLitres = document.getElementById("statLitres");
const statAmount = document.getElementById("statAmount");
const statMembers = document.getElementById("statMembers");
const statRisk = document.getElementById("statRisk");
const pName = document.getElementById("pName");
const pId = document.getElementById("pId");
const pLitres = document.getElementById("pLitres");
const pAmount = document.getElementById("pAmount");
const pOnTime = document.getElementById("pOnTime");
const pDelayed = document.getElementById("pDelayed");
 
document.getElementById("navHome").addEventListener("click", goDashboard);
document.getElementById("backBtn").addEventListener("click", goDashboard);
 
searchBox.addEventListener("input", drawTable);
sessionFilter.addEventListener("change", drawTable);
paymentFilter.addEventListener("change", drawTable);
riskFilter.addEventListener("change", drawTable);
 
window.addEventListener("DOMContentLoaded", () => {
  showStats();
  drawMembers();
  setTimeout(drawTable, 250); // tiny delay so it doesn't just flash empty
});
 
// ---- chat widget ----
 
const chatBtn = document.getElementById("chatBtn");
const chatBox = document.getElementById("chatBox");
const chatLog = document.getElementById("chatLog");
const chatInput = document.getElementById("chatInput");
 
chatBtn.addEventListener("click", () => chatBox.classList.toggle("open"));
document.getElementById("chatClose").addEventListener("click", () => chatBox.classList.remove("open"));
 
function clean(s){ return s.trim().toLowerCase().replace(/[^\w\s.]/g,""); }
 
function matchMember(text){
  const idHit = text.match(/\bm0?\d{1,3}\b/i);
  if(idHit){
    const found = members.find(m => m.id.toLowerCase() === idHit[0].toLowerCase()
      || m.id.toLowerCase() === ("m"+idHit[0].replace(/\D/g,"").padStart(3,"0")));
    if(found) return found;
  }
  const byLength = [...members].sort((a,b) => b.name.length - a.name.length);
  for(const m of byLength){
    if(text.includes(m.name.toLowerCase().replace(/[^\w\s]/g,""))) return m;
  }
  return null;
}
 
function addMsg(text, who){
  const div = document.createElement("div");
  div.className = "msg " + who;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}
 
function answer(raw){
  const text = clean(raw);
 
  if(/(total|how much).*(milk|litre|liter)/.test(text) || (/milk/.test(text) && matchMember(text))){
    const mem = matchMember(text);
    if(!mem) return "Please mention a member name or ID (e.g. M009) so I can give their milk total.";
    const recs = data.filter(r => r.memberId === mem.id);
    const total = recs.reduce((s,r) => s + (typeof r.qty === "number" ? r.qty : 0), 0);
    return `${mem.name} (${mem.id}) delivered ${total.toFixed(2)} L across ${recs.length} entries.`;
  }
 
  if(/(balance|owed|amount|payment due)/.test(text)){
    const mem = matchMember(text);
    if(!mem) return "Please mention a member name or ID (e.g. M009) for their balance.";
    const recs = data.filter(r => r.memberId === mem.id);
    const total = recs.reduce((s,r) => s + (typeof r.amount === "number" ? r.amount : 0), 0);
    return `${mem.name} (${mem.id}) is owed ₹${total.toFixed(2)}.`;
  }
 
  if(/(payment status|status of|paid|delayed)/.test(text)){
    const mem = matchMember(text);
    if(!mem){
      const d = data.filter(r => r.payment === "Delayed").length;
      return `${d} of ${data.length} records are marked Delayed. Mention a member for their specific status.`;
    }
    const recs = data.filter(r => r.memberId === mem.id);
    const delayed = recs.filter(r => r.payment === "Delayed").length;
    return `${mem.name} (${mem.id}): ${recs.length - delayed} On-Time, ${delayed} Delayed.`;
  }
 
  if(/(how many delayed|delayed count)/.test(text)){
    const d = data.filter(r => r.payment === "Delayed").length;
    return `There are ${d} delayed payment records out of ${data.length} total.`;
  }
 
  return "I can help with: milk totals, balances, payment status, or delayed payment counts — mention a member name or ID.";
}
 
function sendChat(){
  const val = chatInput.value;
  if(!val.trim()) return;
  addMsg(val, "user");
  chatInput.value = "";
  setTimeout(() => addMsg(answer(val), "bot"), 200);
}
 
document.getElementById("chatSend").addEventListener("click", sendChat);
chatInput.addEventListener("keydown", e => { if(e.key === "Enter") sendChat(); });
 