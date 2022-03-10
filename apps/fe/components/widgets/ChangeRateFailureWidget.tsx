import { useEffect, useState } from "react";
import axios from "axios";

import { MediaQuery, Paper, Title } from "@mantine/core";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { formatDate } from "./utils";

export default function ChangeRateFailureWidget(props) {
  const { selectedProject, selectedTeam, dates } = props;
  const [data, setData] = useState({
    data: [],
    isFetching: false,
  });

  useEffect(() => {
    // Change format of dates!
    if (dates && dates[0] && dates[1]) {
      const from = formatDate(dates[0]);
      const to = formatDate(dates[1]);

      const fetchChangeRateFailure = async () => {
        try {
          setData({ data: data.data, isFetching: true });
          const response = await axios.get(
            `http://localhost:5000/v1/getChangeRateFailure?selectedProject=${selectedProject}&selectedTeam=${selectedTeam}&from=${from}&to=${to}`
          );
          setData({ data: response.data, isFetching: false });
        } catch (e) {
          console.log(e);
          setData({ data: data.data, isFetching: false });
        }
      };
      fetchChangeRateFailure();
    }
  }, [selectedProject, selectedTeam, dates]);

  return (
    <>
      <MediaQuery
        smallerThan="lg"
        styles={{ fontSize: 20, "&:hover": { backgroundColor: "silver" } }}
      >
        <Title>Change Rate Failure</Title>
      </MediaQuery>
      <Paper padding="md" shadow="xs" style={{ minHeight: "250px" }}>
        <ResponsiveContainer>
          <AreaChart
            data={data.data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              label={{
                value: "Per Day",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="failures"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Paper>
    </>
  );
}
