import { Xya } from "../../..";
import { IApplication, IScore } from "../../../interfaces";
declare function build(target: HTMLElement, options: {
    xya: Xya;
    score: Partial<IScore>;
    application: IApplication;
    restart: () => void;
}, cb: (v: {
    [x: string]: any;
}) => void): void;
declare const _default: {
    build: typeof build;
};
export default _default;
