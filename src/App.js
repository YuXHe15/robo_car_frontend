import React, { useState, useEffect, useRef} from 'react';
import './App.css'; // Make sure to import the CSS file

function App() {
  const [lidarData, setLidarData] = useState('');
  const [logMessages, setLogMessages] = useState([]);

  // Convert WebSocket URL to HTTP URL for fetch calls
  const backendHttpUrl = process.env.REACT_APP_BACKEND_URL.replace(/^ws/, 'http');
  const logContainerRef = useRef(null);


  useEffect(() => {
    const lidarSocket = new WebSocket(`${process.env.REACT_APP_BACKEND_URL}/stream/lidar`);
    lidarSocket.onmessage = event => {
      setLidarData(event.data);
    };

    const logsSocket = new WebSocket(`${process.env.REACT_APP_BACKEND_URL}/stream/logs`);

    logsSocket.onmessage = event => {
      setLogMessages(prevMessages => [...prevMessages, event.data]);
    };

    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
    // Clean up WebSocket connections on component unmount
    return () => {
      lidarSocket.close();
      logsSocket.close();
    };
  }, [logMessages]);

  return (
    <div>
      <h1>LiDAR Data:</h1>
      <p>{lidarData}</p>
      <h1>Logs:</h1>
      <div className="log-container" ref={logContainerRef}>
        {logMessages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <button onClick={() => {
        sendCommand('forward')
        .then(data => {
          const newLogMessage = `Kinetic Response - Status: ${data.status}, Command: ${data.command}`;
          setLogMessages(prevMessages => [...prevMessages, newLogMessage]);
        })
        .catch(error => {
          // Handle any errors here, including updating the log with error messages
          setLogMessages(prevMessages => [...prevMessages, `Error: ${error.message}`]);
        });
        }}>Move Forward</button>
      <button onClick={() => {
        sendCommand('stop')
        .then(data => {
          const newLogMessage = `Kinetic Response - Status: ${data.status}, Command: ${data.command}`;
          setLogMessages(prevMessages => [...prevMessages, newLogMessage]);
        })
        .catch(error => {
          // Handle any errors here, including updating the log with error messages
          setLogMessages(prevMessages => [...prevMessages, `Error: ${error.message}`]);
        });
        }}>Stop</button>
      <button onClick={() => {
        sendCommand('turn right')
        .then(data => {
          const newLogMessage = `Kinetic Response - Status: ${data.status}, Command: ${data.command}`;
          setLogMessages(prevMessages => [...prevMessages, newLogMessage]);
        })
        .catch(error => {
          // Handle any errors here, including updating the log with error messages
          setLogMessages(prevMessages => [...prevMessages, `Error: ${error.message}`]);
        });
        }}>Turn right</button>
      <button onClick={() => {
        sendCommand('turn left')
        .then(data => {
          const newLogMessage = `Kinetic Response - Status: ${data.status}, Command: ${data.command}`;
          setLogMessages(prevMessages => [...prevMessages, newLogMessage]);
        })
        .catch(error => {
          // Handle any errors here, including updating the log with error messages
          setLogMessages(prevMessages => [...prevMessages, `Error: ${error.message}`]);
        });
        }}>Turn left</button>
      {/* Add more buttons or controls as needed */}
    </div>
  );
}

export default App;

function sendCommand(commandType) {
  const backendHttpUrl = process.env.REACT_APP_BACKEND_URL.replace(/^ws/, 'http');
  
  // Return the fetch promise
  return fetch(`${backendHttpUrl}/control/kinetic`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ command: commandType }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return response.json();
  });
}