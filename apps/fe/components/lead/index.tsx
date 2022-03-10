import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

import {
  Avatar,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Skeleton,
  Stepper,
  Text,
  Title,
} from "@mantine/core";

export default function LeadTime(props) {
  const [data, setData] = useState({ projects: [], isFetching: false });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setData({ projects: data.projects, isFetching: true });
        const response = await axios.get(
          "http://localhost:5000/v1/projectInformation?project=ps-front"
        );
        setData({ projects: response.data, isFetching: false });
      } catch (e) {
        console.log(e);
        setData({ projects: data.projects, isFetching: false });
      }
    };
    fetchProjects();
  }, []);

  return (
    <>
      <LoadingOverlay visible={data.isFetching} />
      <Title sx={{ fontSize: 50, fontWeight: 900, letterSpacing: -2 }}>
        Lead Time
      </Title>
      <Divider />
      {data.projects &&
        data.projects.length > 0 &&
        data.projects.map((proj, idx) => {
          let active = 1;
          if (
            proj.leadTimeToProduction &&
            proj.leadTimeToProduction.seconds > 0
          ) {
            active = 4;
          }
          return (
            <SimpleGrid cols={1} key={idx}>
              <div>
                <Paper padding="md" shadow="lg">
                  <SimpleGrid
                    breakpoints={[
                      { maxWidth: 980, cols: 3, spacing: "md" },
                      { maxWidth: 755, cols: 2, spacing: "sm" },
                      { maxWidth: 600, cols: 1, spacing: "sm" },
                    ]}
                  >
                    <Group noWrap>
                      <Avatar src={proj.author[0].avatar} />
                      <Text size="xs">{proj.author[0].author}</Text>

                      <Link
                        href="https://premiersupremos.atlassian.net/browse/PREM-3"
                        passHref
                      >
                        <Text component="a" size="lg">
                          {proj.ticket}
                          {!proj.leadTimeToProduction.seconds && (
                            <Text size="xs">(In progress)</Text>
                          )}
                        </Text>
                      </Link>
                    </Group>
                    <Group noWrap>
                      <Stepper active={active} breakpoint="sm">
                        <Stepper.Step
                          allowStepClick={false}
                          label="Work Started"
                        ></Stepper.Step>
                        <Stepper.Step label="Review Requested"></Stepper.Step>
                        <Stepper.Step label="Merged"></Stepper.Step>
                        <Stepper.Step label="Deployed"></Stepper.Step>
                      </Stepper>
                    </Group>
                  </SimpleGrid>
                  {proj.leadTimeToProduction.seconds > 0 && (
                    <div>
                      <Paper padding="md" shadow="xs">
                        <SimpleGrid
                          cols={4}
                          breakpoints={[
                            { maxWidth: 980, cols: 3, spacing: "md" },
                            { maxWidth: 755, cols: 2, spacing: "sm" },
                            { maxWidth: 600, cols: 1, spacing: "sm" },
                          ]}
                        >
                          <Text>Completed In:</Text>
                          <Text>
                            {proj.leadTimeToProduction.seconds} Seconds
                          </Text>
                          <Text>
                            {proj.leadTimeToProduction.minutes} Minutes
                          </Text>
                          <Text>{proj.leadTimeToProduction.hours} Hours</Text>
                        </SimpleGrid>
                      </Paper>
                    </div>
                  )}
                </Paper>
              </div>
            </SimpleGrid>
          );
        })}
      {data && data.isFetching && <Skeleton height={12} radius="xl" />}
    </>
  );
}
