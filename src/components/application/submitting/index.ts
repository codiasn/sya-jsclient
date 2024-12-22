import { Xya, XyaApplicationComponentOptions } from "../../..";
import { IApplication, IScore } from "../../../interfaces";

// @ts-ignore
import template from "./template.html";

function build(
  target: HTMLElement,
  options: {
    options: XyaApplicationComponentOptions;
    application: IApplication;
    score: Partial<IScore>;
    xya: Xya;
    restart: () => void;
  },
  cb: (score: IScore) => void
) {
  target.innerHTML = template;

  submit();

  async function submit() {
    const success = target.querySelector(
      ".c-xya-application-submitting .c-xya-application-submitting--success .message"
    );
    if (success) {
      success.innerHTML =
        options.xya._locales[options.xya.lang]["application.message.success"];
    }

    const error = target.querySelector(
      ".c-xya-application-submitting .c-xya-application-submitting--error .message"
    );
    if (error) {
      error.innerHTML =
        options.xya._locales[options.xya.lang]["application.message.error"];
    }

    try {
      const score = await options.xya.score.add(
        options.application.id,
        options.score
      );

      target
        .querySelector(".c-xya-application-submitting")
        ?.classList.add("success");

      cb(score);
    } catch (error) {
      target
        .querySelector(".c-xya-application-submitting")
        ?.classList.add("error");

      const btn = target.querySelector(
        ".c-xya-application-submitting--error .restart-btn"
      ) as HTMLButtonElement;

      btn.textContent = options.xya._locales[options.xya.lang].restart;

      btn.addEventListener("click", () => options.restart());
    }
  }
}

export default { build };
