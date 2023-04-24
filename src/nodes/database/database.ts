import { NodeCollection } from "../nodeCollection";
import { NodeItem } from "../nodeItem";
import { Table } from "../table/table";

export class Database implements NodeItem {
    oid: string;

    public tables: NodeCollection<Table>;
}