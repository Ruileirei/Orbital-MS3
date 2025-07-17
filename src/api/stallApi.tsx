import { getStallDoc } from "@/services/firestoreService";

export async function fetchStallData(id: string): Promise<any | null> {
  if (!id) 
    return null;

  try {
    const docRes = await getStallDoc(id);

    if (docRes.exists()) {
      return docRes.data() as any;
    } else {
      console.warn("No such stall");
      return null;
    }
  } catch (error) {
    console.error("Error fetching stall data:", error);
    throw error;
  }
}