import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Map as MapLibreMap, NavigationControl, Popup } from 'maplibre-gl';
import { GeocodingControl } from '@maptiler/geocoding-control/maplibregl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@maptiler/geocoding-control/style.css';
import {point, inside} from '@turf/turf';
import { useDispatch } from 'react-redux';
import { setDensityData } from '@/densityDataReducer';

interface MapProps {
  selectedYear: string;
  selectedAnimal: string;
}

const API_KEY = '4sE0MBX4XpmZocqe4c6z';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  height: 475px;
  width: calc(100% - 40px);
  border-radius: 5px;
  overflow: hidden;
`;

const Legend = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: rgba(3, 7, 18, 0.9);
  color: #fff;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 5px;
  opacity: 0.9;
  z-index: 9999;
  font-size: 12px;
  max-width: 250px;
  box-sizing: border-box;
`;

export const Map: React.FC<MapProps> = ({ selectedYear, selectedAnimal }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibreMap | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {

    if (!mapContainerRef.current) {
      return;
    }

    const newMap = new MapLibreMap({
      container: mapContainerRef.current,
      center: [2.209667, 46.232193],
      zoom: 4.5,
      style: `https://api.maptiler.com/maps/hybrid/style.json?key=${API_KEY}`
    });

    newMap.on('load', () => {

      const nav = new NavigationControl({ visualizePitch: true });
      newMap.addControl(nav, "top-left");

      const gc = new GeocodingControl({
        apiKey: API_KEY,
        types: ['municipality'],
        country:['fr'],
        fuzzyMatch: true
      });

      newMap.on('click', async(e) => {

        const clickPoint = point([e.lngLat.lng, e.lngLat.lat]);

        fetch('density_animal.geojson')
          .then(response => response.json())
          .then(data => {
            let insideFeature = null;

            for (const feature of data.features) {
              if (inside(clickPoint, feature)) {
                insideFeature = feature;
                break;
              }
            }

          if (insideFeature) {
            dispatch(setDensityData(insideFeature));
           } else {
            console.log('Le point cliqué n’est pas à l’intérieur d’une entité GeoJSON.');
          }
        });

      });

      newMap.addControl(gc, "top-right");
      setMap(newMap)
    });

    return () => newMap.remove();
  }, []);

useEffect(() => {
  if (!map || !selectedAnimal || !selectedYear) return;

  const layerId = 'data-animal';
  const densityKey = `DENSITE_${selectedAnimal.toUpperCase()}_${selectedYear}`;
  const sourceDataUrl = `density_animal.geojson`;
  const source = map.getSource(layerId)

  if (!map.getSource(layerId)) {
    map.addSource(layerId, {
      type: 'geojson',
      data: sourceDataUrl,
    });
  }

  if (!map.getLayer(layerId)) {
    map.addLayer({
      id: layerId,
      type: 'fill',
      source: layerId,
      layout: {},
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', densityKey],
          0, '#ffffb2',
          74, '#feb751',
          291, '#f45629',
          1135, '#bd0026'
        ],
        'fill-opacity': 0.7
      }
    });
  } else {
    if(source){
      if(source.type == 'geojson') {
        (source as maplibregl.GeoJSONSource).setData(sourceDataUrl);
          map.setPaintProperty(layerId, 'fill-color', [
          'interpolate',
          ['linear'],
          ['get', densityKey],
          0, '#ffffb2',
          74, '#feb751',
          291, '#f45629',
          1135, '#bd0026'
      ]);
      }
    }

    map.setPaintProperty(layerId, 'fill-color', [
      'interpolate',
      ['linear'],
      ['get', densityKey],
      0, '#ffffb2',
      74, '#feb751',
      291, '#f45629',
      1135, '#bd0026'
    ]);
  }

    const handleClick = (e: maplibregl.MapMouseEvent) => {
    const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
    const densite = features.length > 0 ? features[0].properties[densityKey] : 'Non disponible';
    const nom_comm = features.length > 0 ? features[0].properties["nom_comm_x"] : 'Non disponible';
    const code_insee = features.length > 0 ? features[0].properties["insee_com"] : 'Non disponible';
    const superficie_km = features.length > 0 ? features[0].properties["superficie_km2"] : 'Non disponible';

    new Popup({closeOnClick: true})
      .setLngLat([e.lngLat.lng, e.lngLat.lat])
      .setHTML(`<div>Commune : <b>${nom_comm}</b></br>
      Code Insee : <b>${code_insee}</b></br>
      Densité (${selectedAnimal}/km2) : <b>${densite && densite.toFixed(2)}</b></br>
      Superficie (km2) : <b>${superficie_km}</b></div>`)
      .addTo(map);
  };

   map.on('click', handleClick);

  return () => {map.off('click', handleClick)};

}, [map, selectedYear, selectedAnimal]);

  return (
  <>
   <style>
    {`
      .maplibregl-popup-content {
        background-color: rgba(3, 7, 18, 0.9);
        color: #fff;
        border: 1px solid black;
        padding: 5px;
        border-radius: 5px;
        opacity: 0.9;
        z-index: 9999;
        width:200px;
        box-sizing: border-box;
      }
    `}
    </style>
    <Wrapper>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', borderRadius: 5 }} />
      { selectedYear && selectedAnimal &&
      <Legend>
        <h3 style={{ marginBottom:'10px'}}>Densité de {selectedAnimal} <br></br>({selectedAnimal}/km²)</h3>
          <div style={{ marginBottom: '5px' }}>
            <div style={{ backgroundColor: '#ffffb2', width: '20px', height: '20px', display: 'inline-block',  verticalAlign: 'middle'}}></div>
            <span style={{ verticalAlign: 'top' }}> 0 - 74 </span>
          </div>
          <div style={{ marginBottom: '5px' }}>
            <div style={{ backgroundColor: '#feb751', width: '20px', height: '20px', display: 'inline-block',  verticalAlign: 'middle'}}></div>
            <span style={{ verticalAlign: 'top' }}> 74 - 291 </span>
          </div>
          <div style={{ marginBottom: '5px' }}>
            <div style={{ backgroundColor: '#f45629', width: '20px', height: '20px', display: 'inline-block',  verticalAlign: 'middle' }}></div>
            <span style={{ verticalAlign: 'top' }}> 291 - 1135</span>
          </div>
          <div style={{ marginBottom: '5px' }}>
            <div style={{ backgroundColor: '#bd0026', width: '20px', height: '20px', display: 'inline-block',  verticalAlign: 'middle' }}></div>
            <span style={{ verticalAlign: 'top' }}> 1135 et plus </span>
          </div>
      </Legend>
      }
    </Wrapper>
  </>
  );
};

export default Map;
