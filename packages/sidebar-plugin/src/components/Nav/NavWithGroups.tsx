import type { ServerProps } from "payload";
import Nav from "./Nav";

type NavWithGroupsProps = ServerProps & {
    groupsConfig?: Record<string, { name: string; icon: string }>;
};

const NavWithGroups = (props: NavWithGroupsProps) => {
    return <Nav {...props} groupsConfig={props.groupsConfig} />;
};

export default NavWithGroups;