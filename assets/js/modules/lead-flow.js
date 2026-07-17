(function (window, document) {
  "use strict";

  const contacts = window.KreditorConfig?.contacts || {};

  const CONFIG = {
    phone: contacts.phone || "+79777379737",
    phoneDigits: String(
      contacts.phoneDigits ||
      contacts.phone ||
      "79777379737"
    ).replace(/\D/g, ""),
    telegram: contacts.telegram || "ooo_kreditor",
    email: contacts.email || "kreditoro@bk.ru"
  };

  const forms = [...document.querySelectorAll("[data-lead-form]")];

  function analytics(event, channel = "") {
    try {
      const id = window.KREDITOR_ANALYTICS?.yandexMetrikaId;

      if (typeof window.ym === "function" && id) {
        window.ym(id, "reachGoal", event, {
          page: window.location.pathname,
          channel
        });
      }
    } catch (error) {
      void error;
    }
  }

  function normalizePhone(value) {
    return String(value || "").replace(/[^\d+]/g, "");
  }

  function validPhone(value) {
    return /^\+?\d{10,15}$/.test(
      normalizePhone(value).replace(/^8/, "7")
    );
  }

  function roleLabel(value) {
    return {
      "Бизнес": "Представитель организации"
    }[value] || value;
  }

  function buildMessage(form) {
    const data = Object.fromEntries(new FormData(form));

    return [
      "Здравствуйте! Обращение с сайта kreditor.pro",
      `Страница: ${window.location.href.split("?")[0]}`,
      data.name && `Имя: ${data.name}`,
      data.phone && `Телефон: ${data.phone}`,
      data.email && `Email: ${data.email}`,
      data.role && `Ваша роль: ${roleLabel(data.role)}`,
      data.message && `Ситуация: ${data.message}`
    ].filter(Boolean).join("\n");
  }

  function setStatus(form, text, type = "") {
    let status = form.querySelector(".form-status");

    if (!status) {
      status = document.createElement("p");
      status.className = "form-status";
      status.setAttribute("aria-live", "polite");
      form.append(status);
    }

    status.textContent = text;
    status.className = `form-status ${type}`.trim();
  }

  function validate(form) {
    const phone = form.elements.phone;

    if (phone && !validPhone(phone.value)) {
      phone.setCustomValidity("Укажите телефон: от 10 до 15 цифр.");
      phone.reportValidity();
      setStatus(form, "Проверьте номер телефона.", "error");
      return false;
    }

    phone?.setCustomValidity("");

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus(
        form,
        "Проверьте обязательные поля и согласие.",
        "error"
      );
      return false;
    }

    return true;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      void error;
      return false;
    }
  }

  function buildChannelBlock() {
    const block = document.createElement("div");

    block.className = "lead-channel-block";
    block.setAttribute("aria-hidden", "true");

    block.innerHTML = `
      <span class="lead-channel-title">
        Выберите удобный способ связи
      </span>

      <div
        class="lead-channel-actions"
        role="group"
        aria-label="Способ связи"
      >
        <button
          class="lead-channel-btn"
          type="button"
          data-channel="whatsapp"
        >
          <span class="lead-channel-icon">W</span>
          <span class="lead-channel-copy">
            WhatsApp
            <small>Подготовить сообщение</small>
          </span>
        </button>

        <button
          class="lead-channel-btn"
          type="button"
          data-channel="telegram"
        >
          <span class="lead-channel-icon">T</span>
          <span class="lead-channel-copy">
            Telegram
            <small>@ooo_kreditor</small>
          </span>
        </button>

        <button
          class="lead-channel-btn"
          type="button"
          data-channel="phone"
        >
          <span class="lead-channel-icon">☎</span>
          <span class="lead-channel-copy">
            Позвонить
            <small>+7 (977) 737-97-37</small>
          </span>
        </button>

        <button
          class="lead-channel-btn"
          type="button"
          data-channel="email"
        >
          <span class="lead-channel-icon">✉</span>
          <span class="lead-channel-copy">
            Email
            <small>kreditoro@bk.ru</small>
          </span>
        </button>
      </div>

      <p class="lead-channel-note">
        Отправка произойдёт только после вашего подтверждения.
      </p>
    `;

    return block;
  }

  function showWhatsAppConfirmation(form, message) {
    form.querySelector(".wa-ready")?.remove();

    const url =
      `https://web.whatsapp.com/send?phone=${CONFIG.phoneDigits}` +
      `&text=${encodeURIComponent(message)}`;

    const box = document.createElement("div");
    box.className = "wa-ready";
    box.setAttribute("role", "region");
    box.setAttribute("aria-label", "Сообщение для WhatsApp");

    const title = document.createElement("strong");
    title.className = "wa-ready__title";
    title.textContent = "Сообщение подготовлено";

    const description = document.createElement("p");
    description.textContent =
      "Сайт останется открытым. WhatsApp Web откроется только после нажатия кнопки.";

    const actions = document.createElement("div");
    actions.className = "wa-ready__actions";

    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "wa-ready__cancel";
    cancel.textContent = "Отмена";

    const open = document.createElement("a");
    open.className = "wa-ready__link";
    open.href = url;
    open.target = "_blank";
    open.rel = "noopener noreferrer";
    open.textContent = "Открыть WhatsApp Web";

    cancel.addEventListener("click", () => {
      box.remove();
    });

    open.addEventListener("click", () => {
      analytics("whatsapp_confirm_open", "whatsapp");
    });

    actions.append(cancel, open);
    box.append(title, description, actions);

    const channelBlock = form.querySelector(".lead-channel-block");
    (channelBlock || form).insertAdjacentElement("afterend", box);

    box.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

    open.focus({ preventScroll: true });
  }

  forms.forEach((form) => {
    const submit = form.querySelector('button[type="submit"]');

    if (!submit) {
      return;
    }

    submit.hidden = false;
    submit.removeAttribute("aria-hidden");
    submit.tabIndex = 0;
    submit.textContent = "Продолжить";
    submit.classList.add("lead-continue-btn");

    let block = form.querySelector(".lead-channel-block");

    if (!block) {
      block = buildChannelBlock();
      submit.insertAdjacentElement("afterend", block);
    } else {
      block.classList.remove("is-visible");
    }

    function reveal() {
      if (!validate(form)) {
        return false;
      }

      form.querySelector(".wa-ready")?.remove();

      block.classList.add("is-visible");
      block.setAttribute("aria-hidden", "false");

      submit.classList.add("is-complete");
      submit.textContent = "Выберите способ связи";

      setStatus(
        form,
        "Выберите один из четырёх способов связи.",
        "success"
      );

      block.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });

      block
        .querySelector(".lead-channel-btn")
        ?.focus({ preventScroll: true });

      analytics("lead_form_continue");

      return true;
    }

    form.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        reveal();
      },
      true
    );

    block.addEventListener("click", async (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const button = event.target.closest("[data-channel]");

      if (!button) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (!validate(form)) {
        return;
      }

      const channel = button.dataset.channel;
      const text = buildMessage(form);

      analytics("lead_channel_select", channel);

      if (channel === "whatsapp") {
        setStatus(
          form,
          "Сообщение подготовлено. Подтвердите открытие WhatsApp Web.",
          "success"
        );

        showWhatsAppConfirmation(form, text);
        return;
      }

      if (channel === "telegram") {
        const copied = await copyText(text);

        setStatus(
          form,
          copied
            ? "Текст скопирован. Открываем Telegram…"
            : "Открываем Telegram. Текст можно скопировать из формы.",
          "success"
        );

        window.open(
          `https://t.me/${CONFIG.telegram}`,
          "_blank",
          "noopener,noreferrer"
        );

        return;
      }

      if (channel === "phone") {
        setStatus(
          form,
          "Открываем приложение для звонка…",
          "success"
        );

        window.location.href = `tel:${CONFIG.phone}`;
        return;
      }

      if (channel === "email") {
        setStatus(
          form,
          "Открываем почтовое приложение…",
          "success"
        );

        window.location.href =
          `mailto:${CONFIG.email}` +
          `?subject=${encodeURIComponent("Обращение с сайта КРЕДИТОР")}` +
          `&body=${encodeURIComponent(text)}`;
      }
    });
  });

  document
    .querySelectorAll(".desktop-sticky-cta")
    .forEach((widget) => {
      const main = widget.querySelector(".desktop-sticky-main");

      function openLeadForm() {
        if (window.KreditorLeadModal?.open) {
          window.KreditorLeadModal.open();
        } else {
          const modal = document.querySelector("#lead-modal");

          if (
            modal &&
            !modal.open &&
            typeof modal.showModal === "function"
          ) {
            modal.showModal();
          }
        }

        analytics("sticky_open_form");
      }

      if (main) {
        main.textContent = "Обсудить ситуацию";
        main.classList.add("js-open-lead");
        main.setAttribute("data-open-modal", "");
      }

      widget
        .querySelectorAll("a,.kreditor-sticky-channel")
        .forEach((item) => item.remove());

      const phone = document.createElement("a");
      phone.className = "kreditor-sticky-channel";
      phone.href = `tel:${CONFIG.phone}`;
      phone.textContent = "☎";
      phone.setAttribute("aria-label", "Позвонить");

      const whatsapp = document.createElement("button");
      whatsapp.type = "button";
      whatsapp.className = "kreditor-sticky-channel";
      whatsapp.textContent = "W";
      whatsapp.setAttribute(
        "aria-label",
        "Открыть форму для WhatsApp"
      );

      const telegram = document.createElement("a");
      telegram.className = "kreditor-sticky-channel";
      telegram.href = `https://t.me/${CONFIG.telegram}`;
      telegram.target = "_blank";
      telegram.rel = "noopener noreferrer";
      telegram.textContent = "T";
      telegram.setAttribute(
        "aria-label",
        "Написать в Telegram"
      );

      const email = document.createElement("a");
      email.className = "kreditor-sticky-channel";
      email.href =
        `mailto:${CONFIG.email}` +
        `?subject=${encodeURIComponent("Обращение с сайта КРЕДИТОР")}`;
      email.textContent = "✉";
      email.setAttribute(
        "aria-label",
        "Написать по электронной почте"
      );

      whatsapp.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        openLeadForm();
      });

      phone.addEventListener("click", () => {
        analytics("sticky_contact_click", "phone");
      });

      telegram.addEventListener("click", () => {
        analytics("sticky_contact_click", "telegram");
      });

      email.addEventListener("click", () => {
        analytics("sticky_contact_click", "email");
      });

      widget.append(phone, whatsapp, telegram, email);
    });
})(window, document);
