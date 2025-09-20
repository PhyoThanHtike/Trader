// components/ChartComponent.tsx
import React, { useState } from 'react';
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
  ZAxis,
  ReferenceLine
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
  height = 400,
  chartType
}) => {
  const [hoveredItem, setHoveredItem] = useState<any>(null);

  const formatXAxis = (tickItem: string) => {
    if (chartType === 'recentTrades') {
      return new Date(tickItem).toLocaleTimeString();
    }
    return tickItem;
  };

  const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1000) {
      return `${(tickItem / 1000).toFixed(0)}k`;
    }
    return tickItem.toFixed(2);
  };

  const getXLabel = () => {
    switch (chartType) {
      case 'recentTrades':
        return '';
      case 'orderDepth':
        return 'Price Level';
      case 'priceTrend':
      default:
        return 'Time';
    }
  };

  const getYLabel = (yAxisId?: string) => {
    switch (chartType) {
      case 'recentTrades':
        return yAxisId === 'right' ? 'Volume' : 'Price';
      case 'orderDepth':
        return 'Volume';
      case 'priceTrend':
      default:
        return 'Price';
    }
  };

  const renderCustomTooltip = (props: any) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-4 shadow-xl min-w-[200px]">
          {chartType === 'recentTrades' ? (
            <>
              <p className="font-semibold text-sm mb-2">
                {new Date(label).toLocaleString()}
              </p>
              {payload.map((entry: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: entry.color }}
                    />
                    {entry.name}:
                  </span>
                  <span className="font-medium">
                    {entry.value?.toLocaleString()} 
                  </span>
                </div>
              ))}
            </>
          ) : (
            <>
              <p className="font-semibold text-sm mb-2">{label}</p>
              {payload.map((entry: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: entry.color }}
                    />
                    {entry.name}:
                  </span>
                  <span className="font-medium">
                    {entry.value?.toLocaleString()}
                  </span>

                </div>
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
      const currentPrice = data.length > 0 ? data[data.length - 1][config.lines[0].key] : null;
      
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            onMouseMove={(e) => setHoveredItem(e.activePayload?.[0]?.payload)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey={config.xKey} 
              tickFormatter={formatXAxis}
              label={{ value: getXLabel(), position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              yAxisId="left" 
              tickFormatter={formatYAxis}
              label={{ 
                value: getYLabel(), 
                angle: -90, 
                position: 'insideLeft',
                offset: -10 
              }}
            />
            {config.lines.some(line => line.yAxisId === 'right') && (
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tickFormatter={formatYAxis}
                label={{ 
                  value: getYLabel('right'), 
                  angle: 90, 
                  position: 'insideRight',
                  offset: -10 
                }}
              />
            )}
            <Tooltip content={renderCustomTooltip} />
            <Legend />
            {currentPrice && hoveredItem && (
              <ReferenceLine 
                y={hoveredItem[config.lines[0].key]} 
                stroke="#666" 
                strokeDasharray="3 3" 
              />
            )}
            {config.lines.map((line) => (
              <Line
                key={line.key}
                yAxisId={line.yAxisId || 'left'}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0 }}
                dot={false}
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
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey={config.xKey} 
              label={{ value: getXLabel(), position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              label={{ 
                value: getYLabel(), 
                angle: -90, 
                position: 'insideLeft',
                offset: -10 
              }}
            />
            <Tooltip content={renderCustomTooltip} />
            <Legend />
            {buyData.length > 0 && (
              <Bar
                dataKey="volume"
                name="Buy Orders"
                fill="#10b981"
                data={buyData}
                radius={[4, 4, 0, 0]}
              />
            )}
            {sellData.length > 0 && (
              <Bar
                dataKey="volume"
                name="Sell Orders"
                fill="#ef4444"
                data={sellData}
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // Recent Trades Chart
    if (config.areas || config.points) {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey={config.xKey} 
              tickFormatter={formatXAxis}
              label={{ value: getXLabel(), position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              yAxisId="left" 
              tickFormatter={formatYAxis}
              label={{ 
                value: getYLabel(), 
                angle: -90, 
                position: 'insideLeft',
                offset: -10 
              }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tickFormatter={formatYAxis}
              label={{ 
                value: getYLabel('right'), 
                angle: 90, 
                position: 'insideRight',
                offset: -10 
              }}
            />
            <Tooltip content={renderCustomTooltip} />
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
                fillOpacity={0.2}
                strokeWidth={2}
              />
            ))}
            {config.points?.map((point) => (
              <Scatter
                key={point.name}
                yAxisId="right"
                name={point.name}
                dataKey={point.key}
                fill={point.color}
                opacity={0.7}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {data.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {data.length} data points
          </div>
        )}
      </div>
      
      {data.length > 0 ? (
        <div className="relative">
          {renderChart()}
          {hoveredItem && chartType === 'priceTrend' && config.lines && (
            <div className="absolute top-4 right-4 bg-background/90 border rounded-lg p-2 text-sm">
              <div>Price: {hoveredItem[config.lines[0].key]?.toFixed(2)}</div>
              <div>Time: {new Date(hoveredItem[config.xKey]).toLocaleTimeString()}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm">No data available</p>
          <p className="text-xs mt-1">Data will appear here when available</p>
        </div>
      )}
    </div>
  );
};

export default ChartComponent;