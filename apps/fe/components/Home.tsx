import { forwardRef, useEffect, useState } from "react";
import axios from "axios";
import {
  ActionIcon,
  Container,
  Divider,
  Group,
  LoadingOverlay,
  Select,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { DateRangePicker } from "@mantine/dates";
import { SquareIcon } from "@modulz/radix-icons";
import * as dayjs from "dayjs";

import LeadTimeWidget from "./widgets/LeadTimeWidget";
import DeploymentFrequencyWidget from "./widgets/DeploymentFrequencyWidget";
import ChangeRateFailureWidget from "./widgets/ChangeRateFailureWidget";

export default function Home() {
  const [dates, setDates] = useState<[Date, Date]>([
    dayjs().subtract(30, "days").toDate(),
    dayjs().toDate(),
  ]);
  const [projects, setProjects] = useState({ projects: [], isFetching: false });
  const [teams, setTeams] = useState({ teams: [], isFetching: false });
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const SelectItem = forwardRef(({ color, label, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group>
        <ActionIcon>
          <SquareIcon style={{ backgroundColor: `${color}` }} />
        </ActionIcon>
        <Text>{label}</Text>
      </Group>
    </div>
  ));

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjects({ projects: projects.projects, isFetching: true });
        const response = await axios.get(
          "https://ed73-90-243-155-90.ngrok.io/v1/getAllProjects"
        );
        const selectProjects = [];
        for (const project of response.data) {
          selectProjects.push(project);
        }
        setFilteredProjects(selectProjects);

        setProjects({ projects: response.data, isFetching: false });
      } catch (e) {
        console.log(e);
        setProjects({ projects: projects.projects, isFetching: false });
      }
    };
    const fetchTeams = async () => {
      try {
        setTeams({ teams: teams.teams, isFetching: true });
        const response = await axios.get(
          "https://ed73-90-243-155-90.ngrok.io/v1/getAllTeams"
        );
        const selectTeams = [];
        for (const team of response.data) {
          selectTeams.push({
            key: team.id,
            color: team.teamColour,
            label: team.teamName,
            value: team.teamName,
          });
        }
        setFilteredTeams(selectTeams);
        setTeams({ teams: response.data, isFetching: false });
      } catch (e) {
        console.log(e);
        setTeams({ teams: teams.teams, isFetching: false });
      }
    };

    fetchTeams();
    fetchProjects();
  }, []);

  return (
    <>
      <LoadingOverlay visible={teams.isFetching || projects.isFetching} />
      <SimpleGrid
        breakpoints={[
          { maxWidth: 980, cols: 3, spacing: "md" },
          { maxWidth: 755, cols: 2, spacing: "sm" },
          { maxWidth: 600, cols: 1, spacing: "sm" },
        ]}
        cols={3}
      >
        <Select
          clearable
          label="Project"
          placeholder="Pick one"
          data={filteredProjects}
          searchable
          maxDropdownHeight={400}
          value={selectedProject}
          onChange={(value) => {
            setSelectedProject(value);
            if (!value) {
              const selectTeams = [];
              for (const team of teams.teams) {
                selectTeams.push({
                  color: team.teamColour,
                  label: team.teamName,
                  value: team.teamName,
                });
              }
              setFilteredTeams(selectTeams);
            }
            if (value) {
              // Based on project restrict teams
              const newTeams = [];
              for (const team of teams.teams) {
                for (const project of team.selectedProjects) {
                  if (project === value) {
                    newTeams.push({
                      color: team.teamColour,
                      label: team.teamName,
                      value: team.teamName,
                    });
                  }
                }
              }
              setFilteredTeams(newTeams);
            }
          }}
          nothingFound="No projects here"
        />

        <Select
          clearable
          label="Team"
          itemComponent={SelectItem}
          placeholder="Pick one"
          data={filteredTeams}
          searchable
          maxDropdownHeight={400}
          value={selectedTeam}
          onChange={(value) => {
            setSelectedTeam(value);
            if (!value) {
              setFilteredProjects(projects.projects);
              setSelectedProject(null);
            }
            if (value) {
              // Based on project restrict projects
              const newProjects = [];
              for (const team of teams.teams) {
                if (team.teamName === value) {
                  setFilteredProjects(team.selectedProjects);

                  if (team.selectedProjects.length === 1) {
                    // Show only value
                    setSelectedProject(team.selectedProjects[0]);
                  }
                }
              }
            }
          }}
          nothingFound="No teams here"
        />

        <DateRangePicker
          label="Period"
          placeholder="Pick dates range"
          value={dates}
          onChange={setDates}
        />
      </SimpleGrid>
      <Container mt="lg">
        <SimpleGrid cols={1}>
          <LeadTimeWidget
            dates={dates}
            selectedProject={selectedProject}
            selectedTeam={selectedTeam}
          />
        </SimpleGrid>
        <SimpleGrid cols={1}>
          <DeploymentFrequencyWidget
            dates={dates}
            selectedProject={selectedProject}
            selectedTeam={selectedTeam}
          />
        </SimpleGrid>
        <Divider />
        <SimpleGrid cols={1}>
          <ChangeRateFailureWidget
            dates={dates}
            selectedProject={selectedProject}
            selectedTeam={selectedTeam}
          />
        </SimpleGrid>
      </Container>
    </>
  );
}
