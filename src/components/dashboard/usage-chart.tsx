"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const fallbackUsageData = [
  { day: "Mon", apiCalls: 18200, revenue: 4100 },
  { day: "Tue", apiCalls: 24100, revenue: 5200 },
  { day: "Wed", apiCalls: 22300, revenue: 4980 },
  { day: "Thu", apiCalls: 31800, revenue: 6800 },
  { day: "Fri", apiCalls: 37200, revenue: 7400 },
  { day: "Sat", apiCalls: 29600, revenue: 6100 },
  { day: "Sun", apiCalls: 41400, revenue: 8300 }
];

async function getUsageData() {
  return fallbackUsageData;
}

export function UsageChart() {
  const { data = fallbackUsageData, isFetching } = useQuery({
    queryKey: ["tenant-usage-chart"],
    queryFn: getUsageData
  });

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="grid gap-2">
          <Badge variant="secondary">TanStack Query + Recharts</Badge>
          <CardTitle>Weekly API and revenue trend</CardTitle>
          <CardDescription>
            Replace the query function with `/api/v1/usage` once authenticated
            tenant APIs are connected.
          </CardDescription>
        </div>
        <Badge>{isFetching ? "Refreshing" : "Live demo"}</Badge>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={data} margin={{ left: -18, right: 8, top: 10 }}>
              <defs>
                <linearGradient id="apiCalls" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#2fe6a7" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#2fe6a7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#65b7ff" stopOpacity={0.38} />
                  <stop offset="95%" stopColor="#65b7ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 16,
                  color: "#f8fafc"
                }}
              />
              <Area
                dataKey="apiCalls"
                fill="url(#apiCalls)"
                name="API calls"
                stroke="#2fe6a7"
                strokeWidth={3}
                type="monotone"
              />
              <Area
                dataKey="revenue"
                fill="url(#revenue)"
                name="Revenue"
                stroke="#65b7ff"
                strokeWidth={3}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
