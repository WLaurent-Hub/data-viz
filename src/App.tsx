import './App.css'
import { Tabs, TabsContent } from '@radix-ui/react-tabs'
import { Card, CardTitle, CardDescription, CardContent, CardHeader } from './components/ui/card'
import { ThemeProvider} from '@/components/theme-provider'
import { ModeToggle } from '@/components/mode-toggle'
import { SelectYear } from './components/select-year'
import { Overview } from './components/bar-chart'
import Map  from './components/webmap'
import { SelectAnimal } from './components/select-animal'
import { getData } from './assets/data-pop'
import { useState } from 'react'
import { useSelector } from "react-redux";
import { RootState } from "@/rootReducer";

type DataReturnType = {
  nb_comm: number;
  pop_max: number;
  pop_min: number;
  pop_med: number;
}

function App() {

  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const year = selectedYear;
  const animal = selectedAnimal;
  const pop_data = getData(year, animal) as DataReturnType;
  const year_prec = getData((parseInt(year) - 1).toString(), animal) as DataReturnType;
  const densityData = useSelector((state: RootState) => state.densityData.densityData);

  function evolve_pop(last_value: number, new_value: number): number {
    const result = ((new_value - last_value) / last_value) * 100;
    return result;
  }
  const graphic_title =
    year && animal && densityData ? `Nombre de ${animal} dans la commune de ${densityData['properties']['nom_comm_x']} entre 2017 et 2020` :
    year && animal ? `Nombre de ${animal} en France entre 2017 et 2020`  : 'Nombre de chien en France entre 2017 et 2020';

  return (
    <>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className='hidden flex-col md:flex'>
       <div className='flex-1 space-y-4 p-8 pt-6'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-3xl font-bold tracking-tight'>Tableau de bord - ICAD</h2>
          <div className='flex items-center space-x-2'>
            <SelectAnimal setSelectedAnimal={setSelectedAnimal}/>
            <SelectYear selectedYear={selectedYear} setSelectedYear={setSelectedYear}/>
            <ModeToggle/>
          </div>
        </div>
        <div className='border-b'/>
        <Tabs defaultValue='overview' className='space-y-4'>
          <h5 className='text-lg text-muted-foreground font-medium tracking-tight'>Visualisation des données</h5>
          <TabsContent value="overview" className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader
                  className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Nombre de communes enregistrées
                  </CardTitle>
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-muted-foreground"
                      strokeWidth="2">
                      <polyline points="1,8 12,3 23,8" />
                      <line x1="4" y1="8" x2="4" y2="21" />
                      <line x1="8" y1="8" x2="8" y2="21" />
                      <line x1="12" y1="8" x2="12" y2="21" />
                      <line x1="16" y1="8" x2="16" y2="21" />
                      <line x1="20" y1="8" x2="20" y2="21" />
                      <line x1="1" y1="21" x2="23" y2="21" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ pop_data.nb_comm ? pop_data.nb_comm : 34033 }</div>
                    <p className="text-xs text-muted-foreground">
                      {pop_data.nb_comm ?
                        (
                          (evolve_pop(year_prec.nb_comm, pop_data.nb_comm) > 0 ?
                              `+${evolve_pop(year_prec.nb_comm, pop_data.nb_comm).toFixed(1)}` :
                              evolve_pop(year_prec.nb_comm, pop_data.nb_comm).toFixed(1)
                          ) + "% depuis l'année dernière"
                        ) : "+0.6% depuis l'année dernière"
                      }
                    </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader
                  className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Population maximale { pop_data.pop_max ? <b>(Toulouse)</b> : ''}
                  </CardTitle>
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground">
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <polyline points="5,11 12,4 19,11" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ pop_data.pop_max ? pop_data.pop_max : 28235 }</div>
                  <p className="text-xs text-muted-foreground">
                    {pop_data.nb_comm ?
                        (
                          (evolve_pop(year_prec.pop_max, pop_data.pop_max) > 0 ?
                              `+${evolve_pop(year_prec.pop_max, pop_data.pop_max).toFixed(1)}` :
                              evolve_pop(year_prec.pop_max, pop_data.pop_max).toFixed(1)
                          ) + "% depuis l'année dernière"
                        ) : "-1.1% depuis l'année dernière"
                      }
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader
                  className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle
                    className="text-sm font-medium">
                    Population minimale
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground">
                    <line x1="12" y1="4" x2="12" y2="20" />
                    <polyline points="5,13 12,20 19,13" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ pop_data.pop_min ? pop_data.pop_min : 1 }</div>
                  <p className="text-xs text-muted-foreground">
                    {pop_data.nb_comm ?
                        (
                          (evolve_pop(year_prec.pop_min, pop_data.pop_min) > 0 ?
                              `+${evolve_pop(year_prec.pop_min, pop_data.pop_min).toFixed(1)}` :
                              evolve_pop(year_prec.pop_min, pop_data.pop_min).toFixed(1)
                          ) + "% depuis l'année dernière"
                        ) : "0.0% depuis l'année dernière"
                      }
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader
                  className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Population médian
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ pop_data.pop_med ? pop_data.pop_med : 129 }</div>
                  <p className="text-xs text-muted-foreground">
                    {pop_data.nb_comm ?
                        (
                          (evolve_pop(year_prec.pop_med, pop_data.pop_med) > 0 ?
                              `+${evolve_pop(year_prec.pop_med, pop_data.pop_med).toFixed(1)}` :
                              evolve_pop(year_prec.pop_med, pop_data.pop_med).toFixed(1)
                          ) + "% depuis l'année dernière"
                        ) : "+1.2% depuis l'année dernière"
                      }
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>
                    Densité de { selectedAnimal ? selectedAnimal : "chien"} par commune en {selectedYear ? selectedYear : '2020'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center p-0">
                  <Map selectedYear={year} selectedAnimal={animal}/>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Graphique</CardTitle>
                  <CardDescription>
                  {graphic_title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                <Overview selectedAnimal={animal} selectedYear={year}/>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
      </ThemeProvider>
    </>
 )
}

export default App
