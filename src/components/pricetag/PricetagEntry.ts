import { Timestamp } from "firebase/firestore";
import Pricetag from "@/components/pricetag/Pricetag";
import { format } from "date-fns";

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

  getFormattedDate(formatString: string = 'dd.MM.yyyy'): string {
    try {
      // Wenn date eine Timestamp-Instanz ist
      if (this.date instanceof Timestamp) {
        return format(this.date.toDate(), formatString);
      }

      // Wenn date ein Plain Object ist (aus Firebase)
      if (
        this.date &&
        typeof this.date === "object" &&
        "seconds" in this.date
      ) {
        const date = new Date((this.date as any).seconds * 1000);
        return format(date, formatString);
      }

      return '-';
    } catch (error) {
      console.error('Fehler beim Formatieren des Datums:', error);
      return '-';
    }
  }

  static formatTimestamp(timestamp: Timestamp | any, formatString: string = 'dd.MM.yyyy'): string {
    try {
      if (timestamp instanceof Timestamp) {
        return format(timestamp.toDate(), formatString);
      }

      if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
        const date = new Date(timestamp.seconds * 1000);
        return format(date, formatString);
      }

      return '-';
    } catch (error) {
      console.error('Fehler beim Formatieren des Timestamps:', error);
      return '-';
    }
  }
}
