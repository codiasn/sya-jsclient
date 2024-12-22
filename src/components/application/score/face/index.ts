import { IApplication, IScore } from "../../../../interfaces";

// @ts-ignore
import template from "./template.html";

function build(
  target: HTMLElement,
  application: IApplication,
  score: Partial<IScore>,
  cb: (v: number) => void
) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("c-xya-application-face");
  wrapper.innerHTML = template;

  const inputs = wrapper.querySelectorAll<HTMLInputElement>(
    'input[type="radio"]'
  );

  if (application.max === 3) {
    inputs.item(2).value = "2";
    inputs.item(4).value = "3";

    wrapper.querySelector(".sad")?.remove();
    wrapper.querySelector(".good")?.remove();
  } else if (application.max === 2) {
    inputs.item(4).value = "2";

    wrapper.querySelector(".sad")?.remove();
    wrapper.querySelector(".ok")?.remove();
    wrapper.querySelector(".good")?.remove();
  }

  function onChange(value: number) {
    cb(value);

    const i = wrapper.querySelector<HTMLInputElement>(
      `input[type="radio"][value="${value}"]`
    );
    if (i) i.checked = true;
  }

  inputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      const v = (e.target as HTMLInputElement).value;
      onChange(parseInt(v));
    });
  });

  onChange(score.score || 1);

  target.appendChild(wrapper);
}

export default { build };
