import { useEffect, useState } from "react";
import axios from "axios";

import {
  Accordion,
  ActionIcon,
  Button,
  Container,
  Grid,
  Group,
  LoadingOverlay,
  Paper,
  Skeleton,
  Text,
  useMantineTheme,
} from "@mantine/core";

import { BookmarkIcon } from "@modulz/radix-icons";

import { useNotifications } from "@mantine/notifications";

export default function ProjectsAdmin() {
  const [identifier, setIdentifier] = useState("");
  const [teamNameError, setTeamNameError] = useState("");
  const [collaboratorsError, setCollaboratorsError] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamColour, setTeamColour] = useState("rgba(47, 119, 150, 0.7)");
  const [teamCollaborators, setTeamCollaborators] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [teams, setTeams] = useState({ teams: [], isFetching: false });
  const [projects, setProjects] = useState({ projects: [], isFetching: false });

  const notifications = useNotifications();
  const theme = useMantineTheme();

  const fetchProjects = async () => {
    try {
      setProjects({ projects: projects.projects, isFetching: true });
      const response = await axios.get(
        "http://localhost:5000/v1/getAllProjects"
      );
      setProjects({ projects: response.data, isFetching: false });
    } catch (e) {
      console.log(e);
      setProjects({ projects: projects.projects, isFetching: false });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetErrors = () => {
    setTeamNameError("");
    setCollaboratorsError("");
  };

  console.log("projects", projects.projects);
  return (
    <>
      <LoadingOverlay visible={projects.isFetching} />
      {projects.projects &&
        projects.projects.length > 0 &&
        projects.projects.map((project, idx) => {
          return (
            <Paper key={idx} padding="md" shadow="lg">
              <Accordion iconPosition="right">
                <Accordion.Item
                  label={
                    <Group>
                      <ActionIcon>
                        <BookmarkIcon />
                      </ActionIcon>
                      <Text>{project}</Text>
                    </Group>
                  }
                ></Accordion.Item>
              </Accordion>
            </Paper>
          );
        })}
      {projects && projects.isFetching && <Skeleton height={12} radius="xl" />}
    </>
  );
}
