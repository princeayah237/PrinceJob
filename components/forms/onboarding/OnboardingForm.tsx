"use client";

import Image from "next/image";
import Logo from '@/public/logo.png'
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { UserTypeSelection } from "./UserTypeForm";
import { CompanyForm } from "./CompanyForm";

type UserSelectionType = 'company' | 'jobSeeker' | null;

export function OnboardingForm() {
    const [step, setStep] = useState(1);
    const [userType, setUserType] = useState<UserSelectionType>(null);

function handleuserTypeSelection(type: UserSelectionType) {
    setUserType(type)
    setStep(2);
}

function renderStep() {
    switch(step) {
        case 1:
            return <UserTypeSelection onSelect={handleuserTypeSelection} />

            case 2:
                return userType === "company" ? ( <CompanyForm />
     ) : (
     <p>User is a job seeker</p>
     );

     default:
        return null;

    }
}


    return (
        <>
        <div className="flex items-center gap-4 mb-10">
            <Image src={Logo} alt="JobPrince Logo" width={50} height={50} />
            <h1 className="text-4xl font-bold">Job<span className="text-primary">Prince</span></h1>

        </div>
        <Card className="max-w-lg w-full">
            <CardContent className="p-6">
                {renderStep()}
            </CardContent>
        </Card>
        </>
    )
}