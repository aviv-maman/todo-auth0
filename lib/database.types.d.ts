// export interface TodoData {
//   id: string;
//   todo: string;
//   status: boolean;
// }

export interface TodoData {
  [key: string]: {
    todo: string;
    status: boolean;
  };
}
