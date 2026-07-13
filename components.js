/* KREDITOR V16.2 COMPONENT FOUNDATION */
(function(){
  'use strict';

  var API = window.KreditorComponents || {};

  function qsa(selector, root){
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function ensureToastRegion(){
    var region = document.querySelector('.k-toast-region');
    if(region) return region;
    region = document.createElement('div');
    region.className = 'k-toast-region';
    region.setAttribute('aria-live','polite');
    region.setAttribute('aria-atomic','false');
    document.body.appendChild(region);
    return region;
  }

  API.toast = function(message, options){
    options = options || {};
    var region = ensureToastRegion();
    var toast = document.createElement('div');
    toast.className = 'k-toast';
    toast.dataset.state = options.state || 'info';
    toast.setAttribute('role', options.state === 'error' ? 'alert' : 'status');

    var text = document.createElement('div');
    text.className = 'k-toast__text';
    text.textContent = String(message || '');

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'k-toast__close';
    close.setAttribute('aria-label','Закрыть уведомление');
    close.textContent = '×';
    close.addEventListener('click', function(){ toast.remove(); });

    toast.appendChild(document.createElement('span'));
    toast.appendChild(text);
    toast.appendChild(close);
    region.appendChild(toast);

    window.setTimeout(function(){
      if(toast.isConnected) toast.remove();
    }, Number(options.duration || 4500));
    return toast;
  };

  API.setBusy = function(element, busy, label){
    if(!element) return;
    if(busy){
      if(!element.dataset.kOriginalLabel) element.dataset.kOriginalLabel = element.textContent.trim();
      element.setAttribute('aria-busy','true');
      element.disabled = true;
      if(label) element.textContent = label;
    }else{
      element.removeAttribute('aria-busy');
      element.disabled = false;
      if(element.dataset.kOriginalLabel){
        element.textContent = element.dataset.kOriginalLabel;
        delete element.dataset.kOriginalLabel;
      }
    }
  };

  API.announce = function(message, state){
    var region = document.getElementById('kreditor-announcer');
    if(!region){
      region = document.createElement('div');
      region.id = 'kreditor-announcer';
      region.className = 'sr-only';
      region.setAttribute('aria-live','polite');
      region.setAttribute('aria-atomic','true');
      document.body.appendChild(region);
    }
    region.textContent = '';
    window.setTimeout(function(){ region.textContent = String(message || ''); }, 20);
    if(state === 'error') region.setAttribute('role','alert');
    else region.removeAttribute('role');
  };

  function annotateCards(){
    qsa('.contact-card,.info-card,.solution-card,.audience-card,.article-card,.team-card,.faq-item,.thank-you-card').forEach(function(el){
      if(!el.dataset.kComponent) el.dataset.kComponent = 'card';
      if(el.matches('a,[role="button"]') || el.querySelector('a,button')) el.dataset.kInteractive = 'true';
    });
  }

  function annotateCTAs(){
    qsa('.btn,.header-cta,.desktop-sticky-main,.lead-channel-btn,.modal-contact-link').forEach(function(el){
      if(!el.dataset.kComponent) el.dataset.kComponent = 'cta';
    });
  }

  function annotateFields(){
    qsa('form').forEach(function(form){
      qsa('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]),textarea,select', form).forEach(function(control){
        var wrapper = control.closest('.form-field,.field,.form-group,label');
        if(wrapper && wrapper !== control) wrapper.dataset.kComponent = 'field';
      });
    });
  }

  function enhanceValidation(){
    qsa('form').forEach(function(form){
      form.addEventListener('submit', function(){
        qsa('input,textarea,select', form).forEach(function(control){
          if(control.willValidate) control.setAttribute('aria-invalid', control.validity.valid ? 'false' : 'true');
        });
      }, true);
      form.addEventListener('input', function(event){
        var control = event.target;
        if(control && control.willValidate && control.validity.valid) control.setAttribute('aria-invalid','false');
      });
      form.addEventListener('change', function(event){
        var control = event.target;
        if(control && control.willValidate && control.validity.valid) control.setAttribute('aria-invalid','false');
      });
    });
  }

  function enhanceLinks(){
    qsa('a[target="_blank"]').forEach(function(link){
      var rel = (link.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
      ['noopener','noreferrer'].forEach(function(token){ if(rel.indexOf(token) < 0) rel.push(token); });
      link.setAttribute('rel', rel.join(' '));
    });
  }

  function enhanceFooter(){
    qsa('.site-footer,.footer').forEach(function(footer){ footer.dataset.kComponent = 'footer'; });
  }

  function init(){
    annotateCards();
    annotateCTAs();
    annotateFields();
    enhanceValidation();
    enhanceLinks();
    enhanceFooter();
    document.documentElement.dataset.kComponents = 'ready';
    document.dispatchEvent(new CustomEvent('kreditor:components-ready'));
  }

  API.init = init;
  window.KreditorComponents = API;

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
