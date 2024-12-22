import { Xya } from "../../..";
import { IApplication, IScore } from "../../../interfaces";
declare function build(target: HTMLElement, options: {
    application: IApplication;
    score: Partial<IScore>;
    xya: Xya;
}, cb: (v: number) => void): void;
declare const _default: {
    build: typeof build;
};
export default _default;
