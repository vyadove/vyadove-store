"use client";

import React, { useEffect, useActionState } from "react";

import AccountInfo from "../account-info";
import Input from "../input";
import type { User } from "@/payload-types";

type MyInformationProps = {
    customer: User;
    updateCustomer: (customer: User) => void;
};

const ProfileName: React.FC<MyInformationProps> = ({
    customer,
    updateCustomer,
}) => {
    const [successState, setSuccessState] = React.useState(false);

    const updateCustomerName = async (
        _currentState: Record<string, unknown>,
        formData: FormData
    ) => {
        const updatedCustomer = {
            ...customer,
            firstName: formData.get("first_name") as string,
            lastName: formData.get("last_name") as string,
        };

        try {
            // updateCustomer(updatedCustomer)
            return { success: true, error: null };
        } catch (error: any) {
            console.error(error);
            return { success: false, error: error.toString() };
        }
    };

    const [state, formAction] = useActionState(updateCustomerName, {
        error: false,
        success: false,
    });

    const clearState = () => {
        setSuccessState(false);
    };

    useEffect(() => {
        setSuccessState(state.success);
    }, [state]);

    return (
        <form action={formAction} className="w-full overflow-visible">
            <AccountInfo
                label="Name"
                currentInfo={`${customer.firstName} ${customer.lastName}`}
                isSuccess={successState}
                isError={!!state?.error}
                clearState={clearState}
                data-testid="account-name-editor"
            >
                <div className="grid grid-cols-2 gap-x-4">
                    <Input
                        label="First name"
                        name="first_name"
                        required
                        defaultValue={customer.firstName ?? ""}
                        data-testid="first-name-input"
                    />
                    <Input
                        label="Last name"
                        name="last_name"
                        required
                        defaultValue={customer.lastName ?? ""}
                        data-testid="last-name-input"
                    />
                </div>
            </AccountInfo>
        </form>
    );
};

export default ProfileName;
