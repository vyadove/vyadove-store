"use client";

import ProfileBillingAddress from "@/app/(frontend)/_components/profile-billing-address";
import ProfileName from "@/app/(frontend)/_components/profile/name";
import ProfileEmail from "@/app/(frontend)/_components/profile/email";
import ProfilePhone from "@/app/(frontend)/_components/profile/phone";
import { useAuth } from "@/app/(frontend)/_providers/auth";

export default function Profile() {
    const { user, updateUser } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <div className="w-full" data-testid="profile-page-wrapper">
            <div className="mb-8 flex flex-col gap-y-4">
                <h1 className="text-2xl-semi">Profile</h1>
                <p className="text-base-regular">
                    View and update your profile information, including your
                    name, email, and phone number. You can also update your
                    billing address, or change your password.
                </p>
            </div>
            <div className="flex flex-col gap-y-8 w-full">
                <ProfileName customer={user} updateCustomer={updateUser} />
                <Divider />
                <ProfileEmail customer={user} />
                <Divider />
                <ProfilePhone customer={user} />
                <Divider />

                <ProfileBillingAddress customer={user} regions={[]} />
            </div>
        </div>
    );
}

const Divider = () => {
    return <div className="w-full h-px bg-gray-200" />;
};
