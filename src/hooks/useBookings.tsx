import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Booking {
  id: string;
  owner_id: string;
  caregiver_id: string;
  pet_id: string;
  service_type: string;
  start_date: string;
  end_date: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  total_amount: number;
  notes: string | null;
  owner_notes: string | null;
  caregiver_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  owner?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    phone: string | null;
  };
  caregiver?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    phone: string | null;
  };
  pet?: {
    id: string;
    name: string;
    pet_type: string;
    breed: string | null;
    photo_url: string | null;
  };
}

export interface CreateBookingData {
  caregiver_id: string;
  pet_id: string;
  service_type: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  notes?: string;
}

export const useBookings = () => {
  const { user, userRole } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch bookings based on role
      const query = supabase
        .from("bookings")
        .select(`
          *,
          owner:profiles!fk_bookings_owner(id, full_name, avatar_url, phone),
          caregiver:profiles!fk_bookings_caregiver(id, full_name, avatar_url, phone),
          pet:pets!fk_bookings_pet(id, name, pet_type, breed, photo_url)
        `)
        .order("start_date", { ascending: true });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setBookings(data as Booking[]);
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: CreateBookingData) => {
    if (!user) {
      toast.error("Please log in to create a booking");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          owner_id: user.id,
          caregiver_id: bookingData.caregiver_id,
          pet_id: bookingData.pet_id,
          service_type: bookingData.service_type,
          start_date: bookingData.start_date,
          end_date: bookingData.end_date,
          total_amount: bookingData.total_amount,
          notes: bookingData.notes || null,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Booking request sent successfully!");
      await fetchBookings();
      return data;
    } catch (err: any) {
      console.error("Error creating booking:", err);
      toast.error("Failed to create booking: " + err.message);
      return null;
    }
  };

  const updateBookingStatus = async (
    bookingId: string,
    status: Booking["status"],
    notes?: string
  ) => {
    try {
      const updateData: any = { status };
      
      if (notes) {
        if (userRole === "caregiver") {
          updateData.caregiver_notes = notes;
        } else {
          updateData.owner_notes = notes;
        }
      }

      const { error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", bookingId);

      if (error) throw error;

      const statusMessages: Record<Booking["status"], string> = {
        pending: "Booking marked as pending",
        confirmed: "Booking confirmed!",
        in_progress: "Booking started",
        completed: "Booking completed!",
        cancelled: "Booking cancelled",
      };

      toast.success(statusMessages[status]);
      await fetchBookings();
      return true;
    } catch (err: any) {
      console.error("Error updating booking:", err);
      toast.error("Failed to update booking: " + err.message);
      return false;
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingId);

      if (error) throw error;

      toast.success("Booking deleted");
      await fetchBookings();
      return true;
    } catch (err: any) {
      console.error("Error deleting booking:", err);
      toast.error("Failed to delete booking: " + err.message);
      return false;
    }
  };

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    fetchBookings();

    const channel = supabase
      .channel("bookings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Filter helpers
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const upcomingBookings = bookings.filter(
    (b) =>
      (b.status === "pending" || b.status === "confirmed") &&
      new Date(b.start_date) >= new Date()
  );
  const pastBookings = bookings.filter(
    (b) =>
      b.status === "completed" ||
      b.status === "cancelled" ||
      new Date(b.end_date) < new Date()
  );

  return {
    bookings,
    pendingBookings,
    confirmedBookings,
    upcomingBookings,
    pastBookings,
    loading,
    error,
    createBooking,
    updateBookingStatus,
    deleteBooking,
    refetch: fetchBookings,
  };
};
