import {initializeHTML} from "./front-end";
import { BackEnd } from "./back-end";

let backEnd = new BackEnd();
initializeHTML();

export { backEnd };
