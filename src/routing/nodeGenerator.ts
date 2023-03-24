import { NodeInfo } from "azdata";
import { ExplorerSession } from "../session/explorerSession";

export type NodeGenerator = (refresh: boolean, path: string, session: ExplorerSession, parameters: RegExpMatchArray | null) => Promise<NodeInfo[]>;
