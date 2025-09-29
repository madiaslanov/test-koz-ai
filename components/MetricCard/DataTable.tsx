import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AggregatedData, AggregationLevel } from "@/types";
import { useDashboardStore } from '@/store/dashboard-store';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface DataTableProps {
    data: AggregatedData[];
    level: AggregationLevel;
}

export function DataTable({ data, level }: DataTableProps) {
    const { drilldown } = useDashboardStore();

    const columns = useMemo(() => [
        { accessorKey: 'name', header: level === 'campaign' ? 'Кампания' : level === 'channel' ? 'Канал' : 'Проект' },
        { accessorKey: 'revenue', header: 'Выручка', cell: (val: number) => formatCurrency(val) },
        { accessorKey: 'spend', header: 'Затраты', cell: (val: number) => formatCurrency(val) },
        { accessorKey: 'roas', header: 'ROAS', cell: (val: number) => `${val.toFixed(2)}x` },
        { accessorKey: 'clicks', header: 'Клики', cell: (val: number) => formatNumber(val) },
        { accessorKey: 'ctr', header: 'CTR', cell: (val: number) => formatPercent(val) },
        { accessorKey: 'leads', header: 'Лиды', cell: (val: number) => formatNumber(val) },
        { accessorKey: 'cpl', header: 'CPL', cell: (val: number) => formatCurrency(val) },
        { accessorKey: 'purchases', header: 'Покупки', cell: (val: number) => formatNumber(val) },
        { accessorKey: 'cac', header: 'CAC', cell: (val: number) => formatCurrency(val) },
    ], [level]);

    const handleRowClick = (row: AggregatedData) => {
        if (level !== 'project') {
            drilldown(level, row.id, row.name);
        }
    };

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map(col => <TableHead key={col.accessorKey}>{col.header}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map(row => (
                            <TableRow key={row.id} onClick={() => handleRowClick(row)} className={level !== 'project' ? "cursor-pointer hover:bg-muted/50" : ""}>
                                {columns.map(col => (
                                    <TableCell key={col.accessorKey}>
                                        {col.cell ? col.cell(row[col.accessorKey as keyof AggregatedData] as number) : row[col.accessorKey as keyof AggregatedData]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}