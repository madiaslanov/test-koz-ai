import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface InsightsProps {
    insights: string[];
}

export function Insights({ insights }: InsightsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-400"/>
                    Рекомендации и инсайты
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 list-disc pl-5 text-sm">
                    {insights.map((insight, i) => <li key={i}>{insight}</li>)}
                </ul>
            </CardContent>
        </Card>
    )
}