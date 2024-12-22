import { IApplication, IScore } from "../../../../interfaces";
declare function build(target: HTMLElement, application: IApplication, score: Partial<IScore>, cb: (v: number) => void): void;
declare const _default: {
    build: typeof build;
};
export default _default;
