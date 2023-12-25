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

  const data = [
    {
      name: "2017",
      total: selectedAnimal && selectedYear && densityData ? densityData['properties'][`${selectedAnimal.toUpperCase()}_2017`] : null,
    },
    {
      name: "2018",
      total: selectedAnimal && selectedYear && densityData ? densityData['properties'][`${selectedAnimal.toUpperCase()}_2018`] : null,
    },
    {
      name: "2019",
      total: selectedAnimal && selectedYear && densityData ? densityData['properties'][`${selectedAnimal.toUpperCase()}_2019`] : null,
    },
    {
      name: "2020",
      total: selectedAnimal && selectedYear && densityData ? densityData['properties'][`${selectedAnimal.toUpperCase()}_2020`] : null,
    }
  ]

  const minValue = Math.min(...data.map(item => item.total));
  const maxValue = Math.max(...data.map(item => item.total));

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
          tickFormatter={(value, index) => index === 0 ? '' : value}
          domain={[minValue, maxValue]}>
        <Label value="Population" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill:"#6d28d9", fontSize:'14px'}} />
        </YAxis>
        <Tooltip
        contentStyle={{ backgroundColor: '#030712', color: '#606572', borderRadius:'10px' }}
        content={<CustomTooltip selectedAnimal={selectedAnimal}/>}/>
        <Legend align="left" verticalAlign="bottom" wrapperStyle={{ paddingBottom: "20px", paddingTop: "20px" }} />
        <Line type="monotone"
              dataKey="total"
              name={selectedAnimal && selectedYear && densityData ? `Évolution du nombre de ${selectedAnimal} entre 2017 et 2020` : "Choisir un animal et une année puis cliquer sur la carte"}
              stroke="#6d28d9"
              strokeWidth={2}/>
        <CartesianGrid stroke="#6d28d9" strokeDasharray="3 3" horizontal={false} vertical />
      </LineChart>
    </ResponsiveContainer>
  )
}
