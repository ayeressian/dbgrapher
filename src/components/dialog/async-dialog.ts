// import { DBGElement } from "../dbg-element";
// type Constructor<T> = new (...args: unknown[]) => unknown & { prototype: T };

// interface Add<T> {
//   instance: T;
//   resultResolve: (result: boolean) => void;
//   result?: Promise<boolean>;
// }

// export default function asyncDialog<T extends Constructor, res>(
//   classTarget: T
// ): T & Add<T> {
//   const newTarget = classTarget as T & Add<T>;
//   newTarget.a = "static prop";
//   return newTarget;
// }

// export function getAsyncDialogClass<Result>(): Constructor {
//   abstract class AsyncDialog<Result> {
//     private static instance: AsyncDialog<Result>;
//     private static resultResolve: (result: boolean) => void;
//     private static result?: Promise<boolean>;
//   }
//   return AsyncDialog;
// }

// const m = new Map();

// abstract class AsyncDialog extends DBGElement {
//   constructor() {
//     super();
//     if (m.has(this.))
//       throw new Error(
//         "ConfirmationDialog is singlton. ConfirmationDialog instance already exist."
//       );
//     ConfirmationDialog.instance = this;
//   }
// }
