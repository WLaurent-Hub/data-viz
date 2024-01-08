"use client"

import { LineChart, CartesianGrid, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Label, TooltipProps} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/rootReducer";

interface GraphProps {
  selectedYear: string;
  selectedAnimal: string;
}

type PayloadType = number;
type LabelType = string;

interface CustomTooltipProps extends TooltipProps<PayloadType, LabelType> {
  selectedAnimal: string;
}

export function Overview({selectedYear, selectedAnimal}: GraphProps) {

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, selectedAnimal }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const population = data.total;

      return (
        <div className="custom-tooltip" style={{
          fontSize:'12px',
          backgroundColor: '#030712',
          color: '#606572',
          borderRadius:'5px',
          border: '0.5px solid #ccc',
          padding: '5px'  }}>
          <p className="label">Année : <b>{label}</b> </p>
          <p className="label">Effectif : <b>{population} {selectedAnimal}</b></p>
        </div>
      );
    }

    return null;
  };

  const densityData = useSelector((state: RootState) => state.densityData.densityData);

  const calculateTotal = (year: string) => {
    if (selectedAnimal && selectedYear && densityData) {
      return densityData['properties'][`${selectedAnimal.toUpperCase()}_${year}`];
    } else if (selectedAnimal === "chien" && selectedYear) {
      switch(year) {
        case "2017": return 9860236;
        case "2018": return 9898810;
        case "2019": return 9930949;
        case "2020": return 9973306;
        default: return null;
      }
    } else if (selectedAnimal === "chat" && selectedYear) {
      switch(year) {
        case "2017": return 5984099;
        case "2018": return 6313201;
        case "2019": return 6659837;
        case "2020": return 7022555;
        default: return null;
      }
    }
    return null;
  };

  const data = [
    {
      name: "2017",
      total: calculateTotal("2017"),
    },
    {
      name: "2018",
      total: calculateTotal("2018"),
    },
    {
      name: "2019",
      total: calculateTotal("2019"),
    },
    {
      name: "2020",
      total: calculateTotal("2020"),
    }
  ];

  const minValue = Math.min(...data.map(item => item.total));
  const maxValue = Math.max(...data.map(item => item.total));

  const formatTick = (value: number) => {
    return value >= 1e6 ? `${(value / 1e6).toFixed(1)}M` : value.toString();
  };

  return (
    <ResponsiveContainer width="100%" height={550}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}>
        <Label value="Année" offset={0} position="insideBottom" style={{ fill:"#6d28d9", fontSize:'14px'}}/>
        </XAxis>
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value, index) => index === 0 ? '' : formatTick(value) }
          domain={[minValue, maxValue]}>
        <Label value="Population" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill:"#6d28d9", fontSize:'14px'}} />
        </YAxis>
        <Tooltip
        contentStyle={{ backgroundColor: '#030712', color: '#606572', borderRadius:'10px' }}
        content={<CustomTooltip selectedAnimal={selectedAnimal}/>}/>
        <Legend align="left" verticalAlign="bottom" wrapperStyle={{ paddingBottom: "20px", paddingTop: "20px" }} />
        <Line type="monotone"
              dataKey="total"
              name={selectedAnimal && selectedYear ? `Évolution du nombre de ${selectedAnimal} entre 2017 et 2020` : `Évolution du nombre de chien entre 2017 et 2020`}
              stroke="#6d28d9"
              strokeWidth={2}/>
        <CartesianGrid stroke="#6d28d9" strokeDasharray="3 3" horizontal={false} vertical />
      </LineChart>
    </ResponsiveContainer>
  )
}
