import { format } from "date-fns";
import { 
  Calendar, 
  Clock, 
  PawPrint, 
  User, 
  Check, 
  X, 
  MessageCircle,
  MapPin 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Booking } from "@/hooks/useBookings";
import { cn } from "@/lib/utils";

interface BookingCardProps {
  booking: Booking;
  userType: "owner" | "caregiver";
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
  onMessage?: (id: string) => void;
}

const statusStyles = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  completed: "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function BookingCard({
  booking,
  userType,
  onAccept,
  onDecline,
  onCancel,
  onComplete,
  onMessage,
}: BookingCardProps) {
  const otherPerson = userType === "owner" ? booking.caregiver : booking.owner;
  const displayName = otherPerson?.full_name || "Unknown";
  const avatarUrl = otherPerson?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

  const startDate = new Date(booking.start_date);
  const isUpcoming = startDate > new Date();
  const isPending = booking.status === "pending";
  const isConfirmed = booking.status === "confirmed";

  return (
    <div className="p-4 bg-muted/50 rounded-xl">
      <div className="flex items-start gap-4 mb-4">
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-12 h-12 rounded-xl object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold truncate">{displayName}</p>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium shrink-0",
                statusStyles[booking.status]
              )}
            >
              {statusLabels[booking.status]}
            </span>
          </div>
          
          {booking.pet && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <PawPrint className="w-3 h-3" />
              <span>
                {booking.pet.name} ({booking.pet.pet_type}
                {booking.pet.breed ? `, ${booking.pet.breed}` : ""})
              </span>
            </div>
          )}

          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {booking.service_type}
            </span>
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(startDate, "MMM d, yyyy")}
            </span>
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(startDate, "h:mm a")}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-primary">₹{booking.total_amount}</p>
        </div>
      </div>

      {/* Notes */}
      {booking.notes && (
        <p className="text-sm text-muted-foreground mb-4 bg-background/50 p-2 rounded-lg">
          <span className="font-medium">Notes:</span> {booking.notes}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {/* Caregiver actions for pending bookings */}
        {userType === "caregiver" && isPending && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 gap-1"
              onClick={() => onAccept?.(booking.id)}
            >
              <Check className="w-4 h-4" />
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1"
              onClick={() => onDecline?.(booking.id)}
            >
              <X className="w-4 h-4" />
              Decline
            </Button>
          </>
        )}

        {/* Caregiver actions for confirmed bookings */}
        {userType === "caregiver" && isConfirmed && (
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 gap-1"
            onClick={() => onComplete?.(booking.id)}
          >
            <Check className="w-4 h-4" />
            Mark Complete
          </Button>
        )}

        {/* Owner actions for pending/confirmed bookings */}
        {userType === "owner" && (isPending || isConfirmed) && isUpcoming && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => onCancel?.(booking.id)}
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
        )}

        {/* Message button for both */}
        {onMessage && (booking.status === "pending" || booking.status === "confirmed") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMessage?.(booking.id)}
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
