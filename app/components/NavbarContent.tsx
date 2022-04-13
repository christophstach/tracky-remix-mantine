import { Group } from '@mantine/core';
import NavbarLink from '~/components/NavbarLink';
import { IconApps, IconBox, IconBuildingFactory, IconClock, IconListNumbers } from '@tabler/icons';

interface NavbarContentProps {
    onLinkClick?: () => void;
}

export default function NavbarContent(props: NavbarContentProps) {


    return (
        <Group direction="column" grow>
            {false && <NavbarLink
                icon={IconApps}
                iconColor="indigo"
                to="/"
                label="Dashboard"
                onClick={props.onLinkClick}
                exact
            />}

            <NavbarLink
                icon={IconClock}
                iconColor="lime"
                to="/timer"
                label="Zeiterfassung"
                onClick={props.onLinkClick}
                exact
            />

            <NavbarLink
                icon={IconBuildingFactory}
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
                to="/activities"
                label="Tätigkeiten"
                onClick={props.onLinkClick}
            />

        </Group>
    );
}


