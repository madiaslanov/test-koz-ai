import { useDashboardStore } from "@/store/dashboard-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export function WhatIfAnalysis() {
    const { whatIfParams, setWhatIfParams } = useDashboardStore();

    return (
        <Card>
            <CardHeader>
                <CardTitle>What-if Анализ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label>Изменение бюджета: {Math.round(whatIfParams.budgetMultiplier * 100)}%</Label>
                    <Slider
                        defaultValue={[1]}
                        value={[whatIfParams.budgetMultiplier]}
                        min={0.5}
                        max={2}
                        step={0.1}
                        onValueChange={(value) => setWhatIfParams({ budgetMultiplier: value[0] })}
                    />
                </div>
                <div>
                    <Label>Изменение конверсии (в лиды): {Math.round(whatIfParams.conversionMultiplier * 100)}%</Label>
                    <Slider
                        defaultValue={[1]}
                        value={[whatIfParams.conversionMultiplier]}
                        min={0.5}
                        max={2}
                        step={0.1}
                        onValueChange={(value) => setWhatIfParams({ conversionMultiplier: value[0] })}
                    />
                </div>
            </CardContent>
        </Card>
    );
}