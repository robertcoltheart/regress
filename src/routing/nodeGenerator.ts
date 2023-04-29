import { type NodeInfo } from "azdata";
import { type ObjectExplorerSession } from "./objectExplorerSession";

export type NodeGenerator = (
    refresh: boolean,
    path: string,
    session: ObjectExplorerSession,
    parameters: RegExpMatchArray | null
) => Promise<NodeInfo[]>;
