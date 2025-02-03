import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { format, parseISO, set } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { CalendarIcon, Clock } from "lucide-react";

export type ScheduleJobDataType = Extract<JobDataType, { key: "schedule" }>;

interface ScheduleConfigProps {
  jobData?: JobDataType;
}

export const ScheduleConfig = forwardRef(
  ({ jobData }: ScheduleConfigProps, ref) => {
    const [isDateTimeMode, setIsDateTimeMode] = useState<boolean>(true);
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState<string>("12:00");
    const [timezone, setTimezone] = useState<string>("Z");
    const [intervalType, setIntervalType] = useState<
      "min" | "hour" | "day" | "week" | "month"
    >("min");
    const [intervalAmount, setIntervalAmount] = useState<number>(10);

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
        const dateTimeString = `${
          date.toISOString().split("T")[0]
        }T${time}:00Z`;
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
          <>
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
          </>
        )}
      </div>
    );
  }
);
