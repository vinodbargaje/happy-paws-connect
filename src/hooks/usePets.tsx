import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  pet_type: string;
  breed: string | null;
  age: number | null;
  sex: string | null;
  weight: number | null;
  photo_url: string | null;
  special_needs: string | null;
  medical_conditions: string | null;
  vaccination_status: string | null;
  temperament: string | null;
  feeding_schedule: string | null;
  behavior_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePetData {
  name: string;
  pet_type: string;
  breed?: string;
  age?: number;
  sex?: string;
  weight?: number;
  special_needs?: string;
  medical_conditions?: string;
  vaccination_status?: string;
  temperament?: string;
  feeding_schedule?: string;
  behavior_notes?: string;
}

export const usePets = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = async () => {
    if (!user) {
      setPets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("pets")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setPets(data as Pet[]);
    } catch (err: any) {
      console.error("Error fetching pets:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPet = async (petData: CreatePetData) => {
    if (!user) {
      toast.error("Please log in to add a pet");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("pets")
        .insert({
          owner_id: user.id,
          name: petData.name,
          pet_type: petData.pet_type,
          breed: petData.breed || null,
          age: petData.age || null,
          sex: petData.sex || null,
          weight: petData.weight || null,
          special_needs: petData.special_needs || null,
          medical_conditions: petData.medical_conditions || null,
          vaccination_status: petData.vaccination_status || null,
          temperament: petData.temperament || null,
          feeding_schedule: petData.feeding_schedule || null,
          behavior_notes: petData.behavior_notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Pet added successfully!");
      await fetchPets();
      return data;
    } catch (err: any) {
      console.error("Error creating pet:", err);
      toast.error("Failed to add pet: " + err.message);
      return null;
    }
  };

  const updatePet = async (petId: string, petData: Partial<CreatePetData>) => {
    try {
      const { error } = await supabase
        .from("pets")
        .update(petData)
        .eq("id", petId);

      if (error) throw error;

      toast.success("Pet updated successfully!");
      await fetchPets();
      return true;
    } catch (err: any) {
      console.error("Error updating pet:", err);
      toast.error("Failed to update pet: " + err.message);
      return false;
    }
  };

  const deletePet = async (petId: string) => {
    try {
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", petId);

      if (error) throw error;

      toast.success("Pet removed");
      await fetchPets();
      return true;
    } catch (err: any) {
      console.error("Error deleting pet:", err);
      toast.error("Failed to remove pet: " + err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchPets();
  }, [user]);

  return {
    pets,
    loading,
    error,
    createPet,
    updatePet,
    deletePet,
    refetch: fetchPets,
  };
};
