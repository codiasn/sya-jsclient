import { Xya, XyaApplicationComponentOptions } from "../../..";
import { IApplication, IScore } from "../../../interfaces";
declare function build(target: HTMLElement, options: {
    options: XyaApplicationComponentOptions;
    application: IApplication;
    score: Partial<IScore>;
    xya: Xya;
    restart: () => void;
}, cb: (score: IScore) => void): void;
declare const _default: {
    build: typeof build;
};
export default _default;
