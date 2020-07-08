import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import {ListLogEntries} from './API';
const App = () =>  {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.6,
    longitude: -95.665,
    zoom: 3
  });


//function only runs once when the compnet is mounted
  useEffect( () => {
    ( async () => {
      const logEntries = await ListLogEntries();
      setLogEntries(logEntries);
    }) ();
  },[] );

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/thecjreynolds/ck117fnjy0ff61cnsclwimyay"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      >
        {
        logEntries.map(entry => (  
          <>
        <Marker 
          key={entry._id}
          latitude={entry.latitude} 
          longitude={entry.longitude} 
         // offsetLeft={-20} 
         // offsetTop={-10} 
         style={{
          height: `${6 * viewport.zoom}px`,
          width: `${6 * viewport.zoom}px`,
        }}
         >
           <div
            onClick={() => setShowPopup({
              // ...showPopup,
              [entry._id]: true,
            })}
           >

            <img
             className="marker" 
             src="https://i.imgur.com/y0G5YTX.png" 
             alt="marker"/>
           </div>
           
        </Marker>
        
         {
          showPopup[entry._id] ? (
            <Popup
              latitude={entry.latitude}
              longitude={entry.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setShowPopup({})}
              anchor="top" >
              <div className="popup">
                <h3>{entry.title}</h3>
                <p>{entry.comments}</p>
                <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
                {entry.image && <img src={entry.image} alt={entry.title} />}
              </div>
            </Popup>
          ) : null
        }
        </>
        )
        )
        
        }
      </ReactMapGL>
  );
}

export default App;