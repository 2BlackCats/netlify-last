import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import App from './App'
import Create from './Create';
function Layout() {

  const [obituaries, setObituaries] = useState([]);
  
  const getObituaries = () => {
    fetch("https://orn6l57ntazec7xavvw3ljm7ma0eeica.lambda-url.ca-central-1.on.aws/",{
      method:"GET",
    })
      .then((response)=>{return response.json();})
        .then((data)=>{setObituaries(data);})
        
  }
  const createObituaries = (imageURL, name, birth, death) => {
    const body = {
      ImageURL:imageURL,
      Name:name,
      Birth:birth,
      Death:death
    }
    fetch("https://orn6l57ntazec7xavvw3ljm7ma0eeica.lambda-url.ca-central-1.on.aws/",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000/",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify(body)
    });
    getObituaries();
  }

  useEffect(() => {
    getObituaries();
  })
    return (
      <>
      <nav className ="d-flex justify-content-between navbar">
        <div></div>
        <div className="navbar-brand text-center" >Navbar</div>
        <Popup trigger={<button type="button" className="btn btn-outline-secondary" >+ New Obituary</button>} modal>
          {<Create />}
        </Popup>
      </nav>
      <App obituaries={obituaries}/>
      </>
    );
  }
  
  export default Layout;