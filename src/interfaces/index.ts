export interface IBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClient extends IBase {
  name: string;
  description?: string;
}

export interface IProfile extends IBase {
  profile: "agent" | "owner" | "admin";
  client: IClient;
}

export interface IUser extends IBase {
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * The `IApplication` interface represents an object designed to collect
 * ratings or evaluations about a product, service, or any other element.
 * This object is structured to manage all necessary information
 * for gathering feedback, including customizable steps to guide users
 * through the evaluation process. It also allows the definition of optional
 * parameters such as metadata and a confirmation message after submission.
 */
export interface IApplication extends IBase {
  logo?: IFyle | null;
  name: string;
  description?: string;
  component?: string;
  once?: boolean;
  close?: boolean;

  /**
   * Custom metadata that can hold additional information
   * as key-value pairs.
   */
  metadata?: { [key: string]: any };

  /**
   * @default 5
   * The maximum score the application can take
   */
  max: number;

  /** Message to display after submitting the score */
  message: string;

  steps?: (IApplicationStepChoice | IApplicationStepComment)[];
}
export interface IApplicationStep {
  /**
   * Condition for displaying the step or not.
   * ex: score(<5)
   * */
  condition?: string;
  required?: boolean;
}

export interface IApplicationStepChoice extends IApplicationStep {
  code: "choice";
  options: string[];
  multiple?: boolean;
}

export interface IApplicationStepComment extends IApplicationStep {
  code: "comment";
  label: string;
}

export interface IFyle {
  name: string;
  type: string;
  size: number;
  /** base64 - **ex.**: "data:image/jpeg;base64,/9j/4AAQSkZJRgA...." */
  content: string;
}

export interface IScore extends IBase {
  score: number;
  steps?: { [x: string]: any };
  application: IApplication;
  metadata: { [key: string]: any };
}
