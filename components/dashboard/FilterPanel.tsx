import { useDashboardStore } from "@/store/dashboard-store";
import { useMarketingData } from "@/hooks/use-marketing-data";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FilterPanel() {
    const { dateRange, setDateRange, setSelectedManagers, setSelectedCategories, resetFilters } = useDashboardStore();
    const { uniqueValues } = useMarketingData();

    return (
        <div className="flex flex-wrap items-center gap-4 p-4 border-b bg-background">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-[280px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Выберите дату</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="range" selected={dateRange} onSelect={setDateRange} initialFocus />
                </PopoverContent>
            </Popover>

            <Select onValueChange={(value) => setSelectedManagers(value ? [value] : [])}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Менеджер" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    {uniqueValues.managers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
            </Select>

            <Select onValueChange={(value) => setSelectedCategories(value ? [value] : [])}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    {uniqueValues.categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
            </Select>

            <Button onClick={resetFilters} variant="ghost">Сбросить</Button>
        </div>
    );
}