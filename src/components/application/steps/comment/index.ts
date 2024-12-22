import { Xya } from "../../../..";
import {
  IApplication,
  IApplicationStepComment,
  IScore,
} from "../../../../interfaces";

// @ts-ignore
import template from "./template.html";

function build(
  target: HTMLElement,
  options: {
    xya: Xya;
    score: Partial<IScore>;
    application: IApplication;
    index: number;
    buildActions: (wraper: HTMLElement, cb: () => void) => void;
  },
  cb: (v: string) => void
) {
  let comment = "";

  const wrapper = document.createElement("div");
  wrapper.classList.add("c-xya-step-comment");
  wrapper.innerHTML = template;

  target.appendChild(wrapper);

  const commentStep = options.application.steps?.length
    ? (options.application.steps[options.index] as IApplicationStepComment)
    : undefined;

  if (!commentStep || commentStep.code !== "comment") return;

  const textarea = wrapper.querySelector(
    ".c-xya-step-comment--container textarea"
  ) as HTMLTextAreaElement;

  if (textarea) {
    textarea.placeholder = commentStep.label;
    if (options.score.steps) {
      comment = textarea.value = options.score.steps[options.index] || "";
    }

    textarea.addEventListener("change", () => {
      comment = textarea.value;
    });
  }

  options.buildActions(wrapper, () => {
    if (commentStep?.required && !comment) return;
    cb(comment);
  });
}

export default { build };
