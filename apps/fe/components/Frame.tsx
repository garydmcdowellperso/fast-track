import { useState } from "react";
import Link from "next/link";
import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Divider,
  Group,
  Header,
  MediaQuery,
  Navbar,
  Text,
  Title,
  ThemeIcon,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import {
  BarChartIcon,
  HomeIcon,
  GearIcon,
  LapTimerIcon,
  MoonIcon,
  SunIcon,
  SymbolIcon,
  ValueNoneIcon,
} from "@modulz/radix-icons";

export default function Frame(props) {
  const { child } = props;
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <AppShell
      // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
      navbarOffsetBreakpoint="sm"
      // fixed prop on AppShell will be automatically added to Header and Navbar
      fixed
      navbar={
        <Navbar
          padding="md"
          // Breakpoint at which navbar will be hidden if hidden prop is true
          hiddenBreakpoint="sm"
          // Hides navbar when viewport size is less than value specified in hiddenBreakpoint
          hidden={!opened}
          // when viewport size is less than theme.breakpoints.sm navbar width is 100%
          // viewport size > theme.breakpoints.sm – width is 300px
          // viewport size > theme.breakpoints.lg – width is 400px
          width={{ sm: 300, lg: 300 }}
        >
          <Navbar.Section mt="lg">
            <Group>
              <ActionIcon>
                <HomeIcon color="blue" />
              </ActionIcon>
              <Link passHref={true} href="/">
                <Text>Home</Text>
              </Link>
            </Group>
          </Navbar.Section>
          <Navbar.Section mt="lg">
            <Group>
              <ActionIcon>
                <LapTimerIcon color="magenta" />
              </ActionIcon>
              <Link passHref={true} href="/lead">
                <Text>Lead Time</Text>
              </Link>
            </Group>
          </Navbar.Section>
          <Navbar.Section mt="lg">
            <Group>
              <ActionIcon>
                <BarChartIcon color="blue" />
              </ActionIcon>

              <Link passHref={true} href="/deployment">
                <Text>Deployment Frequency</Text>
              </Link>
            </Group>
          </Navbar.Section>
          <Navbar.Section mt="lg">
            <Group>
              <ActionIcon>
                <ValueNoneIcon color="red" />
              </ActionIcon>

              <Link passHref={true} href="/change_rate">
                <Text>Change Rate Failure</Text>
              </Link>
            </Group>
          </Navbar.Section>
          <Navbar.Section grow mt="lg">
            <Group>
              <ActionIcon>
                <GearIcon color="blue" />
              </ActionIcon>

              <Link passHref={true} href="/settings">
                <Text>Settings</Text>
              </Link>
            </Group>
          </Navbar.Section>
          <Navbar.Section>
            <Divider />
            <Group>
              <ActionIcon
                variant="outline"
                color={dark ? "yellow" : "blue"}
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
              >
                {dark ? (
                  <SunIcon style={{ width: 18, height: 18 }} />
                ) : (
                  <MoonIcon style={{ width: 18, height: 18 }} />
                )}
              </ActionIcon>

              <Avatar src="avatar.png" alt="it's me" />
              <Text>G-Mac</Text>
              <svg width="18" height="18" viewBox="0 0 15 15" fill="none">
                <path
                  d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                  fill="currentColor"
                ></path>
              </svg>
            </Group>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={70} padding="md">
          {/* Handle other responsive styles with MediaQuery component or createStyles function */}
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Group position="apart">
              <ThemeIcon color="red">
                <SymbolIcon />
              </ThemeIcon>
              <Title>Fast Track</Title>
            </Group>
          </div>
        </Header>
      }
    >
      {child}
    </AppShell>
  );
}
