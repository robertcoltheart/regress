export interface IDatabaseInfo {
    oid?: number;
    name?: string;
    spcname?: string;
    dataallowconn?: boolean;
    cancreate?: boolean;
    owner?: number;
    canconnect?: boolean;
    is_system?: boolean;
}

export type DatabaseInfo = {
    oid: number;
    name: string;
};
