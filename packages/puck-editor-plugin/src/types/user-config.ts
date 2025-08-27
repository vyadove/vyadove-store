import { Config, Data } from "@measured/puck";
import { ButtonProps } from "../config/blocks/Button";
import { CardProps } from "../config/blocks/Card";
import { FlexProps } from "../config/blocks/Flex";
import { GridProps } from "../config/blocks/Grid";
import { HeadingProps } from "../config/blocks/Heading";
import { LogosProps } from "../config/blocks/Logos";
import { SpaceProps } from "../config/blocks/Space";
import { StatsProps } from "../config/blocks/Stats";
import { TextProps } from "../config/blocks/Text";
import { TopHeaderProps } from "../config/blocks/TopHeader";
import { NavBarProps } from "../config/blocks/NavBar";
import { Hero1Props } from "../config/blocks/Hero1";
import { Hero2Props } from "../config/blocks/Hero2";
import { Hero3Props } from "../config/blocks/Hero3";
import { Hero4Props } from "../config/blocks/Hero4";
import { Hero5Props } from "../config/blocks/Hero5";
import { RootProps } from "../config/root";

export type Components = {
    TopHeader: TopHeaderProps;
    NavBar: NavBarProps;
    Hero1: Hero1Props;
    Hero2: Hero2Props;
    Hero3: Hero3Props;
    Hero4: Hero4Props;
    Hero5: Hero5Props;
    Button: ButtonProps;
    Card: CardProps;
    Grid: GridProps;
    Heading: HeadingProps;
    Flex: FlexProps;
    Logos: LogosProps;
    Stats: StatsProps;
    Text: TextProps;
    Space: SpaceProps;
};

export type UserConfig = Config<{
    components: Components;
    root: RootProps;
    categories: ["navigation", "heroes", "layout", "typography", "interactive"];
    fields: {
        userField: {
            type: "userField";
            option: boolean;
        };
        title: {
            type: "text";
            label: string;
        };
        description: {
            type: "text";
            label: string;
        };
    };
}>;

export type UserData = Data<Components, RootProps>;
