import type PricetagEntry from "@/components/pricetag/PricetagEntry";
import { Timestamp } from "firebase/firestore";

export default class Pricetag {
  public productName: string;
  public description: string;
  public searchKeys: string[];
  public imageUrl: string;
  public entries: PricetagEntry[];

  constructor(
    productName: string,
    description: string,
    imageUrl: string,
    entries: PricetagEntry[]
  ) {
    this.productName = productName;
    this.description = description;
    this.imageUrl = imageUrl;
    this.entries = entries;
  }

  static generateSearchKeys(productName, description) {
    return [
      ...productName.toLowerCase().split(" "),
      ...description.toLowerCase().split(" "),
    ];
  }

  withSearchKeys(searchKeys: string[]): Pricetag {
    this.searchKeys = searchKeys;
    return this;
  }

  withProductName(productName: string): Pricetag {
    this.productName = productName;
    return this;
  }

  withDescription(description: string): Pricetag {
    this.description = description;
    return this;
  }

  withImageUrl(imageUrl: string): this {
    this.imageUrl = imageUrl;
    return this;
  }

  withEntries(entries: PricetagEntry[]): Pricetag {
    this.entries = entries;
    return this;
  }

  static createEmptyPricetag() {
    return new Pricetag("", "", "", []);
  }
}
export const pricetagConverter = {
  toFirestore: (pricetag: Pricetag) => {
    console.log("toFirestore converter gestartet", pricetag);
    return {
      productName: pricetag.productName,
      description: pricetag.description,
      imageUrl: pricetag.imageUrl,
      searchKeys: pricetag.searchKeys || [],
      entries: pricetag.entries.map((entry) => {
        return {
          price: entry.price ?? "",
          date: entry.date ?? Timestamp.now(),
          location: entry.location ?? "",
          amount: entry.amount ?? "",
        };
      }),
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return Pricetag.createEmptyPricetag()
      .withProductName(data.productName)
      .withDescription(data.description)
      .withImageUrl(data.imageUrl)
      .withSearchKeys(data.searchKeys)
      .withEntries(data.entries);
  },
};
