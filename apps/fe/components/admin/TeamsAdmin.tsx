import { useEffect, useState } from "react";
import axios from "axios";

import {
  Accordion,
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Checkbox,
  ColorPicker,
  Container,
  Divider,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Paper,
  Select,
  Space,
  Skeleton,
  Table,
  Text,
  TextInput,
  Title,
  useMantineTheme,
  SimpleGrid,
} from "@mantine/core";

import {
  CrossCircledIcon,
  PaperPlaneIcon,
  PlusIcon,
  SquareIcon,
  TrashIcon,
} from "@modulz/radix-icons";

import { useNotifications } from "@mantine/notifications";

export default function TeamsAdmin() {
  const [identifier, setIdentifier] = useState("");
  const [teamNameError, setTeamNameError] = useState("");
  const [collaboratorsError, setCollaboratorsError] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamColour, setTeamColour] = useState("rgba(47, 119, 150, 0.7)");
  const [teamCollaborators, setTeamCollaborators] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [teams, setTeams] = useState({ teams: [], isFetching: false });
  const [projects, setProjects] = useState({ projects: [], isFetching: false });
  const [creating, setCreating] = useState({
    success: null,
    isCreating: false,
  });
  const [collaborators, setCollaborators] = useState({
    ics: [],
    isFetching: false,
  });
  const [newTeam, setNewTeam] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [dTeam, setDTeam] = useState({});

  const notifications = useNotifications();
  const theme = useMantineTheme();

  const fetchTeams = async () => {
    try {
      setTeams({ teams: teams.teams, isFetching: true });
      const response = await axios.get(
        "https://ed73-90-243-155-90.ngrok.io/v1/getAllTeams"
      );
      setTeams({ teams: response.data, isFetching: false });
    } catch (e) {
      console.log(e);
      setTeams({ teams: teams.teams, isFetching: false });
    }
  };

  const deleteATeam = async () => {
    try {
      setTeams({ teams: teams.teams, isFetching: true });
      const response = await axios.delete(
        "https://ed73-90-243-155-90.ngrok.io/v1/deleteTeam",
        {
          data: {
            id: dTeam.id,
          },
        }
      );
      setTeams({ teams: response.data, isFetching: false });
    } catch (e) {
      console.log(e);
      setTeams({ teams: teams.teams, isFetching: false });
    }
  };

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        setCollaborators({ ics: collaborators.ics, isFetching: true });
        const response = await axios.get(
          "https://ed73-90-243-155-90.ngrok.io/v1/getAllCollaborators "
        );
        setCollaborators({ ics: response.data, isFetching: false });
      } catch (e) {
        console.log(e);
        setCollaborators({ ics: collaborators.ics, isFetching: false });
      }
    };
    const fetchProjects = async () => {
      try {
        setProjects({ projects: projects.projects, isFetching: true });
        const response = await axios.get(
          "https://ed73-90-243-155-90.ngrok.io/v1/getAllProjects "
        );
        setProjects({ projects: response.data, isFetching: false });
      } catch (e) {
        console.log(e);
        setProjects({ projects: projects.projects, isFetching: false });
      }
    };

    fetchTeams();
    fetchCollaborators();
    fetchProjects();
  }, []);

  const addTeam = () => {
    resetErrors();
    setTeamName("");
    setTeamCollaborators([]);
    setSelectedProjects([]);
    setNewTeam(true);
  };

  const resetErrors = () => {
    setTeamNameError("");
    setCollaboratorsError("");
  };

  const cancelAdd = () => {
    resetErrors();
    setNewTeam(false);
  };

  const deleteTeam = (team) => {
    setDTeam(team);
    setConfirm(true);
  };

  const saveTeam = () => {
    resetErrors();
    if (teamName === "") {
      setTeamNameError("Team name missing");
      return;
    }

    if (teamCollaborators.length === 0) {
      setCollaboratorsError("Must pick at least one collaborator");
      return;
    }

    const createTeam = async () => {
      try {
        setCreating({ success: null, isFetching: true });
        const response = await axios.post(
          "http://localhost:5000/v1/createTeam",
          {
            teamName,
            teamCollaborators,
            selectedProjects,
            teamColour,
          }
        );
        setCreating({ success: true, isFetching: false });
        setNewTeam(false);
        notifications.showNotification({
          title: "Save new team",
          autoClose: 5000,
          message: "Yeah baby, it's saved 🤥",
        });
        fetchTeams();
      } catch (e) {
        console.log(e);
        setCreating({ success: false, isFetching: false });
        setNewTeam(false);
        notifications.showNotification({
          title: "Save new team",
          autoClose: 5000,
          color: "red",
          message:
            "It didn't work - sorry, try again then use the feedback to report a bug 😓",
        });
      }
    };

    createTeam();
  };

  const rows = collaborators.ics.map((element) => {
    if (element.identifierType === identifier) {
      return (
        <tr key={element.id}>
          <td>
            <Checkbox
              onClick={(event) => {
                resetErrors();
                const newCollabs = [...teamCollaborators];
                if (event.currentTarget.checked) {
                  newCollabs.push(element);
                } else {
                  const index = newCollabs.findIndex(
                    (el) => el.id === element.id
                  );
                  if (index > -1) {
                    newCollabs.splice(index, 1);
                  }
                }
                setTeamCollaborators(newCollabs);
              }}
            />
          </td>
          <td>
            <Group>
              <div>
                <Avatar src={element.avatarUrl}></Avatar>
              </div>
              <div>{element.fullName}</div>
            </Group>
          </td>
        </tr>
      );
    }
  });

  return (
    <>
      <LoadingOverlay
        visible={
          teams.isFetching || collaborators.isFetching || creating.isCreating
        }
      />
      <Container>
        <Grid justify="flex-end">
          {!newTeam ? (
            <Group onClick={addTeam}>
              <Button leftIcon={<PlusIcon />} variant="white" onClick={addTeam}>
                Add
              </Button>
            </Group>
          ) : (
            <Group>
              <Group>
                <Button
                  leftIcon={<PaperPlaneIcon />}
                  variant="white"
                  onClick={saveTeam}
                >
                  Save
                </Button>
              </Group>
              <Group>
                <Button
                  leftIcon={<CrossCircledIcon />}
                  variant="white"
                  color="red"
                  onClick={cancelAdd}
                >
                  Cancel
                </Button>
              </Group>
            </Group>
          )}
        </Grid>
      </Container>
      {newTeam && (
        <Paper>
          <Group position="center" direction="column">
            <ColorPicker
              format="hex"
              value={teamColour}
              onChange={setTeamColour}
            />
          </Group>
          <TextInput
            label="Team name"
            value={teamName}
            onChange={(event) => {
              resetErrors();
              setTeamName(event.currentTarget.value);
            }}
            description="The name of the team you want to create"
          />
          {teamNameError && (
            <Text color="red" size="xs">
              {teamNameError}
            </Text>
          )}
          <MultiSelect
            transition="pop-top-left"
            transitionDuration={80}
            transitionTimingFunction="ease"
            data={projects.projects}
            value={selectedProjects}
            onChange={setSelectedProjects}
            label="Projects for this team"
            placeholder="Pick as many as you want"
          />
          <Select
            transition="pop-top-left"
            transitionDuration={80}
            transitionTimingFunction="ease"
            label="Identify collaborators by"
            placeholder="Pick one"
            value={identifier}
            onChange={(value) => {
              resetErrors();

              setIdentifier(value);
            }}
            data={[
              { value: "", label: "" },
              { value: "jira", label: "Jira" },
              { value: "github", label: "Github" },
              { value: "gitlab", label: "Gitlab" },
            ]}
          />
          <Divider />
          <Space h="md" />
          <Group direction="column">
            <div>
              <Title order={2}>Team members</Title>
            </div>
            <div>
              <Table striped highlightOnHover>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Contributor</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            </div>
          </Group>
          {collaboratorsError && (
            <Text color="red" size="xs">
              {collaboratorsError}
            </Text>
          )}
        </Paper>
      )}
      {!newTeam &&
        teams.teams &&
        teams.teams.length > 0 &&
        teams.teams.map((team, idx) => {
          return (
            <Paper key={idx} padding="md" shadow="lg">
              <Accordion iconPosition="right">
                <Accordion.Item
                  label={
                    <Group>
                      <ActionIcon>
                        <SquareIcon
                          style={{ backgroundColor: `${team.teamColour}` }}
                        />
                      </ActionIcon>
                      <Text>{team.teamName}</Text>
                    </Group>
                  }
                >
                  <Group>
                    <Text>Projects: </Text>
                    {team.selectedProjects.map((proj, idx) => {
                      return <Badge key={idx}>{proj}</Badge>;
                    })}
                  </Group>
                  <Space h="md" />

                  <Group>
                    <Text>Collaborators: </Text>
                    {team.teamCollaborators.map((ic, idx) => {
                      return <Badge key={idx}>{ic.fullName}</Badge>;
                    })}
                  </Group>
                  <Grid justify="flex-end">
                    <Button
                      leftIcon={<TrashIcon />}
                      variant="white"
                      color="red"
                      onClick={() => {
                        deleteTeam(team);
                      }}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Accordion.Item>
              </Accordion>
            </Paper>
          );
        })}
      {teams && (teams.isFetching || collaborators.isFetching) && (
        <Skeleton height={12} radius="xl" />
      )}
      <Modal
        opened={confirm}
        onClose={() => setConfirm(false)}
        title={`Delete Team (${dTeam.teamName}) ?`}
        hideCloseButton
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.95}
      >
        <Group>
          <SimpleGrid cols={2}>
            <Button
              onClick={() => {
                setConfirm(false);

                // Delete the team
                deleteATeam();
              }}
              leftIcon={<PaperPlaneIcon />}
              variant="white"
            >
              Go for it!
            </Button>
            <Button
              onClick={() => {
                setConfirm(false);
              }}
              leftIcon={<TrashIcon />}
              variant="white"
              color="red"
            >
              Whooooa no
            </Button>
          </SimpleGrid>
        </Group>
      </Modal>
    </>
  );
}
