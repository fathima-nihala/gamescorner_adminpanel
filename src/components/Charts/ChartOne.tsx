import { useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchChartData, setPeriod } from '../../slices/dashboardSlice';
import { ApexOptions } from 'apexcharts';

const ChartOne = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    chartData,
    summary,
    period,
    loading,
    error
  } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchChartData(period));
  }, [dispatch, period]);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'area' as const,
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: 'straight',
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: ['#3056D3', '#80CAEE'],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: 'category',
      categories: chartData.periods,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: [
      {
        title: {
          text: 'Orders',
          style: {
            fontSize: '12px',
          },
        },
        min: 0,
        max: 20,
        forceNiceScale: false,
        labels: {
          formatter: (value: number) => value.toString()
        },
        tickAmount: 4,
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true
        }
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => value.toString(),
      },
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Revenue</p>
              <p className="text-sm font-medium">${summary.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total Orders</p>
              <p className="text-sm font-medium">{summary.totalOrders.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            {(['day', 'week', 'month'] as const).map((p) => (
              <button
                key={p}
                className={`rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark ${
                  period === p ? 'bg-white shadow-card dark:bg-boxdark' : ''
                }`}
                onClick={() => dispatch(setPeriod(p))}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="flex h-80 items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex h-80 items-center justify-center">
            <p className="text-danger">{error}</p>
          </div>
        ) : (
          <div id="chartOne" className="-ml-5">
            <ReactApexChart
              options={options}
              series={chartData.series}
              type="area"
              height={350}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartOne;