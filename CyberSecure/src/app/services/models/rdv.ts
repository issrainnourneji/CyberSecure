import { RDVStatus } from "./rdvStatus";

export interface RDVDto {
  id: number;
  notes: string;
  status: string;
  rdvdate: string;   // ISO string
  rdvtype?: RDVStatus;
  userName?: string;  // optionnel pour user normal
  userEmail?: string; // optionnel pour user normal
}
