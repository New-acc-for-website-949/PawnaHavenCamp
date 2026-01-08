import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Users, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  propertyName: string;
  pricePerPerson: number;
  onClose?: () => void;
}

export function BookingForm({ propertyName, pricePerPerson, onClose }: BookingFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    persons: 1,
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
  });

  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);

  const [totalPrice, setTotalPrice] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);

  useEffect(() => {
    const total = formData.persons * pricePerPerson;
    setTotalPrice(total);
    setAdvanceAmount(Math.round(total * 0.3)); // 30% advance
  }, [formData.persons, pricePerPerson]);

  const handleBook = () => {
    if (!formData.name || !formData.mobile || !formData.checkIn || !formData.checkOut) {
      alert("Please fill all details");
      return;
    }

    if (onClose) onClose();
    
    // Navigate to demo payment page with state
    navigate("/payment/demo", { 
      state: { 
        bookingData: {
          ...formData,
          propertyTitle: propertyName,
          checkIn: format(formData.checkIn, "PPP"),
          checkOut: format(formData.checkOut, "PPP"),
          totalPrice,
          advanceAmount
        },
        amount: advanceAmount.toString()
      } 
    });
  };

  return (
    <div className="space-y-4 py-0 pb-20 md:pb-0">
      <div className="grid gap-4 max-h-[60vh] md:max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            placeholder="Enter your name" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input 
            id="mobile" 
            type="tel"
            inputMode="tel"
            placeholder="Enter mobile number" 
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Check-in</Label>
            <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !formData.checkIn && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.checkIn ? format(formData.checkIn, "MMM d, yyyy") : <span>Pick date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.checkIn}
                  onSelect={(date) => {
                    setFormData({ ...formData, checkIn: date });
                    setIsCheckInOpen(false);
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label>Check-out</Label>
            <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !formData.checkOut && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.checkOut ? format(formData.checkOut, "MMM d, yyyy") : <span>Pick date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.checkOut}
                  onSelect={(date) => {
                    setFormData({ ...formData, checkOut: date });
                    setIsCheckOutOpen(false);
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="persons">Number of Persons</Label>
          <div className="flex items-center gap-4">
            <Input 
              id="persons" 
              type="text" 
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.persons || ""}
              onFocus={(e) => {
                // Scroll the element into view with offset for keyboard
                setTimeout(() => {
                  e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
              }}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^[0-9]+$/.test(val)) {
                  setFormData({ ...formData, persons: val === "" ? 0 : parseInt(val) });
                }
              }}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">× ₹{pricePerPerson} per person</span>
          </div>
        </div>
      </div>

      <div className="bg-secondary/50 p-4 rounded-2xl space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Total Price:</span>
          <span className="text-xl font-bold text-primary">₹{totalPrice}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Advance Payment (30%):</span>
          <span className="text-lg font-semibold text-primary">₹{advanceAmount}</span>
        </div>
      </div>

      <Button 
        className="w-full h-14 rounded-xl text-lg font-bold gap-2" 
        onClick={handleBook}
      >
        <CreditCard className="w-5 h-5" />
        Pay Advance & Confirm
      </Button>
    </div>
  );
}
