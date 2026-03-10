

import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/lib/supabase";
import { Household } from "../_types/householdTypes";


const supabase = createSupabaseClient();

export const fetchHouseholds = async (): Promise<Household[]> => {
  const { data, error } = await supabase
    .from("households")
    .select("*")
    .order("household_id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Household[];
};

export const fetchHouseholdById = async (id: string): Promise<Household | null> => {
  const { data, error } = await supabase
    .from("households")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // No rows returned
    }
    throw new Error(error.message);
  }

  return data as Household;
};

export const fetchHouseholdsByVillage = async (villageId: number): Promise<Household[]> => {
  const { data, error } = await supabase
    .from("households")
    .select("*")
    .eq("village_id", villageId)
    .order("household_id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Household[];
};

export const fetchHouseholdsByPriority = async (priorityLevel: string): Promise<Household[]> => {
  const { data, error } = await supabase
    .from("households")
    .select("*")
    .eq("priority_level", priorityLevel)
    .order("hunger_probability", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Household[];
};

// React Query hooks
export const useHouseholds = () => {
  return useQuery({
    queryKey: ["households"],
    queryFn: fetchHouseholds,
  });
};

export const useHouseholdById = (id: string) => {
  return useQuery({
    queryKey: ["household", id],
    queryFn: () => fetchHouseholdById(id),
    enabled: !!id,
  });
};

export const useHouseholdsByVillage = (villageId: number) => {
  return useQuery({
    queryKey: ["households", "village", villageId],
    queryFn: () => fetchHouseholdsByVillage(villageId),
    enabled: !!villageId,
  });
};

export const useHouseholdsByPriority = (priorityLevel: string) => {
  return useQuery({
    queryKey: ["households", "priority", priorityLevel],
    queryFn: () => fetchHouseholdsByPriority(priorityLevel),
    enabled: !!priorityLevel,
  });
};
