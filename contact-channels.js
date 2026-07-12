"use strict";
(()=>{
  const CONFIG={phone:"+79777379737",phoneDigits:"79777379737",telegram:"ooo_kreditor",email:"kreditoro@bk.ru"};
  const forms=[...document.querySelectorAll('[data-lead-form]')];
  if(!forms.length)return;

  const normalizePhone=v=>String(v||"").replace(/[^\d+]/g,"");
  const validPhone=v=>/^\+?\d{10,15}$/.test(normalizePhone(v).replace(/^8/,"7"));
  const roleLabel=v=>({"Бизнес":"Представитель организации"}[v]||v);
  const message=form=>{
    const d=Object.fromEntries(new FormData(form));
    return [
      "Здравствуйте! Обращение с сайта kreditor.pro",
      `Страница: ${location.href.split("?")[0]}`,
      d.name&&`Имя: ${d.name}`,
      d.phone&&`Телефон: ${d.phone}`,
      d.email&&`Email: ${d.email}`,
      d.role&&`Ваша роль: ${roleLabel(d.role)}`,
      d.message&&`Ситуация: ${d.message}`
    ].filter(Boolean).join("\n");
  };
  const setStatus=(form,text,type="")=>{
    let el=form.querySelector(".form-status");
    if(!el){el=document.createElement("p");el.className="form-status";el.setAttribute("aria-live","polite");form.append(el)}
    el.textContent=text;el.className=`form-status ${type}`.trim();
  };
  const analytics=(event,channel)=>{
    try{
      const id=window.KREDITOR_ANALYTICS?.yandexMetrikaId;
      if(typeof window.ym==="function"&&id)window.ym(id,"reachGoal",event,{page:location.pathname,channel});
    }catch(_){ }
  };
  const validate=form=>{
    const phone=form.elements.phone;
    if(phone&&!validPhone(phone.value)){
      phone.setCustomValidity("Укажите телефон: от 10 до 15 цифр.");phone.reportValidity();
      setStatus(form,"Проверьте номер телефона.","error");return false;
    }
    phone?.setCustomValidity("");
    if(!form.checkValidity()){
      form.reportValidity();setStatus(form,"Проверьте обязательные поля и согласие.","error");return false;
    }
    return true;
  };
  const copy=async text=>{try{await navigator.clipboard.writeText(text);return true}catch(_){return false}};

  forms.forEach(form=>{
    const submit=form.querySelector('button[type="submit"]');
    if(!submit||form.querySelector(".lead-channel-block"))return;
    submit.hidden=true;submit.setAttribute("aria-hidden","true");submit.tabIndex=-1;

    const block=document.createElement("div");
    block.className="lead-channel-block";
    block.innerHTML=`
      <span class="lead-channel-title">Выберите удобный способ связи</span>
      <div class="lead-channel-actions" role="group" aria-label="Способ связи">
        <button class="lead-channel-btn" type="button" data-channel="whatsapp"><span class="lead-channel-icon">W</span>WhatsApp</button>
        <button class="lead-channel-btn" type="button" data-channel="telegram"><span class="lead-channel-icon">T</span>Telegram</button>
        <button class="lead-channel-btn" type="button" data-channel="phone"><span class="lead-channel-icon">☎</span>Позвонить</button>
        <button class="lead-channel-btn" type="button" data-channel="email"><span class="lead-channel-icon">✉</span>Email</button>
      </div>
      <p class="lead-channel-note">Перед переходом проверьте введённые данные. Для Telegram текст обращения будет скопирован в буфер обмена.</p>`;
    submit.insertAdjacentElement("afterend",block);

    block.addEventListener("click",async e=>{
      const btn=e.target.closest("[data-channel]");if(!btn)return;
      if(!validate(form))return;
      const channel=btn.dataset.channel;const text=message(form);analytics("lead_channel_select",channel);
      if(channel==="whatsapp"){
        setStatus(form,"Открываем WhatsApp с подготовленным сообщением…","success");
        window.open(`https://wa.me/${CONFIG.phoneDigits}?text=${encodeURIComponent(text)}`,"_blank","noopener,noreferrer");
      }else if(channel==="telegram"){
        const ok=await copy(text);
        setStatus(form,ok?"Текст обращения скопирован. Открываем Telegram…":"Открываем Telegram. Текст можно скопировать из формы.","success");
        window.open(`https://t.me/${CONFIG.telegram}`,"_blank","noopener,noreferrer");
      }else if(channel==="phone"){
        setStatus(form,"Открываем приложение для звонка…","success");
        location.href=`tel:${CONFIG.phone}`;
      }else if(channel==="email"){
        const subject="Обращение с сайта КРЕДИТОР";
        setStatus(form,"Открываем почтовое приложение…","success");
        location.href=`mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      }
    });

    form.addEventListener("submit",e=>{
      e.preventDefault();e.stopImmediatePropagation();
      setStatus(form,"Выберите способ связи: WhatsApp, Telegram, звонок или Email.","error");
      block.querySelector(".lead-channel-btn")?.focus();
    },true);
  });
})();
