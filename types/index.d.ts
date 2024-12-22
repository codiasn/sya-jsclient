import { Xya } from "../src";

declare module "*.html" {
  const value: string;
  export default value;
}

declare global {
  // Déclare la classe globale Xya

  // Déclare une variable globale

  // Déclare des objets globaux pour les environnements navigateur et Node.js
  interface Window {
    Xya: typeof Xya;
  }

  namespace NodeJS {
    interface Global {
      Xya: typeof Xya;
    }
  }
}

export {};
