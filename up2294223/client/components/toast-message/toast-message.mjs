import { ShadowElement } from "../../shadow-element.mjs";

const icons = {
  success:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
  error:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
  warning:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  info: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
};
const titles = {
  info: "Information",
  warning: "Warning",
  error: "Error",
  success: "Success",
};

class ToastMessage extends ShadowElement {
  async connectedCallback() {
    const templateURL = import.meta.url.replace(".mjs", ".html");
    await this.loadTemplate(templateURL);

    this.addEventListener("show-toast", ({ detail }) => {
      this.showToast(
        detail.type,
        detail.title,
        detail.message,
        detail.duration
      );
    });
  }

  showToast(type = "info", title = "", message = "", duration = 5000) {
    const toast = this.shadow.getElementById("toast");
    const toastIcon = toast.querySelector(".icon");
    const toastTitle = toast.querySelector(".title");
    const toastMessage = toast.querySelector(".message");
    const progressBar = toast.querySelector(".progress");

    toast.className = `toast ${type}`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(icons[type], "image/svg+xml");
    const svgElement = svgDoc.documentElement;
    toastTitle.textContent = title || `${titles[type]}!`;
    toastMessage.textContent = message;
    toastIcon.replaceChildren(svgElement);

    progressBar.style.animation = `progress ${
      duration / 1000
    }s linear forwards`;

    const closeButton = toast.querySelector(".close");
    closeButton.addEventListener("click", () => {
      this.removeToast(toast);
    });

    const timeoutId = setTimeout(() => {
      this.removeToast(toast);
    }, duration);

    toast.timeoutId = timeoutId;
    toast.classList.remove("hide");
    toast.classList.add("show");
  }

  removeToast(toast) {
    if (toast.timeoutId) {
      clearTimeout(toast.timeoutId);
    }

    toast.classList.add("hide");
    toast.classList.remove("show");
  }
}

customElements.define("toast-message", ToastMessage);
