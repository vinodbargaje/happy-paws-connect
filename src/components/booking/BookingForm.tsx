import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePets } from "@/hooks/usePets";
import { useBookings, CreateBookingData } from "@/hooks/useBookings";
import { cn } from "@/lib/utils";

interface Service {
  name: string;
  price: number;
  duration: string;
}

interface BookingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caregiverId: string;
  caregiverName: string;
  services: Service[];
}

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", 
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

export function BookingForm({
  open,
  onOpenChange,
  caregiverId,
  caregiverName,
  services,
}: BookingFormProps) {
  const { pets, loading: petsLoading } = usePets();
  const { createBooking } = useBookings();
  
  const [selectedService, setSelectedService] = useState<Service | null>(
    services.length > 0 ? services[0] : null
  );
  const [selectedPet, setSelectedPet] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (services.length > 0 && !selectedService) {
      setSelectedService(services[0]);
    }
  }, [services]);

  useEffect(() => {
    if (pets.length > 0 && !selectedPet) {
      setSelectedPet(pets[0].id);
    }
  }, [pets]);

  const handleSubmit = async () => {
    if (!selectedService || !selectedPet || !selectedDate || !selectedTime) {
      return;
    }

    setSubmitting(true);

    // Create start and end dates
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startDate = new Date(selectedDate);
    startDate.setHours(hours, minutes, 0, 0);

    // End date based on duration (default 1 hour)
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    const bookingData: CreateBookingData = {
      caregiver_id: caregiverId,
      pet_id: selectedPet,
      service_type: selectedService.name,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      total_amount: selectedService.price,
      notes: notes || undefined,
    };

    const result = await createBooking(bookingData);
    setSubmitting(false);

    if (result) {
      onOpenChange(false);
      // Reset form
      setNotes("");
      setSelectedDate(undefined);
      setSelectedTime("");
    }
  };

  const isFormValid =
    selectedService && selectedPet && selectedDate && selectedTime;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book {caregiverName}</DialogTitle>
          <DialogDescription>
            Fill in the details below to request a booking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Service Selection */}
          <div className="space-y-2">
            <Label>Service</Label>
            <div className="grid grid-cols-1 gap-2">
              {services.map((service) => (
                <div
                  key={service.name}
                  onClick={() => setSelectedService(service)}
                  className={cn(
                    "p-3 rounded-xl border-2 cursor-pointer transition-all",
                    selectedService?.name === service.name
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.duration}
                      </p>
                    </div>
                    <p className="font-bold text-primary">₹{service.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pet Selection */}
          <div className="space-y-2">
            <Label>Select Pet</Label>
            {petsLoading ? (
              <div className="h-10 bg-muted animate-pulse rounded-lg" />
            ) : pets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No pets found. Please add a pet first.
              </p>
            ) : (
              <Select value={selectedPet} onValueChange={setSelectedPet}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a pet" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      <div className="flex items-center gap-2">
                        <PawPrint className="w-4 h-4" />
                        <span>{pet.name}</span>
                        <span className="text-muted-foreground">
                          ({pet.pet_type}
                          {pet.breed ? `, ${pet.breed}` : ""})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label>Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select a time">
                  {selectedTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{selectedTime}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Special Instructions (Optional)</Label>
            <Textarea
              placeholder="Any special instructions for the caregiver..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Summary */}
          {isFormValid && selectedService && (
            <div className="p-4 bg-muted/50 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total</span>
                <span className="text-xl font-bold text-primary">
                  ₹{selectedService.price}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || submitting || pets.length === 0}
            className="flex-1"
          >
            {submitting ? "Sending..." : "Request Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
