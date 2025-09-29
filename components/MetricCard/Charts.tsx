import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AggregatedData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface ChartsProps {
    data: AggregatedData[];
}

export function Charts({ data }: ChartsProps) {
    const chartData = data.slice(0, 10).sort((a,b) => b.revenue - a.revenue);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Топ по выручке и затратам</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tickFormatter={(value) => formatCurrency(Number(value))} />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tickFormatter={(value) => formatCurrency(Number(value))} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Выручка" />
                        <Bar yAxisId="right" dataKey="spend" fill="#82ca9d" name="Затраты" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}