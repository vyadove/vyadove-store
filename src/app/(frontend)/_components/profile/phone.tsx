"use client";

import React, { useEffect, useActionState } from "react";

import AccountInfo from "../account-info";
import Input from "../input";
import { updateCustomer } from "@/app/api/services/customers";

type MyInformationProps = {
    customer: any;
};

const ProfilePhone: React.FC<MyInformationProps> = ({ customer }) => {
    const [successState, setSuccessState] = React.useState(false);

    const updateCustomerPhone = async (
        _currentState: Record<string, unknown>,
        formData: FormData
    ) => {
        const customer = {
            phone: formData.get("phone") as string,
        };

        try {
            await updateCustomer(customer);
            return { success: true, error: null };
        } catch (error: any) {
            console.error(error);
            return { success: false, error: error.toString() };
        }
    };

    const [state, formAction] = useActionState(updateCustomerPhone, {
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
        <form action={formAction} className="w-full">
            <AccountInfo
                label="Phone"
                currentInfo={`${customer?.phone || "-"}`}
                isSuccess={successState}
                isError={!!state.error}
                errorMessage={state.error}
                clearState={clearState}
                data-testid="account-phone-editor"
            >
                <div className="grid grid-cols-1 gap-y-2">
                    <Input
                        label="Phone"
                        name="phone"
                        type="phone"
                        autoComplete="phone"
                        required
                        defaultValue={customer?.phone || ""}
                        data-testid="phone-input"
                    />
                </div>
            </AccountInfo>
        </form>
    );
};

export default ProfilePhone;
