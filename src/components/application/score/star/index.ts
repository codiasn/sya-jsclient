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
  wrapper.classList.add("c-xya-application-star");
  wrapper.innerHTML = template;

  const content = wrapper.querySelector(".rating-group") as HTMLDivElement;

  let items = "";
  for (let i = 1; i <= application.max; i++) {
    items += `
      <label aria-label="star" class="rating__label" for="rating-${i}">
        <span class="rating__icon"></span>
      </label>
      <input
        class="rating__input"
        name="rating"
        id="rating-${i}"
        value="${i}"
        type="radio"
      />
    `;
  }

  function onChange(value: number) {
    cb(value);

    const i = wrapper.querySelector<HTMLInputElement>(
      `input[type="radio"][value="${value}"]`
    );
    if (i) i.checked = true;
  }

  content.innerHTML = items;

  const inputs = wrapper.querySelectorAll<HTMLInputElement>(
    'input[type="radio"]'
  );

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
