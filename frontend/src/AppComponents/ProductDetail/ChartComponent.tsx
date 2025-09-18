// components/ChartComponent.tsx
import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Scatter,
  ScatterChart,
  ZAxis
} from 'recharts';

interface ChartConfig {
  xKey: string;
  lines?: Array<{
    key: string;
    name: string;
    color: string;
    yAxisId?: string;
  }>;
  bars?: Array<{
    key: string;
    name: string;
    fill: string;
    filter?: (d: any) => boolean;
  }>;
  areas?: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  points?: Array<{
    key: string;
    name: string;
    color: string;
  }>;
}

interface ChartComponentProps {
  data: any[];
  config: ChartConfig;
  title: string;
  height?: number;
  chartType?: 'priceTrend' | 'orderDepth' | 'recentTrades';
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  data,
  config,
  title,
  height = 300,
  chartType
}) => {
  const formatXAxis = (tickItem: string) => {
    if (chartType === 'recentTrades') {
      return new Date(tickItem).toLocaleTimeString();
    }
    return tickItem;
  };

  const renderTooltip = (props: any) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          {chartType === 'recentTrades' ? (
            <>
              <p className="font-semibold">{new Date(label).toLocaleString()}</p>
              {payload.map((entry: any, index: number) => (
                <p key={index} style={{ color: entry.color }}>
                  {entry.name}: {entry.value}
                </p>
              ))}
            </>
          ) : (
            <>
              <p className="font-semibold">{label}</p>
              {payload.map((entry: any, index: number) => (
                <p key={index} style={{ color: entry.color }}>
                  {entry.name}: {entry.value}
                </p>
              ))}
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    // Price Trend Chart (Line Chart)
    if (config.lines) {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={config.xKey} 
              tickFormatter={formatXAxis}
            />
            <YAxis yAxisId="left" />
            {config.lines.some(line => line.yAxisId === 'right') && (
              <YAxis yAxisId="right" orientation="right" />
            )}
            <Tooltip content={renderTooltip} />
            <Legend />
            {config.lines.map((line) => (
              <Line
                key={line.key}
                yAxisId={line.yAxisId || 'left'}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    // Order Depth Chart (Bar Chart)
    if (config.bars) {
      const buyData = data.filter(item => item.type === 'buy');
      const sellData = data.filter(item => item.type === 'sell');

      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis />
            <Tooltip content={renderTooltip} />
            <Legend />
            {buyData.length > 0 && (
              <Bar
                dataKey="volume"
                name="Buy Volume"
                fill="#00C49F"
                data={buyData}
              />
            )}
            {sellData.length > 0 && (
              <Bar
                dataKey="volume"
                name="Sell Volume"
                fill="#FF8042"
                data={sellData}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // Recent Trades Chart (Area Chart for price, Scatter for volume)
    if (config.areas || config.points) {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={config.xKey} 
              tickFormatter={formatXAxis}
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={renderTooltip} />
            <Legend />
            {config.areas?.map((area) => (
              <Area
                key={area.name}
                yAxisId="left"
                type="monotone"
                dataKey={area.key}
                name={area.name}
                stroke={area.color}
                fill={area.color}
                fillOpacity={0.3}
              />
            ))}
            {config.points?.map((point) => (
              <Scatter
                key={point.name}
                yAxisId="right"
                name={point.name}
                dataKey={point.key}
                fill={point.color}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No chart data available
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {data.length > 0 ? renderChart() : (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No data available
        </div>
      )}
    </div>
  );
};

export default ChartComponent;