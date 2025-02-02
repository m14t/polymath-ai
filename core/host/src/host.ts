import { AskOptions, LibraryData, PackedLibraryData } from "@polymath-ai/types";
import { encodeEmbedding, fromFormData } from "./utils.js";

export abstract class PolymathHost {
  async ask(formData: FormData): Promise<PackedLibraryData> {
    const args = fromFormData(formData);
    return this.queryPacked(args);
  }

  async queryPacked(args: AskOptions): Promise<PackedLibraryData> {
    const results = await this.query(args);

    const packed: PackedLibraryData = {
      version: results.version,
      embedding_model: results.embedding_model,
      bits: results.bits.map((bit) => ({
        ...bit,
        embedding: encodeEmbedding(bit.embedding || []),
      })),
    };

    return packed;
  }

  abstract query(args: AskOptions): Promise<LibraryData>;
}
