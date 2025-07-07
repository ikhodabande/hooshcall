import { iranSans } from '@/lib/fonts';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartData {
  options: ApexCharts.ApexOptions;
  series: {
    data: { x: string; y: number }[];
  }[];
}

export default function BestSellingProducts() {
  const [chartData, setChartData] = useState<ChartData>({
    options: {
      chart: {
        fontFamily: iranSans.style.fontFamily,
        id: 'best-selling-products',
        animations: {
          enabled: true,
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
      },
      legend: {
        show: false, // Disable legend for treemap
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '14px',
          fontFamily: iranSans.style.fontFamily,
        },
        formatter: (text: string, { value }: { value: number }) => `${value} عدد`, // Show count with "units"
      },
      plotOptions: {
        treemap: {
          enableShades: false, // Disable shading
          colorScale: {
            ranges: [
              {
                from: 0,
                to: 150,
                color: '#bdbdbd', // Red for small values
              },
              // {
              //   from: 101,
              //   to: 150,
              //   color: '#FFA500', // Orange for medium values
              // },
              {
                from: 151,
                to: 200,
                color: '#FAD038', // Green for large values
              },
            ],
          },
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `فروخته شده: ${val} عدد`,
        },
      },
    },
    series: [{ data: [] }],
  });

  useEffect(() => {
    const fetchData = () => {
      const products = [
        { x: 'کالای شماره 1', y: 120 },
        { x: 'کالای شماره 2', y: 200 },
        { x: 'کالای شماره 3', y: 150 },
        { x: 'کالای شماره 4', y: 180 },
        { x: 'کالای شماره 5', y: 90 },
      ];

      setChartData(prevData => ({
        ...prevData,
        series: [
          {
            ...prevData.series[0],
            data: products,
          },
        ],
      }));
    };

    fetchData();
  }, []);

  return (
    <div
      className="w-full"
      style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '20px' }}
    >
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="treemap"
        width="100%"
        height="400"
      />
    </div>
  );
}
