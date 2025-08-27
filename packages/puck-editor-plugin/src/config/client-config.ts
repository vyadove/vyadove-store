import { UserConfig } from "../types/user-config";
import { Button } from "./blocks/Button";
import { Card } from "./blocks/Card";
import { Grid } from "./blocks/Grid";
import { Heading } from "./blocks/Heading";
import { Flex } from "./blocks/Flex";
import { Logos } from "./blocks/Logos";
import { Stats } from "./blocks/Stats";
import { Text } from "./blocks/Text";
import { Space } from "./blocks/Space";
import { TopHeader } from "./blocks/TopHeader";
import { NavBar } from "./blocks/NavBar";
import { Hero1 } from "./blocks/Hero1";
import { Hero2 } from "./blocks/Hero2";
import { Hero3 } from "./blocks/Hero3";
import { Hero4 } from "./blocks/Hero4";
import { Hero5 } from "./blocks/Hero5";
import Root from "./root";

export const clientConfig: UserConfig = {
    root: Root,
    categories: {
        navigation: {
            title: "Navigation",
            components: ["TopHeader", "NavBar"],
        },
        heroes: {
            title: "Heroes",
            components: ["Hero1", "Hero2", "Hero3", "Hero4", "Hero5"],
        },
        layout: {
            components: ["Grid", "Flex", "Space"],
        },
        typography: {
            components: ["Heading", "Text"],
        },
        interactive: {
            title: "Actions",
            components: ["Button"],
        },
        other: {
            title: "Other",
            components: ["Card", "Logos", "Stats"],
        },
    },
    components: {
        TopHeader,
        NavBar,
        Hero1,
        Hero2,
        Hero3,
        Hero4,
        Hero5,
        Button,
        Card,
        Grid,
        Heading,
        Flex,
        Logos,
        Stats,
        Text,
        Space,
    },
};
