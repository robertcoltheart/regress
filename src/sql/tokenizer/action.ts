import { type ActionContext } from "./actionContext";
import { type Rule } from "./rule";

export type Action = (ctx: ActionContext, match: RegExpExecArray, rule: Rule) => void;
