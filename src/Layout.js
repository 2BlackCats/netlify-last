import React, { useEffect, useState } from 'react';
import App from './App';
import Create from './Create';
function Layout() {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [obituaries, setObituaries] = useState([]);
  
  const getObituaries = () => {
    console.log("Shit");
    fetch("https://bhakaiz7jjw6pjou7qmy6gybqy0ohbrr.lambda-url.ca-central-1.on.aws/",{
      method:"GET",
    })
      .then((response)=>{return response.json();})
        .then((data)=>{setObituaries(data);})
        
  }

  useEffect(() => {
    getObituaries();
  }, [])
  
    return (
      <>
      <nav className ="navbar">
        <div>&nbsp;</div>
        <div className="navbar-brand" style={{position: 'absolute', left: '46.5%'}}>The Last Show</div>
        <button type="button" className="btn btn-outline-secondary" onClick={handleShow}>+ New Obituary</button>
      </nav>
      <Create show={show} handleClose={handleClose} getObituaries={getObituaries}/>
      <App obituaries={obituaries}/>
      </>
    );
  }
  
  export default Layout;