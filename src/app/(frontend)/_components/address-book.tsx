import type React from "react";

import AddAddress from "./add-address";
import EditAddress from "./edit-address-modal";
import type { User } from "@/payload-types";

type AddressBookProps = {
	customer: User;
};

const AddressBook: React.FC<AddressBookProps> = ({ customer }) => {
	return (
		<div className="w-full">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 mt-4">
				<AddAddress />
				{/* {addresses.map((address: any) => {
                    return <EditAddress address={address} key={address.id} />;
                })} */}
			</div>
		</div>
	);
};

export default AddressBook;
