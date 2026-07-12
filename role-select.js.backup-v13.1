"use strict";

(() => {
  const SELECTOR = '.contact-form select[name="role"]';
  const STYLE_ID = "kreditor-role-choice-v10-styles";
  const selects = document.querySelectorAll(SELECTOR);
  if (!selects.length) return;

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .krc-native {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0 0 0 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }

      .krc {
        --krc-ink: var(--ink, #07172a);
        --krc-gold: var(--gold, #c49a43);
        --krc-line: var(--line, #d9dde3);
        width: 100%;
        margin-top: 10px;
        font-family: Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .krc__grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      .krc__option {
        position: relative;
        display: flex;
        align-items: center;
        min-height: 62px;
        width: 100%;
        padding: 16px 58px 16px 24px;
        border: 1px solid var(--krc-line);
        border-radius: 13px;
        background: #fff;
        color: var(--krc-ink);
        font: 600 15px/1.35 Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        text-align: left;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        box-shadow: 0 1px 2px rgba(7, 23, 42, .025);
        transition:
          border-color .16s ease,
          background-color .16s ease,
          box-shadow .16s ease,
          transform .16s ease;
      }

      .krc__option:last-child:nth-child(odd) {
        grid-column: 1 / -1;
      }

      .krc__option:hover {
        border-color: rgba(196, 154, 67, .72);
        background: #fcf8ef;
        box-shadow: 0 8px 20px rgba(7, 23, 42, .05);
        transform: translateY(-1px);
      }

      .krc__option:focus-visible {
        outline: none;
        border-color: var(--krc-gold);
        box-shadow: 0 0 0 4px rgba(196, 154, 67, .14);
      }

      .krc__option[aria-checked="true"] {
        border: 1px solid var(--krc-gold);
        background: #fffdf9;
        box-shadow: 0 8px 22px rgba(196, 154, 67, .09);
      }

      .krc__label {
        min-width: 0;
      }

      .krc__check {
        position: absolute;
        right: 24px;
        top: 50%;
        width: 14px;
        height: 8px;
        border-left: 2px solid #8c6b2e;
        border-bottom: 2px solid #8c6b2e;
        opacity: 0;
        transform: translateY(-78%) rotate(-45deg) scale(.72);
        transition: opacity .16s ease, transform .16s ease;
      }

      .krc__option[aria-checked="true"] .krc__check {
        opacity: 1;
        transform: translateY(-78%) rotate(-45deg) scale(1);
      }

      .krc__option:disabled {
        opacity: .48;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      @media (max-width: 720px) {
        .krc__grid { grid-template-columns: 1fr; }
        .krc__option,
        .krc__option:last-child:nth-child(odd) { grid-column: auto; }
        .krc__option { min-height: 60px; font-size: 16px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .krc__option,
        .krc__check { transition: none !important; }
      }
    `;
    document.head.appendChild(style);
  }

  class RoleChoice {
    constructor(select, instanceIndex) {
      this.select = select;
      this.options = Array.from(select.options);
      this.name = `${select.name || "role"}-visual-${instanceIndex + 1}`;
      this.build();
      this.bind();
      this.render();
    }

    displayLabel(option) {
      const text = option.textContent.trim();
      return text === "Бизнес" ? "Представитель организации" : text;
    }

    build() {
      this.select.classList.add("krc-native");
      this.select.dataset.customized = "v10";
      this.select.setAttribute("aria-hidden", "true");
      this.select.tabIndex = -1;

      this.root = document.createElement("div");
      this.root.className = "krc";
      this.root.setAttribute("role", "radiogroup");

      const externalLabel = this.select.closest("label") || this.select.previousElementSibling;
      const labelText = externalLabel?.textContent?.trim();
      this.root.setAttribute("aria-label", labelText || "Ваша роль");

      this.grid = document.createElement("div");
      this.grid.className = "krc__grid";

      this.buttons = this.options.map((option, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "krc__option";
        button.setAttribute("role", "radio");
        button.setAttribute("aria-checked", "false");
        button.dataset.index = String(index);
        button.disabled = Boolean(option.disabled);

        const text = document.createElement("span");
        text.className = "krc__label";
        text.textContent = this.displayLabel(option);

        const check = document.createElement("span");
        check.className = "krc__check";
        check.setAttribute("aria-hidden", "true");

        button.append(text, check);
        this.grid.appendChild(button);
        return button;
      });

      this.root.appendChild(this.grid);
      this.select.insertAdjacentElement("afterend", this.root);
    }

    bind() {
      this.buttons.forEach((button, index) => {
        button.addEventListener("click", () => this.choose(index));
        button.addEventListener("keydown", (event) => this.onKeydown(event, index));
      });
      this.select.addEventListener("change", () => this.render());
    }

    choose(index, focus = false) {
      const option = this.options[index];
      if (!option || option.disabled) return;
      this.select.selectedIndex = index;
      this.select.dispatchEvent(new Event("change", { bubbles: true }));
      this.render();
      if (focus) this.buttons[index]?.focus();
    }

    enabledIndexes() {
      return this.options
        .map((option, index) => (!option.disabled ? index : -1))
        .filter((index) => index >= 0);
    }

    onKeydown(event, currentIndex) {
      if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const enabled = this.enabledIndexes();
      if (!enabled.length) return;

      let nextIndex = currentIndex;
      const position = enabled.indexOf(currentIndex);
      if (event.key === "Home") nextIndex = enabled[0];
      else if (event.key === "End") nextIndex = enabled[enabled.length - 1];
      else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = enabled[(Math.max(position, 0) + 1) % enabled.length];
      } else {
        nextIndex = enabled[(Math.max(position, 0) - 1 + enabled.length) % enabled.length];
      }
      this.choose(nextIndex, true);
    }

    render() {
      const selectedIndex = Math.max(0, this.select.selectedIndex);
      this.buttons.forEach((button, index) => {
        const selected = index === selectedIndex;
        button.setAttribute("aria-checked", String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
    }
  }

  selects.forEach((select, index) => {
    if (select.dataset.customized === "v7") return;
    new RoleChoice(select, index);
  });
})();
