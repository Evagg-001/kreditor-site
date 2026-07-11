
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

const menu=$(".menu-toggle"), nav=$("#main-nav");
menu?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));});
$$("#main-nav a").forEach(a=>a.addEventListener("click",()=>nav?.classList.remove("open")));

const modal=$("#lead-modal");
$$("[data-open-modal]").forEach(b=>b.addEventListener("click",()=>modal?.showModal()));
$("[data-close-modal]")?.addEventListener("click",()=>modal?.close());
modal?.addEventListener("click",e=>{if(e.target===modal)modal.close()});

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");io.unobserve(e.target)}}),{threshold:.1});
$$(".reveal").forEach(el=>io.observe(el));

function buildMessage(form){
 const d=Object.fromEntries(new FormData(form));
 return [
  "Здравствуйте! Обращение с сайта kreditor.pro",
  d.topic&&`Тема: ${d.topic}`, d.name&&`Имя: ${d.name}`,
  d.phone&&`Телефон: ${d.phone}`, d.email&&`Email: ${d.email}`,
  d.role&&`Категория: ${d.role}`, d.message&&`Ситуация: ${d.message}`
 ].filter(Boolean).join("\n");
}
$$("[data-lead-form]").forEach(form=>form.addEventListener("submit",e=>{
 e.preventDefault();
 const status=$(".form-status",form);
 if(!form.checkValidity()){form.reportValidity();status.textContent="Проверьте обязательные поля.";status.className="form-status error";return}
 status.textContent="Открываем WhatsApp с подготовленным сообщением…";status.className="form-status success";
 const url=`https://wa.me/79777379737?text=${encodeURIComponent(buildMessage(form))}`;
 window.open(url,"_blank","noopener");
}));

const cookie=$("#cookie-banner");
if(cookie && localStorage.getItem("kreditor_cookie_ok")!=="1") setTimeout(()=>cookie.classList.add("show"),500);
$("#cookie-accept")?.addEventListener("click",()=>{localStorage.setItem("kreditor_cookie_ok","1");cookie.classList.remove("show")});

$$("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());
