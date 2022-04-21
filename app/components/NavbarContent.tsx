import { Group } from '@mantine/core';
import NavbarLink from '~/components/NavbarLink';
import { IconApps, IconBox, IconBuildingSkyscraper, IconCalendar, IconClock, IconListNumbers } from '@tabler/icons';

interface NavbarContentProps {
    onLinkClick?: () => void;
}

export default function NavbarContent(props: NavbarContentProps) {
    return (
        <Group direction="column" grow>
            <NavbarLink
                icon={IconClock}
                iconColor="lime"
                to="/time-entries"
                label="Zeiterfassungen"
                onClick={props.onLinkClick}
                exact
            />

            <NavbarLink
                icon={IconCalendar}
                iconColor="orange"
                to="/calendar"
                label="Kalender"
                onClick={props.onLinkClick}
            />

            <NavbarLink
                icon={IconBuildingSkyscraper}
                iconColor="yellow"
                to="/clients"
                label="Klienten"
                onClick={props.onLinkClick}
            />

            <NavbarLink
                icon={IconBox}
                iconColor="cyan"
                to="/projects"
                label="Projekte"
                onClick={props.onLinkClick}
            />

            <NavbarLink
                icon={IconListNumbers}
                iconColor="grape"
                to="/tasks"
                label="Tätigkeiten"
                onClick={props.onLinkClick}
            />


        </Group>
    );
}


