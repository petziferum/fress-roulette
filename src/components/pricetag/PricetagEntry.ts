import { Timestamp } from "firebase/firestore";
import Pricetag from "@/components/pricetag/Pricetag";

export default class PricetagEntry {
  price: string;
  date: Timestamp;
  location: string;
  amount: string;

  constructor(
    price: string,
    date: Timestamp,
    location: string,
    amount: string
  ) {
    this.price = price;
    this.date = date;
    this.location = location;
    this.amount = amount;
  }
  withPrice(price: string): PricetagEntry {
    this.price = price;
    return this;
  }
  withDate(date: Timestamp): PricetagEntry {
    this.date = date;
    return this;
  }
  withDateFromDate(date: Date): PricetagEntry {
    this.date = Timestamp.fromDate(date);
    return this;
  }
  withLocation(location: string): PricetagEntry {
    this.location = location;
    return this;
  }
  withAmount(amount: string): PricetagEntry {
    this.amount = amount;
    return this;
  }
  static createEmptyPricetagEntry(): PricetagEntry {
    return new PricetagEntry("", Timestamp.now(), "", "");
  }
}
