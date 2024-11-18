import type { Timestamp } from "firebase/firestore";

export default class PricetagEntry {
  price: "";
  date: Timestamp;
  location: "";
}
