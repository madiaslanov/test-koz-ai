import { useDashboardStore } from "@/store/dashboard-store";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function DrilldownBreadcrumb() {
    const { drilldownPath, setDrilldownPath } = useDashboardStore();

    const handleNavigate = (index: number) => {
        setDrilldownPath(drilldownPath.slice(0, index + 1));
    };

    const handleGoToRoot = () => {
        setDrilldownPath([]);
    }

    return (
        <Breadcrumb className="mb-4">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={handleGoToRoot} className="cursor-pointer">Все кампании</BreadcrumbLink>
                </BreadcrumbItem>
                {drilldownPath.map((item, index) => (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => handleNavigate(index)} className="cursor-pointer">{item.name}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}