import { useEffect, useState } from "react";
import axios from "axios";
import { Divider, LoadingOverlay, Tabs, Title } from "@mantine/core";

import TeamsAdmin from "./admin/TeamsAdmin";
import ProjectsAdmin from "./admin/ProjectsAdmin";

import { GlobeIcon, GroupIcon, LightningBoltIcon } from "@modulz/radix-icons";

export default function Settings() {
  const [settings, setSettings] = useState({ settings: {}, isFetching: false });
  return (
    <>
      <LoadingOverlay visible={settings.isFetching} />
      <Title sx={{ fontSize: 50, fontWeight: 900, letterSpacing: -2 }}>
        Settings
      </Title>
      <Divider />

      <Tabs>
        <Tabs.Tab label="Teams" icon={<GroupIcon />}>
          <TeamsAdmin />
        </Tabs.Tab>
        <Tabs.Tab label="Projects" icon={<LightningBoltIcon />}>
          <ProjectsAdmin />
        </Tabs.Tab>
        <Tabs.Tab label="Global" icon={<GlobeIcon />}>
          Global
        </Tabs.Tab>
      </Tabs>
    </>
  );
}
