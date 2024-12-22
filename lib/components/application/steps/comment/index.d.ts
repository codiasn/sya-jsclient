import { Xya } from "../../../..";
import { IApplication, IScore } from "../../../../interfaces";
declare function build(target: HTMLElement, options: {
    xya: Xya;
    score: Partial<IScore>;
    application: IApplication;
    index: number;
    buildActions: (wraper: HTMLElement, cb: () => void) => void;
}, cb: (v: string) => void): void;
declare const _default: {
    build: typeof build;
};
export default _default;
