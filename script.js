"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const CONFIG={phone:"79777379737",telegram:"ooo_kreditor",email:"kreditoro@bk.ru",build:"KREDITOR-V15-STABLE"};

function track(event,params={}){
  try{
    if(typeof window.ym==="function" && window.KREDITOR_ANALYTICS?.yandexMetrikaId){window.ym(window.KREDITOR_ANALYTICS.yandexMetrikaId,"reachGoal",event,params)}
    window.dispatchEvent(new CustomEvent("kreditor:analytics",{detail:{event,params}}));
  }catch(_){/* analytics must never block UX */}
}

const menu=$(".menu-toggle"), nav=$("#main-nav");
menu?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));});
$$("#main-nav a").forEach(a=>a.addEventListener("click",()=>{nav?.classList.remove("open");menu?.setAttribute("aria-expanded","false")}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){nav?.classList.remove("open");menu?.setAttribute("aria-expanded","false");$("#lead-modal")?.close()}});

const modal=$("#lead-modal");
$$('[data-open-modal]').forEach(b=>b.addEventListener("click",()=>{modal?.showModal();track("open_lead_modal",{page:location.pathname})}));
$("[data-close-modal]")?.addEventListener("click",()=>modal?.close());
modal?.addEventListener("click",e=>{if(e.target===modal)modal.close()});

if("IntersectionObserver" in window){
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");io.unobserve(e.target)}}),{threshold:.1});
 $$(".reveal").forEach(el=>io.observe(el));
}else $$(".reveal").forEach(el=>el.classList.add("is-visible"));

function utmData(){
 const q=new URLSearchParams(location.search), keys=["utm_source","utm_medium","utm_campaign","utm_content","utm_term"];
 const data={}; keys.forEach(k=>{const v=q.get(k)||sessionStorage.getItem(`kreditor_${k}`);if(v){data[k]=v;sessionStorage.setItem(`kreditor_${k}`,v)}}); return data;
}
$$('a[href^="tel:"]').forEach(a=>a.addEventListener("click",()=>track("click_phone",{page:location.pathname})));
$$('a[href*="wa.me"]').forEach(a=>a.addEventListener("click",()=>track("click_whatsapp",{page:location.pathname})));
$$('a[href*="t.me"]').forEach(a=>a.addEventListener("click",()=>track("click_telegram",{page:location.pathname})));
$$('a[href^="mailto:"]').forEach(a=>a.addEventListener("click",()=>track("click_email",{page:location.pathname})));

const cookie=$("#cookie-banner");
if(cookie && localStorage.getItem("kreditor_cookie_ok")!=="1") setTimeout(()=>cookie.classList.add("show"),500);
$("#cookie-accept")?.addEventListener("click",()=>{localStorage.setItem("kreditor_cookie_ok","1");cookie.classList.remove("show");track("cookie_accept")});
$$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
utmData();


$$("[data-contact-channel]").forEach(link=>{
  link.addEventListener("click",()=>{
    track("modal_contact_click",{
      page:location.pathname,
      channel:link.dataset.contactChannel||"unknown"
    });
  });
});

// KREDITOR V9: conversion and engagement analytics
(()=>{
  const fired=new Set(), marks=[25,50,75,90];
  const onScroll=()=>{
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const depth=Math.round((scrollY/max)*100);
    marks.forEach(mark=>{
      if(depth>=mark&&!fired.has(mark)){
        fired.add(mark);
        if(typeof track==="function") track("scroll_depth",{page:location.pathname,percent:mark});
      }
    });
  };
  addEventListener("scroll",onScroll,{passive:true}); onScroll();
})();
document.querySelectorAll(".mobile-contact-bar [data-contact-channel]").forEach(link=>{
  link.addEventListener("click",()=>{
    if(typeof track==="function") track("mobile_contact_click",{
      page:location.pathname,channel:link.dataset.contactChannel||"unknown"
    });
  });
});

// KREDITOR V10: conversion analytics and friction diagnostics
document.querySelectorAll('form[data-conversion-form="lead"]').forEach(form=>{
  let started=false;
  form.addEventListener("focusin",()=>{
    if(!started){
      started=true;
      if(typeof track==="function") track("conversion_form_start",{page:location.pathname});
    }
  },{once:true});
  form.addEventListener("submit",()=>{
    if(typeof track==="function") track("conversion_submit_attempt",{page:location.pathname});
  });
});

document.querySelectorAll("[data-analytics]").forEach(el=>{
  el.addEventListener("click",()=>{
    if(typeof track==="function") track(el.dataset.analytics,{page:location.pathname});
  });
});

// Preserve campaign parameters without exposing sensitive values
(()=>{
  const params=new URLSearchParams(location.search);
  const allowed=["utm_source","utm_medium","utm_campaign","utm_content","utm_term"];
  const campaign={};
  allowed.forEach(key=>{
    const value=params.get(key);
    if(value) campaign[key]=value.slice(0,120);
  });
  if(Object.keys(campaign).length){
    try{sessionStorage.setItem("kreditor_campaign",JSON.stringify(campaign));}catch(e){}
  }
  document.querySelectorAll('form[data-conversion-form="lead"]').forEach(form=>{
    let data={};
    try{data=JSON.parse(sessionStorage.getItem("kreditor_campaign")||"{}");}catch(e){}
    Object.entries(data).forEach(([key,value])=>{
      if(form.querySelector(`[name="${key}"]`)) return;
      const input=document.createElement("input");
      input.type="hidden"; input.name=key; input.value=value;
      form.appendChild(input);
    });
  });
})();
