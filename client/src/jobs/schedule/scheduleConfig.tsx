import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from "react";
import {
  format,
  isValid,
  parse,
  getYear,
  getMonth,
  getDate,
  setYear,
  setMonth,
  setDate,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { JobDataType } from "@/types";
import { CalendarIcon, Clock, ChevronDown } from "lucide-react";
export type ScheduleJobDataType = Extract<JobDataType, { key: "schedule" }>;

interface ScheduleConfigProps {
  jobData?: JobDataType;
}

export const ScheduleConfig = forwardRef(
  ({ jobData }: ScheduleConfigProps, ref) => {
    const [isDateTimeMode, setIsDateTimeMode] = useState<boolean>(true);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState<string>("12:00");
    const [timezone, setTimezone] = useState<string>("Z");
    const [intervalType, setIntervalType] = useState<
      "min" | "hour" | "day" | "week" | "month"
    >("min");
    const [intervalAmount, setIntervalAmount] = useState<number>(10);

    // Dropdown states
    const [isYearOpen, setIsYearOpen] = useState(false);
    const [isMonthOpen, setIsMonthOpen] = useState(false);
    const [isDayOpen, setIsDayOpen] = useState(false);
    const yearRef = useRef<HTMLDivElement>(null);
    const monthRef = useRef<HTMLDivElement>(null);
    const dayRef = useRef<HTMLDivElement>(null);

    // Generate arrays for year, month, and day options
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: 2100 - currentYear + 1 },
      (_, i) => currentYear + i
    );
    const months = Array.from({ length: 12 }, (_, i) => ({
      value: i,
      label: format(new Date(2000, i, 1), "MMMM"),
    }));

    // Get days in the selected month
    const getDaysInMonth = (year: number, month: number) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const days = date
      ? Array.from(
          { length: getDaysInMonth(getYear(date), getMonth(date)) },
          (_, i) => i + 1
        )
      : [];

    // Close dropdowns when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          yearRef.current &&
          !yearRef.current.contains(event.target as Node)
        ) {
          setIsYearOpen(false);
        }
        if (
          monthRef.current &&
          !monthRef.current.contains(event.target as Node)
        ) {
          setIsMonthOpen(false);
        }
        if (dayRef.current && !dayRef.current.contains(event.target as Node)) {
          setIsDayOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleYearChange = (year: number) => {
      if (date) {
        const newDate = new Date(date);
        newDate.setFullYear(year);
        setDate(newDate);
        setIsYearOpen(false);
      }
    };

    const handleMonthChange = (month: number) => {
      if (date) {
        const newDate = new Date(date);
        newDate.setMonth(month);
        // Adjust day if it's invalid for the new month
        const daysInMonth = getDaysInMonth(
          newDate.getFullYear(),
          newDate.getMonth()
        );
        if (newDate.getDate() > daysInMonth) {
          newDate.setDate(daysInMonth);
        }
        setDate(newDate);
        setIsMonthOpen(false);
      }
    };

    const handleDayChange = (day: number) => {
      if (date) {
        const newDate = new Date(date);
        newDate.setDate(day);
        setDate(newDate);
        setIsDayOpen(false);
      }
    };

    // Parse the ISO string on load
    useEffect(() => {
      if (!jobData) return;
      const data = jobData as ScheduleJobDataType;
      if (data.type == "fixed" && data.fixedTime) {
        // Parse the date string directly using the Date constructor
        const parsedDate = new Date(data.fixedTime.dateTime);

        // Set the date (as a Date object)
        setDate(parsedDate);

        // Extract hours and minutes in "HH:mm" format
        const hours = String(parsedDate.getUTCHours()).padStart(2, "0");
        const minutes = String(parsedDate.getUTCMinutes()).padStart(2, "0");
        const time = `${hours}:${minutes}`;
        setTime(time);

        // Set the timezone (use the provided offset or default to "UTC")
        const timezoneOffset = data.fixedTime.timeZoneOffset || "UTC";
        setTimezone(timezoneOffset);
      } else if (data.type === "interval" && data.interval) {
        setIntervalType(data.interval.unit);
        setIntervalAmount(data.interval.value);
      }
    }, [jobData]);

    useImperativeHandle(ref, () => ({
      submitHandler: () => {
        return handleSubmit();
      },
    }));

    const handleSubmit = () => {
      if (isDateTimeMode && date) {
        // Combine the user-provided date and time into a single string as it is.
        const formattedDate = format(date, "yyyy-MM-dd");
        const dateTimeString = `${formattedDate}T${time}:00Z`;
        console.log(dateTimeString);
        const ScheduleJob = {
          key: "schedule",
          type: "fixed",
          fixedTime: {
            dateTime: dateTimeString,
            timeZoneOffset: timezone,
          },
        } as ScheduleJobDataType;
        return ScheduleJob;
      } else {
        const ScheduleJob = {
          key: "schedule",
          type: "interval",
          interval: {
            unit: intervalType,
            value: intervalAmount,
          },
        } as ScheduleJobDataType;
        return ScheduleJob;
      }
    };

    return (
      <div className="space-y-4 w-full p-4 bg-inherit rounded-lg shadow">
        <div className="flex items-center justify-between w-full">
          <Label htmlFor="mode-toggle">Date/Time Mode</Label>
          <Switch
            id="mode-toggle"
            checked={isDateTimeMode}
            onCheckedChange={setIsDateTimeMode}
          />
        </div>

        {isDateTimeMode ? (
          <>
            <div className="flex flex-row gap-6">
              <div className="space-y-2 flex-1">
                <Label>Date</Label>
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-2">
                    {/* Year Dropdown */}
                    <div className="relative" ref={yearRef}>
                      <button
                        onClick={() => setIsYearOpen(!isYearOpen)}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm border rounded-md bg-background hover:bg-accent"
                      >
                        <span>{date ? getYear(date) : "Year"}</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </button>
                      {isYearOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                          {years.map((year) => (
                            <button
                              key={year}
                              onClick={() => handleYearChange(year)}
                              className={cn(
                                "w-full px-3 py-2 text-sm text-left hover:bg-accent",
                                date && getYear(date) === year && "bg-accent"
                              )}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Month Dropdown */}
                    <div className="relative" ref={monthRef}>
                      <button
                        onClick={() => setIsMonthOpen(!isMonthOpen)}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm border rounded-md bg-background hover:bg-accent"
                      >
                        <span>
                          {date ? months[getMonth(date)].label : "Month"}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </button>
                      {isMonthOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                          {months.map((month) => (
                            <button
                              key={month.value}
                              onClick={() => handleMonthChange(month.value)}
                              className={cn(
                                "w-full px-3 py-2 text-sm text-left hover:bg-accent",
                                date &&
                                  getMonth(date) === month.value &&
                                  "bg-accent"
                              )}
                            >
                              {month.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Day Dropdown */}
                    <div className="relative" ref={dayRef}>
                      <button
                        onClick={() => setIsDayOpen(!isDayOpen)}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm border rounded-md bg-background hover:bg-accent"
                      >
                        <span>{date ? getDate(date) : "Day"}</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </button>
                      {isDayOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                          {days.map((day) => (
                            <button
                              key={day}
                              onClick={() => handleDayChange(day)}
                              className={cn(
                                "w-full px-3 py-2 text-sm text-left hover:bg-accent",
                                date && getDate(date) === day && "bg-accent"
                              )}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Z">UTC (+00:00)</SelectItem>
                  <SelectItem value="+05:30">
                    Indian Standard Time (IST) (+05:30)
                  </SelectItem>
                  <SelectItem value="-05:00">
                    Eastern Time (ET) (-05:00)
                  </SelectItem>
                  <SelectItem value="-06:00">
                    Central Time (CT) (-06:00)
                  </SelectItem>
                  <SelectItem value="-07:00">
                    Mountain Time (MT)(-07:00)
                  </SelectItem>
                  <SelectItem value="-08:00">
                    Pacific Time (PT)(-08:00)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <div>
            <div className="space-y-2">
              <Label htmlFor="interval-type">Interval Type</Label>
              <Select
                value={intervalType}
                onValueChange={(value) =>
                  setIntervalType(
                    value as "min" | "hour" | "day" | "week" | "month"
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select interval type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minute">Minute</SelectItem>
                  <SelectItem value="hour">Hour</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interval-amount">Interval Amount</Label>
              <Input
                id="interval-amount"
                type="number"
                min={10}
                max={1000}
                value={intervalAmount}
                onChange={(e) =>
                  setIntervalAmount(parseInt(e.target.value, 10))
                }
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);
