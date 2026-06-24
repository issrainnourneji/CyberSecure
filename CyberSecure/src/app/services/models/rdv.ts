import { RDVStatus } from "./rdvStatus";

export interface RDVDto {
  id: number;
  notes: string;
  status: string;
  rdvdate: string;   
  rdvtype?: RDVStatus;
  userName?: string;
  userEmail?: string;
}
