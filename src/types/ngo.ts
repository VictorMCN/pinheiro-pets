export type Ngo = {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  administrative_region: string;
  address: string | null;
  phone: string;
  email: string | null;
  instagram: string | null;
  pix_key: string | null;
  logo_url: string | null;
  logo_path: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
  updated_at: string;
};