import * as React from "react";
import { format, parse } from "date-fns";
import { enGB } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DatePickerDropdownProps {
  value?: string; // ISO date string (YYYY-MM-DD)
  onChange: (date: string | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function generateYearOptions(minYear: number, maxYear: number): number[] {
  const years: number[] = [];
  for (let year = maxYear; year >= minYear; year--) {
    years.push(year);
  }
  return years;
}

export function DatePickerDropdown({
  value,
  onChange,
  minDate,
  maxDate,
  disabled,
  className,
  error,
}: DatePickerDropdownProps) {
  const hasValue = !!value;
  // Default to today - 40 years
  const defaultDate = React.useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 40);
    return date;
  }, []);

  const minYear = minDate?.getFullYear() || 1950;
  const maxYear = maxDate?.getFullYear() || new Date().getFullYear();
  const yearOptions = React.useMemo(() => generateYearOptions(minYear, maxYear), [minYear, maxYear]);

  // Parse current value or use default
  const currentDate = React.useMemo(() => {
    if (value) {
      try {
        return parse(value, 'yyyy-MM-dd', new Date());
      } catch {
        return defaultDate;
      }
    }
    return defaultDate;
  }, [value, defaultDate]);

  const [day, setDay] = React.useState<string>(() => {
    return currentDate.getDate().toString().padStart(2, '0');
  });
  const [month, setMonth] = React.useState<string>(() => {
    return (currentDate.getMonth() + 1).toString().padStart(2, '0');
  });
  const [year, setYear] = React.useState<number>(() => {
    return currentDate.getFullYear();
  });

  // Update state when value prop changes
  React.useEffect(() => {
    if (value) {
      try {
        const parsed = parse(value, 'yyyy-MM-dd', new Date());
        setDay(parsed.getDate().toString().padStart(2, '0'));
        setMonth((parsed.getMonth() + 1).toString().padStart(2, '0'));
        setYear(parsed.getFullYear());
      } catch {
        // Invalid date, keep current state
      }
    } else {
      // Reset to default
      setDay(defaultDate.getDate().toString().padStart(2, '0'));
      setMonth((defaultDate.getMonth() + 1).toString().padStart(2, '0'));
      setYear(defaultDate.getFullYear());
    }
  }, [value, defaultDate]);

  // Generate day options based on selected month and year
  const dayOptions = React.useMemo(() => {
    const daysInMonth = getDaysInMonth(year, parseInt(month));
    const days: number[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  }, [year, month]);

  // Validate and update date when any field changes
  const updateDate = React.useCallback((newDay: string, newMonth: string, newYear: number) => {
    const daysInMonth = getDaysInMonth(newYear, parseInt(newMonth));
    const dayNum = parseInt(newDay);
    
    // Adjust day if it's invalid for the selected month/year
    const validDay = Math.min(dayNum, daysInMonth);
    const adjustedDay = validDay.toString().padStart(2, '0');

    try {
      const dateStr = `${newYear}-${newMonth}-${adjustedDay}`;
      const date = parse(dateStr, 'yyyy-MM-dd', new Date());
      
      // Check min/max constraints
      if (minDate && date < minDate) {
        // Set to minDate
        const minDateStr = format(minDate, 'yyyy-MM-dd');
        onChange(minDateStr);
        return;
      }
      if (maxDate && date > maxDate) {
        // Set to maxDate
        const maxDateStr = format(maxDate, 'yyyy-MM-dd');
        onChange(maxDateStr);
        return;
      }

      onChange(dateStr);
    } catch (error) {
      // Invalid date, don't update
      console.error('Invalid date:', error);
    }
  }, [minDate, maxDate, onChange]);

  const handleDayChange = (newDay: string) => {
    setDay(newDay);
    updateDate(newDay, month, year);
  };

  const handleMonthChange = (newMonth: string) => {
    setMonth(newMonth);
    // Adjust day if needed
    const daysInMonth = getDaysInMonth(year, parseInt(newMonth));
    const dayNum = parseInt(day);
    const adjustedDay = Math.min(dayNum, daysInMonth).toString().padStart(2, '0');
    setDay(adjustedDay);
    updateDate(adjustedDay, newMonth, year);
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    // Adjust day if needed (leap year Feb 29 -> Feb 28)
    const daysInMonth = getDaysInMonth(newYear, parseInt(month));
    const dayNum = parseInt(day);
    const adjustedDay = Math.min(dayNum, daysInMonth).toString().padStart(2, '0');
    setDay(adjustedDay);
    updateDate(adjustedDay, month, newYear);
  };

  return (
    <div className={cn("flex gap-2", className)}>
      {/* Day */}
      <Select
        value={hasValue ? day : ''}
        onValueChange={handleDayChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            "h-14 text-lg",
            error && "border-destructive border-2"
          )}
        >
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent>
          {dayOptions.map((d) => (
            <SelectItem key={d} value={d.toString().padStart(2, '0')}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Month */}
      <Select
        value={hasValue ? month : ''}
        onValueChange={handleMonthChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            "h-14 text-lg flex-1",
            error && "border-destructive border-2"
          )}
        >
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year */}
      <Select
        value={hasValue ? year.toString() : ''}
        onValueChange={(val) => handleYearChange(parseInt(val))}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            "h-14 text-lg",
            error && "border-destructive border-2"
          )}
        >
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {yearOptions.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

