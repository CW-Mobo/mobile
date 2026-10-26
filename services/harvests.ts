import api from "../config/api";

export type Harvest = {
  _id: string;
  harvestedQuantity: number;
  quality?: number;
  harvestDate: string;
  harvestDuration?: string | number;
  planting?: { plantingName?: string } | string;
};

export async function fetchHarvests(page = 1, limit = 20): Promise<Harvest[]> {
  const response = await api.get("/harvests/paginated", {
    params: { page, limit },
  });
  return response.data.harvests ?? [];
}

export async function fetchAllHarvests(): Promise<Harvest[]> {
  const response = await api.get<{ harvests?: Harvest[] }>('/harvests');
  return response.data.harvests ?? [];
}
