import { Xya } from "../../..";
import { IApplication, IScore } from "../../../interfaces";
import cApplicationFace from "./face";
import cApplicationStar from "./star";

// @ts-ignore
import template from "./template.html";

function build(
  target: HTMLElement,
  options: { application: IApplication; score: Partial<IScore>; xya: Xya },
  cb: (v: number) => void
) {
  const components = {
    face: cApplicationFace,
    star: cApplicationStar,
  };

  // const wrapper = document.createElement("div");
  // wrapper.classList.add("c-xya-application-score");
  target.innerHTML = template;

  const container = target.querySelector(
    ".c-xya-application-score-container"
  ) as HTMLDivElement;

  let selectScore = 1;

  // ajouter la description
  if (options.application.description) {
    const desc = document.createElement("p");
    desc.innerHTML = options.application.description;
    desc.style.margin = "0";
    container.appendChild(desc);
  }

  const cmp = (options.application.component || "star") as "star";
  components[cmp].build(
    container,
    options.application,
    options.score,
    (v) => (selectScore = v)
  );

  const submitButton = target.querySelector(
    "button.c-xya-submit-btn"
  ) as HTMLButtonElement;

  submitButton.innerHTML = options.application.steps?.length
    ? options.xya._locales[options.xya.lang].next
    : options.xya._locales[options.xya.lang].submit;

  submitButton.addEventListener("click", () => {
    cb(selectScore);
  });

  //   container.appendChild(wrapper);
}

export default { build };
