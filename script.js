const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open');
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click',()=>nav.classList.remove('open')));

const modal = document.getElementById('lead-modal');
document.querySelectorAll('[data-open-modal]').forEach(btn => btn.addEventListener('click',()=>{
  const topic = btn.dataset.topic || (document.documentElement.lang === 'en' ? 'General inquiry' : 'Общий вопрос');
  const field = modal?.querySelector('input[name="topic"]');
  if(field) field.value = topic;
  modal?.showModal();
}));
document.querySelector('[data-close-modal]')?.addEventListener('click',()=>modal?.close());
modal?.addEventListener('click', e => { if (e.target === modal) modal.close(); });

const WHATSAPP_NUMBER = '79777379737';
document.querySelectorAll('[data-whatsapp-form]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const en = document.documentElement.lang === 'en';
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const role = String(data.get('role') || '').trim();
    const topic = String(data.get('topic') || '').trim();
    const message = String(data.get('message') || '').trim();
    const text = en ? [
      'Hello! I would like an initial review of my situation.',
      topic ? `Topic: ${topic}` : '', role ? `Role: ${role}` : '',
      `Name: ${name}`, `Phone: ${phone}`, message ? `Situation: ${message}` : ''
    ] : [
      'Здравствуйте! Хочу получить первичный разбор ситуации.',
      topic ? `Тема: ${topic}` : '', role ? `Роль: ${role}` : '',
      `Имя: ${name}`, `Телефон: ${phone}`, message ? `Ситуация: ${message}` : ''
    ];
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text.filter(Boolean).join('\n'))}`, '_blank', 'noopener,noreferrer');
    const status = form.querySelector('.form-note');
    if (status) status.textContent = en ? 'WhatsApp is open. Review the message and tap Send.' : 'WhatsApp открыт. Проверьте текст и нажмите «Отправить».';
  });
});

const i18n = {
 en: {
  brandTag:'solutions · negotiation · enforcement', menu:'Menu', navDirections:'Solutions', navJourney:'How we work', navTiming:'Timeframes', navRussia:'Across Russia', navPromise:'Our code', navContacts:'Contacts', ctaAnalyze:'Review my situation',
  heroEyebrow:'Federal practice for obligations and judgment enforcement', heroTitle1:'Restoring control', heroTitle2:'over complex situations.', heroLead:'We help creditors, debtors, businesses and leasing companies move from uncertainty to a lawful solution.', ctaPlan:'Get an action plan', ctaChoose:'Choose a solution', heroCaption:'Clear process. Lawful solutions. Ongoing support.', phone:'Phone',
  directionsEyebrow:'How can we help?', directionsTitle:'Choose your situation', directionsLead:'Each category receives a dedicated route, clear stages and specialist support.', aud1Title:'I need to recover a debt', aud1Text:'Court proceedings, writs of execution, enforcement authorities, asset search and enforcement control.', aud2Title:'I need to settle a debt', aud2Text:'Negotiation, settlement, restructuring and lawful protection of debtor rights.', aud3Title:'I represent a business', aud3Text:'Systematic management of receivables, obligations and corporate disputes.', aud4Title:'I represent a leasing company', aud4Text:'Lawful tracing and recovery of vehicles, machinery and equipment based on verified authority.', goSolution:'View solution →', goLeasing:'Leasing practice →',
  journeyTitle:'What happens after you contact us', journeyLead:'We show the full route in advance: what the company does, what the client needs to do and what comes next.', weDo:'We:', youDo:'You:', j1:'Inquiry', j1we:'record the request and agree the communication channel.', j1you:'briefly describe the situation.', j2:'Review', j2we:'analyse documents, risks and possible routes.', j2you:'provide the available materials.', j3:'Strategy and terms', j3we:'propose a solution, fees and working format.', j3you:'ask questions and choose an option.', j4:'Agreement', j4we:'prepare the contract and explain the terms.', j4you:'sign it in a convenient way.', j5:'Payment', j5we:'issue an invoice and confirm receipt.', j5you:'pay for the agreed stage.', j6:'Authority', j6we:'explain whether a power of attorney is needed and prepare the details.', j6you:'arrange it only when required.', j7:'Legal support', j7we:'implement the strategy and control the process.', j7you:'receive clear updates.', j8:'Completion', j8we:'record the outcome and transfer final materials.', j8you:'accept the result and documents.',
  timingEyebrow:'Reasonable timeframes', timingTitle:'We do not accelerate time. We remove uncertainty.', timingLead:'Court and enforcement procedures depend on the law, authorities and the circumstances of the matter. We do not promise the impossible, but we manage our work, monitor stages and keep the client informed.', std1label:'After an inquiry', std1:'We contact you and agree the next step', std2label:'After receiving documents', std2:'We start reviewing the complete set', std3label:'After a material event', std3:'We explain the outcome and next actions', std4label:'During waiting periods', std4:'We maintain clear and regular communication',
  federalEyebrow:'Federal service model', federalTitle:'Working across Russia', federalLead:'Most matters are handled remotely. Where personal involvement is required, we can arrange a business meeting with a specialist in the client’s region or at the client’s premises.', headOffice:'head office', online:'Online', meeting:'In-person meeting', regions:'Russian regions', clientOffice:'Client office', mapTitle:'Federal coverage across the entire Russian Federation', mapDesc:'A complete outline map of the Russian Federation with blinking markers for key cities and nationwide service coverage.', mapKaliningrad:'Kaliningrad', mapMoscow:'Moscow', mapSpb:'St Petersburg', mapMurmansk:'Murmansk', mapKazan:'Kazan', mapRostov:'Rostov-on-Don', mapSamara:'Samara', mapUfa:'Ufa', mapEkb:'Yekaterinburg', mapChelyabinsk:'Chelyabinsk', mapOmsk:'Omsk', mapNovosibirsk:'Novosibirsk', mapKrasnoyarsk:'Krasnoyarsk', mapIrkutsk:'Irkutsk', mapYakutsk:'Yakutsk', mapKhabarovsk:'Khabarovsk', mapVladivostok:'Vladivostok', mapLegend1:'Head office — Moscow', mapLegend2:'Remote support — throughout the Russian Federation', mapLegend3:'Business meeting — by prior arrangement', mapDisclaimer:'Blinking markers show nationwide service coverage and do not imply a permanent office in every city.',
  promiseTitle:'Our working code', p1t:'No impossible promises', p1:'We speak honestly about risks, limitations and reasonable timeframes.', p2t:'No uncertainty', p2:'We explain what is happening, what has been done and what comes next.', p3t:'Lawful action only', p3:'We do not assist with concealment of assets, evasion of enforcement or other unlawful actions.', p4t:'Confidentiality', p4:'We do not publish client or case information without a lawful basis and consent.',
  directorEyebrow:'Thank you for your trust', directorQuote:'“Behind every inquiry there is a person, a family or a business. I therefore personally oversee the path of each inquiry — from the first call or message to contract signature and every subsequent stage of legal support. The client should always know who is responsible, what has been done and what comes next.”', directorResponsibility:'The General Director personally receives calls, messages and inquiries, has administrative access to the website, signs all company contracts personally and retains control over every stage of the work.', directorNote:'As the volume of inquiries grows, individual tasks may be assigned to specialist professionals, while managerial oversight and responsibility for service standards remain with the General Director.', directorRole:'General Director, KREDITOR LLC',
  protectTitle:'Official digital resource of the company', protectLead:'Verify the domain, company details and official contacts. The design, text, structure and software elements are protected as intellectual property of KREDITOR LLC.', protectNote:'This test build contains a digital identifier. In production, critical logic and secrets will be stored only on the server.',
  contactEyebrow:'First step', contactTitle:'Let us discuss your situation', contactLead:'Choose a convenient channel. The WhatsApp number is displayed next to the link so you can verify it before opening.', call:'Call →', openWhatsApp:'Open WhatsApp →', openTelegram:'Open Telegram →', sendEmail:'Send email →', moscow:'Moscow', aroundClock:'24/7', name:'Name', role:'Your role', role1:'Creditor', role2:'Debtor', role3:'Business representative', role4:'Leasing company', role5:'Partner or colleague', describe:'Briefly describe the situation', consent:'I consent to personal data processing for the purpose of responding to this inquiry.', continueWhatsApp:'Continue in WhatsApp', formNote:'WhatsApp will open with a prepared message. It is sent only after your confirmation.', footerTag:'federal legal platform', footerText:'Support for creditors, debtors, businesses and leasing companies in Russian and English.', details:'Company details', rights:'All rights reserved.', testNote:'Test version · not a public offer', modalEyebrow:'Initial review', modalTitle:'Describe your situation', message:'Message'
 }
};
const ruOriginal = new Map();
document.querySelectorAll('[data-i18n]').forEach(el => ruOriginal.set(el, el.textContent));
function setLanguage(lang){
 document.documentElement.lang = lang;
 document.querySelectorAll('[data-i18n]').forEach(el => {
  const key = el.dataset.i18n;
  el.textContent = lang === 'ru' ? ruOriginal.get(el) : (i18n.en[key] || ruOriginal.get(el));
 });
 document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active', b.dataset.lang===lang));
 document.title = lang === 'en' ? 'KREDITOR — Federal Legal Platform' : 'КРЕДИТОР — федеральная юридическая платформа';
 localStorage.setItem('kreditor-language', lang);
}
document.querySelectorAll('.lang-btn').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.lang)));
setLanguage(localStorage.getItem('kreditor-language') === 'en' ? 'en' : 'ru');

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if(entry.isIntersecting){ entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
}), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
