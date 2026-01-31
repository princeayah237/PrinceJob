import { benefits } from "@/app/utils/listOfBenefits";
import { Badge } from "../ui/badge";

export function BenefitsSelector() {
    return (
        <div>
            <div className="flex flex-wrap gap-3">
                {benefits.map((benefit) => (
                    <Badge className="cursor-pointer transition-all hover:scale-105 active:scale-95 text-sm px-4 py-1.5 rounded-full" key={benefit.id} variant="outline">
                        <span className="flex items-center gap-2">
                            {benefit.icon}
                            {benefit.label}
                        </span>
                    </Badge>
                ))}
            </div>
        </div>
    )
}