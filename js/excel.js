(() => {
"use strict";

const ExcelManager = {
initialized: false,
storageKey: "tipax-imported-data",
shipmentKey: "tipax-manual-shipments",
lastImportKey: "tipax-last-excel-import",
pendingRows: [],
pendingFileName: "",
toastTimer: null,

init() {
  if (this.initialized) return;
  this.initialized = true;
  this.bindEvents();
  this.renderStats();
  this.renderHistory();
},

bindEvents() {
  document.addEventListener("change", e => {
    const input = e.target.closest(
      "[data-excel-file],#excelFile"
    );
    if (input) this.previewFile(input.files?.[0]);
  });

  document.addEventListener("submit", e => {
    const form = e.target.closest(
      "[data-excel-form],#excelForm"
    );
    if (!form) return;
    e.preventDefault();
    const file = form.querySelector(
      'input[type="file"]'
    )?.files?.[0];
    if (file) this.previewFile(file);
    else this.notify("ابتدا فایل Excel یا CSV را انتخاب کنید.","error");
  });

  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-excel-action]");
    if (!btn) return;
    e.preventDefault();
    const action = btn.dataset.excelAction;
    if (action === "import") this.commitImport();
    if (action === "clear") this.clearImportedData();
    if (action === "refresh") this.refresh();
    if (action === "download-template") this.downloadTemplate();
    if (action === "export") this.exportImported();
  });

  window.addEventListener("storage", e => {
    if ([this.storageKey,this.shipmentKey,this.lastImportKey].includes(e.key))
      this.refresh();
  });
},

async previewFile(file) {
  if (!file) return;
  try {
    this.setStatus(`در حال بررسی فایل «${file.name}»...`);
    const ext = file.name.split(".").pop().toLowerCase();
    let rows;

    if (ext === "csv") rows = await this.parseCsv(file);
    else if (ext === "xlsx" || ext === "xls")
      rows = await this.parseXlsx(file);
    else throw new Error("فرمت فایل پشتیبانی نمی‌شود.");

    if (!rows.length) throw new Error("فایل فاقد داده قابل استفاده است.");

    this.pendingRows = this.normalizeRows(rows);
    this.pendingFileName = file.name;
    this.renderPreview();
    this.setStatus(`${this.numberFormat(this.pendingRows.length)} ردیف آماده ورود است.`);
  } catch (err) {
    this.setStatus(err.message || "خواندن فایل ناموفق بود.");
    this.notify(err.message || "خواندن فایل ناموفق بود.","error");
  }
},

async parseXlsx(file) {
  if (!window.XLSX || typeof window.XLSX.read !== "function")
    throw new Error("کتابخانه XLSX در صفحه بارگذاری نشده است.");

  const buffer = await file.arrayBuffer();
  const workbook = window.XLSX.read(buffer,{
    type:"array",cellDates:true,raw:false
  });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) return [];
  return window.XLSX.utils.sheet_to_json(sheet,{defval:""});
},

async parseCsv(file) {
  const rows = this.parseCsvText(
    (await file.text()).replace(/^\uFEFF/,"")
  );
  if (!rows.length) return [];
  const headers = rows.shift().map(v => String(v).trim());
  return rows.filter(r => r.some(v => String(v ?? "").trim()))
    .map(r => Object.fromEntries(
      headers.map((h,i) => [h,r[i] ?? ""]).filter(([h]) => h)
    ));
},

parseCsvText(text) {
  const result=[]; let row=[], cell="", quoted=false;
  for (let i=0;i<text.length;i++) {
    const c=text[i], n=text[i+1];
    if (c === '"' && quoted && n === '"') { cell+='"'; i++; continue; }
    if (c === '"') { quoted=!quoted; continue; }
    if (c === "," && !quoted) { row.push(cell); cell=""; continue; }
    if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && n === "\n") i++;
      row.push(cell); cell="";
      if (row.some(v=>String(v).trim())) result.push(row);
      row=[]; continue;
    }
    cell+=c;
  }
  row.push(cell);
  if (row.some(v=>String(v).trim())) result.push(row);
  return result;
},

normalizeRows(rows) {
  return rows.map((row,index) => {
    const source={};
    Object.entries(row).forEach(([k,v]) => {
      source[this.normalizeHeader(k)] = this.clean(v);
    });

    return {
      rowNumber:index+2,
      trackingNumber:this.first(source,[
        "tracking","trackingnumber","barcode","barcodeno",
        "waybill","waybillnumber","شمارهمرسوله","کدمرسوله","بارکد"
      ]),
      sender:this.first(source,["sender","sendername","origin","فرستنده"]),
      receiver:this.first(source,["receiver","receivername","destination","گیرنده"]),
      phone:this.first(source,["phone","mobile","receivermobile","شمارهتماس","موبایل"]),
      amount:this.toNumber(this.first(source,["amount","price","cost","fare","مبلغ","هزینه"])),
      payment:this.first(source,["payment","paymenttype","paymentmethod","پرداخت","نوعپرداخت"]),
      status:this.first(source,["status","shipmentstatus","وضعیت","وضعیتمرسوله"]),
      courier:this.first(source,["courier","deliveryman","driver","پیک","مامورارسال"]),
      carton:this.first(source,["carton","cartonsize","box","boxsize","کارتن","سایزکارتن"]),
      date:this.first(source,["date","createdat","shipmentdate","تاریخ"]),
      time:this.first(source,["time","createdtime","ساعت"]),
      description:this.first(source,["description","note","details","توضیحات","یادداشت"]),
      raw:source
    };
  });
},

normalizeHeader(v) {
  return String(v ?? "").trim().toLocaleLowerCase("fa")
    .replace(/\u200c/g,"").replace(/\s+/g,"")
    .replace(/[_-]/g,"").replace(/[()]/g,"");
},

clean(v) {
  return v instanceof Date ? v.toISOString() :
    String(v ?? "").replace(/\u200c/g," ").trim();
},

first(obj,keys) {
  for (const key of keys) {
    const v=obj[this.normalizeHeader(key)];
    if (v !== undefined && v !== null && String(v).trim()) return String(v).trim();
  }
  return "";
},

toNumber(v) {
  const n=Number(String(v ?? "").replace(/,/g,"").replace(/٬/g,"").replace(/[^\d.-]/g,""));
  return Number.isFinite(n) ? n : 0;
},

renderPreview() {
  const box=document.querySelector("[data-excel-preview],#excelPreview");
  if (!box) return;
  const rows=this.pendingRows, sample=rows.slice(0,100);
  const cols=[
    ["trackingNumber","شماره مرسوله"],["sender","فرستنده"],
    ["receiver","گیرنده"],["amount","مبلغ"],["payment","پرداخت"],
    ["status","وضعیت"],["courier","پیک"],["carton","کارتن"],["date","تاریخ"]
  ];

  box.innerHTML=`
    <div class="excel-preview-head">
      <div><strong>${this.escape(this.pendingFileName)}</strong>
      <span>${this.numberFormat(rows.length)} ردیف</span></div>
      <button type="button" data-excel-action="import">ثبت اطلاعات</button>
    </div>
    <div class="excel-table-wrap"><table class="excel-table">
      <thead><tr>${cols.map(c=>`<th>${c[1]}</th>`).join("")}</tr></thead>
      <tbody>${sample.map(r=>`<tr>${cols.map(([k])=>
        `<td>${this.escape(k==="amount"?this.numberFormat(r[k]):r[k])}</td>`
      ).join("")}</tr>`).join("")}</tbody>
    </table></div>
    ${rows.length>100?`<div class="excel-preview-more">فقط 100 ردیف اول برای پیش‌نمایش نمایش داده شده است.</div>`:""}
  `;
},

commitImport() {
  const rows=this.pendingRows;
  if (!rows.length) return this.notify("داده‌ای برای ورود وجود ندارد.","error");

  const importedAt=new Date().toISOString();
  const payload=rows.map(r=>({...r,importedAt}));

  try {
    localStorage.setItem(this.storageKey,JSON.stringify(payload));
    localStorage.setItem(this.lastImportKey,JSON.stringify({
      fileName:this.pendingFileName,rows:rows.length,importedAt
    }));

    const shipments=this.readShipments();
    const existing=new Set(shipments.map(x=>String(x.trackingNumber||x.id||"")));
    const additions=payload.filter(r=>r.trackingNumber||r.sender||r.receiver)
      .map(r=>({
        id:r.trackingNumber||`EX-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        trackingNumber:r.trackingNumber,sender:r.sender,receiver:r.receiver,
        phone:r.phone,amount:r.amount,payment:r.payment,
        status:r.status||"ثبت شده",courier:r.courier,carton:r.carton,
        date:r.date,time:r.time,description:r.description,
        source:"excel",importedAt
      }))
      .filter(r=>!existing.has(String(r.trackingNumber||r.id||"")));

    localStorage.setItem(this.shipmentKey,JSON.stringify([...shipments,...additions]));
    this.pendingRows=[]; this.renderStats(); this.renderHistory();
    this.notify(`${this.numberFormat(rows.length)} ردیف با موفقیت وارد شد.`,"success");

    document.dispatchEvent(new CustomEvent("tipax:excel-imported",{
      detail:{rows:payload,shipments:additions,fileName:this.pendingFileName}
    }));
  } catch {
    this.notify("ذخیره اطلاعات واردشده انجام نشد.","error");
  }
},

readImported() {
  try {
    const x=JSON.parse(localStorage.getItem(this.storageKey)||"[]");
    return Array.isArray(x)?x:[];
  } catch { return []; }
},

readShipments() {
  try {
    const x=JSON.parse(localStorage.getItem(this.shipmentKey)||"[]");
    return Array.isArray(x)?x:[];
  } catch { return []; }
},

readLastImport() {
  try { return JSON.parse(localStorage.getItem(this.lastImportKey)||"null"); }
  catch { return null; }
},

renderStats() {
  const rows=this.readImported(), last=this.readLastImport();
  const values={
    rows:rows.length,
    shipments:this.readShipments().filter(x=>x.source==="excel").length,
    amount:rows.reduce((s,r)=>s+this.toNumber(r.amount),0),
    lastRows:last?.rows||0
  };
  Object.entries(values).forEach(([k,v])=>{
    document.querySelectorAll(`[data-excel-summary="${k}"]`)
      .forEach(el=>el.textContent=this.numberFormat(v));
  });
},

renderHistory() {
  const box=document.querySelector("[data-excel-history],#excelHistory");
  if (!box) return;
  const last=this.readLastImport();
  if (!last) {
    box.innerHTML=`<div class="empty-state">هنوز فایلی وارد نشده است.</div>`;
    return;
  }
  box.innerHTML=`
    <div class="excel-history-item">
      <div><strong>${this.escape(last.fileName||"فایل Excel")}</strong>
      <small>${this.numberFormat(last.rows)} ردیف</small></div>
      <time>${new Date(last.importedAt).toLocaleString("fa-IR")}</time>
    </div>`;
},

clearImportedData() {
  if (!confirm("اطلاعات واردشده از Excel پاک شود؟")) return;
  localStorage.removeItem(this.storageKey);
  localStorage.removeItem(this.lastImportKey);
  this.pendingRows=[];
  this.renderStats(); this.renderHistory();
  this.notify("داده‌های واردشده پاک شدند.","success");
},

downloadTemplate() {
  const rows=[
    ["شماره مرسوله","فرستنده","گیرنده","شماره تماس","مبلغ","نوع پرداخت","وضعیت","پیک","سایز کارتن","تاریخ","ساعت","توضیحات"],
    ["TPX-100001","نمونه فرستنده","نمونه گیرنده","09120000000","200000","نقدی","ثبت شده","پیک موتور","A3","1405/07/01","10:30","نمونه"]
  ];
  this.downloadCsv(rows,"tipax-import-template.csv");
  this.notify("قالب ورود اطلاعات آماده شد.","success");
},

exportImported() {
  const rows=this.readImported();
  if (!rows.length) return this.notify("داده‌ای برای خروجی وجود ندارد.","error");
  const data=[
    ["شماره مرسوله","فرستنده","گیرنده","شماره تماس","مبلغ","نوع پرداخت","وضعیت","پیک","سایز کارتن","تاریخ","ساعت","توضیحات"],
    ...rows.map(r=>[r.trackingNumber,r.sender,r.receiver,r.phone,r.amount,r.payment,r.status,r.courier,r.carton,r.date,r.time,r.description])
  ];
  this.downloadCsv(data,`tipax-imported-${this.fileDate()}.csv`);
  this.notify("خروجی اطلاعات آماده شد.","success");
},

downloadCsv(rows,name) {
  const csv=rows.map(r=>r.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob), a=document.createElement("a");
  a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
},

refresh() {
  this.renderStats(); this.renderHistory();
  document.dispatchEvent(new CustomEvent("tipax:excel-refreshed",{
    detail:{rows:this.readImported()}
  }));
},

setStatus(text) {
  document.querySelectorAll("[data-excel-status],#excelStatus")
    .forEach(el=>el.textContent=text);
},

fileDate() {
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
},

numberFormat(v) {
  return new Intl.NumberFormat("en-US",{maximumFractionDigits:0}).format(Number(v)||0);
},

escape(v) {
  return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
},

notify(message,type="info") {
  if (window.TipaxApp?.toast) return window.TipaxApp.toast(message,type);
  if (window.Tipax?.toast) return window.Tipax.toast(message,type);
  const toast=document.getElementById("toast");
  if (!toast) return console.log(`[Tipax] ${message}`);
  toast.textContent=message; toast.dataset.type=type; toast.classList.add("show");
  clearTimeout(this.toastTimer);
  this.toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
}

};

window.TipaxExcel=ExcelManager;
window.importTipaxExcel=file=>ExcelManager.previewFile(file);
window.exportTipaxExcel=()=>ExcelManager.exportImported();
window.downloadTipaxExcelTemplate=()=>ExcelManager.downloadTemplate();

if (document.readyState==="loading")
document.addEventListener("DOMContentLoaded",()=>ExcelManager.init(),{once});
else ExcelManager.init();
})();
