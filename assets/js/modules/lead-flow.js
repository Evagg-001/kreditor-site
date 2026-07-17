/* contact-channels.js */
"use strict";
(()=>{
  const CONFIG={
    phone: window.KreditorConfig?.contacts?.phone || "+79777379737",
    phoneDigits: String(
      window.KreditorConfig?.contacts?.phoneDigits ||
      window.KreditorConfig?.contacts?.phone ||
      "79777379737"
    ).replace(/\D/g, ""),
    telegram: window.KreditorConfig?.contacts?.telegram || "ooo_kreditor",
    email: window.KreditorConfig?.contacts?.email || "kreditoro@bk.ru"
  };
  const forms=[...document.querySelectorAll('[data-lead-form]')];

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
  const analytics=(event,channel="")=>{
    try{
      const id=window.KREDITOR_ANALYTICS?.yandexMetrikaId;
      if(typeof window.ym==="function"&&id)window.ym(id,"reachGoal",event,{page:location.pathname,channel});
    }catch(e){void e;}
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
  const copy=async text=>{try{await navigator.clipboard.writeText(text);return true}catch(e){void e;return false}};

  const buildChannelBlock=()=>{
    const block=document.createElement("div");
    block.className="lead-channel-block";
    block.setAttribute("aria-hidden","true");
    block.innerHTML=`
      <span class="lead-channel-title">Выберите удобный способ связи</span>
      <div class="lead-channel-actions" role="group" aria-label="Способ связи">
        <button class="lead-channel-btn" type="button" data-channel="whatsapp"><span class="lead-channel-icon">W</span><span class="lead-channel-copy">WhatsApp<small>Открыть чат</small></span></button>
        <button class="lead-channel-btn" type="button" data-channel="telegram"><span class="lead-channel-icon">T</span><span class="lead-channel-copy">Telegram<small>@ooo_kreditor</small></span></button>
        <button class="lead-channel-btn" type="button" data-channel="phone"><span class="lead-channel-icon">☎</span><span class="lead-channel-copy">Позвонить<small>+7 (977) 737-97-37</small></span></button>
        <button class="lead-channel-btn" type="button" data-channel="email"><span class="lead-channel-icon">✉</span><span class="lead-channel-copy">Email<small>kreditoro@bk.ru</small></span></button>
      </div>
      <p class="lead-channel-note">Сообщение будет подготовлено автоматически. Отправка произойдёт только после вашего подтверждения.</p>`;
    return block;
  };

  const showWhatsAppLink=(form,url)=>{
    form.querySelector(".wa-ready")?.remove();

    const box=document.createElement("div");
    box.className="wa-ready";

    const textNode=document.createElement("p");
    textNode.textContent="Сообщение подготовлено. Откройте WhatsApp вручную.";

    const link=document.createElement("a");
    link.href=url;
    link.target="_blank";
    link.rel="noopener noreferrer";
    link.className="wa-ready__link";
    link.textContent="Открыть WhatsApp";

    const cancel=document.createElement("button");
    cancel.type="button";
    cancel.className="wa-ready__cancel";
    cancel.textContent="Отмена";
    cancel.addEventListener("click",()=>box.remove());

    box.append(textNode,link,cancel);

    const channelBlock=form.querySelector(".lead-channel-block");
    (channelBlock||form).insertAdjacentElement("afterend",box);
    link.focus({preventScroll:true});
  };


  forms.forEach(form=>{
    const submit=form.querySelector('button[type="submit"]');
    if(!submit)return;
    submit.hidden=false;submit.removeAttribute("aria-hidden");submit.tabIndex=0;
    submit.textContent="Продолжить";
    submit.classList.add("lead-continue-btn");

    let block=form.querySelector(".lead-channel-block");
    if(!block){block=buildChannelBlock();submit.insertAdjacentElement("afterend",block)}
    else block.classList.remove("is-visible");

    const reveal=()=>{
      if(!validate(form))return false;
      block.classList.add("is-visible");block.setAttribute("aria-hidden","false");
      submit.classList.add("is-complete");submit.textContent="Выберите способ связи";
      setStatus(form,"Выберите один из четырёх удобных способов связи.","success");
      block.scrollIntoView({behavior:"smooth",block:"nearest"});
      block.querySelector(".lead-channel-btn")?.focus({preventScroll:true});
      analytics("lead_form_continue");
      return true;
    };

    form.addEventListener("submit",e=>{
      e.preventDefault();e.stopImmediatePropagation();reveal();
    },true);

    block.addEventListener("click",async e=>{
      const btn=e.target.closest("[data-channel]");if(!btn)return;
      e.preventDefault();e.stopPropagation();
      if(!validate(form))return;
      const channel=btn.dataset.channel;const text=message(form);analytics("lead_channel_select",channel);
      if(channel==="whatsapp"){
        const whatsappUrl=`https://web.whatsapp.com/send?phone=${CONFIG.phoneDigits}&text=${encodeURIComponent(text)}`;
        setStatus(form,"Сообщение подготовлено. Нажмите «Открыть WhatsApp».","success");
        showWhatsAppLink(form,whatsappUrl);
        return;
      }else if(channel==="telegram"){
        const ok=await copy(text);
        setStatus(form,ok?"Текст обращения скопирован. Открываем Telegram…":"Открываем Telegram. Текст можно скопировать из формы.","success");
        window.open(`https://t.me/${CONFIG.telegram}`,"_blank","noopener,noreferrer");
      }else if(channel==="phone"){
        setStatus(form,"Открываем приложение для звонка…","success");location.href=`tel:${CONFIG.phone}`;
      }else if(channel==="email"){
        setStatus(form,"Открываем почтовое приложение…","success");
        location.href=`mailto:${CONFIG.email}?subject=${encodeURIComponent("Обращение с сайта КРЕДИТОР")}&body=${encodeURIComponent(text)}`;
      }
    });
  });

  document.querySelectorAll(".desktop-sticky-cta").forEach(widget=>{
    const main=widget.querySelector(".desktop-sticky-main");

    const openLeadModal=()=>{
      if(window.KreditorLeadModal?.open){
        window.KreditorLeadModal.open();
      }else{
        const modal=document.querySelector("#lead-modal");
        if(modal&&!modal.open&&typeof modal.showModal==="function"){
          modal.showModal();
        }
      }
      analytics("sticky_open_form");
    };

    if(main){
      main.textContent="Обсудить ситуацию";
      main.classList.add("js-open-lead");
      main.setAttribute("data-open-modal","");
    }

    widget.querySelectorAll("a,.kreditor-sticky-channel").forEach(node=>node.remove());

    const phone=document.createElement("a");
    phone.className="kreditor-sticky-channel";
    phone.href=`tel:${CONFIG.phone}`;
    phone.textContent="☎";
    phone.setAttribute("aria-label","Позвонить");
    phone.addEventListener("click",()=>analytics("sticky_contact_click","phone"));

    const whatsapp=document.createElement("button");
    whatsapp.type="button";
    whatsapp.className="kreditor-sticky-channel";
    whatsapp.textContent="W";
    whatsapp.setAttribute("aria-label","Открыть форму для WhatsApp");
    whatsapp.addEventListener("click",event=>{
      event.preventDefault();
      event.stopImmediatePropagation();
      openLeadModal();
    });

    const telegram=document.createElement("a");
    telegram.className="kreditor-sticky-channel";
    telegram.href=`https://t.me/${CONFIG.telegram}`;
    telegram.target="_blank";
    telegram.rel="noopener noreferrer";
    telegram.textContent="T";
    telegram.setAttribute("aria-label","Написать в Telegram");
    telegram.addEventListener("click",()=>analytics("sticky_contact_click","telegram"));

    const email=document.createElement("a");
    email.className="kreditor-sticky-channel";
    email.href=`mailto:${CONFIG.email}?subject=${encodeURIComponent("Обращение с сайта КРЕДИТОР")}`;
    email.textContent="✉";
    email.setAttribute("aria-label","Написать по электронной почте");
    email.addEventListener("click",()=>analytics("sticky_contact_click","email"));

    widget.append(phone,whatsapp,telegram,email);
  });
})();
