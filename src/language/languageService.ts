import { type DidChangeLanguageFlavorParams } from "azdata";

export class LanguageService {
    private readonly validLanguages = new Set<string>();

    public addLanguageFlavor(params: DidChangeLanguageFlavorParams): void {
        if (params == null || params.uri == null || params.language.toLowerCase() !== "sql") {
            return;
        }

        if (params.flavor === "regress") {
            this.validLanguages.add(params.uri);
        } else {
            this.validLanguages.delete(params.uri);
        }
    }
}
