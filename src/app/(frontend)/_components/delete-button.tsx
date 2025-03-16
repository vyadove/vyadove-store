import { clx } from "@medusajs/ui";
import { useState } from "react";
import Spinner from "./icons/spinner";
import Trash from "./icons/trash";
import { useCart } from "react-use-cart";

const DeleteButton = ({
	id,
	children,
	className,
}: {
	id: string;
	children?: React.ReactNode;
	className?: string;
}) => {
	const [isDeleting, setIsDeleting] = useState(false);
	const { removeItem } = useCart();

	const handleDelete = async (id: string) => {
		setIsDeleting(true);
		setTimeout(() => {
			removeItem(id);
			setIsDeleting(false);
		}, 200);
	};

	return (
		<div
			className={clx(
				"flex items-center justify-between text-small-regular",
				className,
			)}
		>
			<button
				type="button"
				className="flex items-center gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
				onClick={() => handleDelete(id)}
			>
				{isDeleting ? <Spinner className="animate-spin" /> : <Trash size={20} />}
				<span>{children}</span>
			</button>
		</div>
	);
};

export default DeleteButton;
