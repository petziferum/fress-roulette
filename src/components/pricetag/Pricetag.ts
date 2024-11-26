import type PricetagEntry from "@/components/pricetag/PricetagEntry";

export default class Pricetag {
  public productName: string;
  public description: string;
  public entries: PricetagEntry[];
  constructor(
    productName: string,
    description: string,
    entries: PricetagEntry[]
  ) {
    this.productName = productName;
    this.description = description;
    this.entries = entries;
  }
}
