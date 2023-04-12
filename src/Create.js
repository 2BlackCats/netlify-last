import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
function Create({handleClose, show, getObituaries}){
    const [BirthDate, setBirthDate] = useState("");
    const [DeathDate, setDeathDate] = useState("");
    const [DedName, setDedName] = useState("");
    const [Image, setImage] = useState();
    const [Loading, setLoading] = useState(false);

    const createObituaries = async (image, Name, Birth, Death) => {
        setLoading(true);
        if (!image){
          alert("No image was selected")
          setLoading(false);
          return
        }
        if (Name===""){
          alert("No Name was selected")
          setLoading(false);
          return
        }
        if (Birth===""){
          alert("No Birth Date was selected")
          setLoading(false);
          return
        }
        if (Death===""){
          alert("No Death Date was selected")
          setLoading(false);
          return
        }
        const Header = {
          name:Name,
          birth:Birth,
          death:Death
        }
        console.log(Header)
        const formdata=new FormData();
        formdata.append("file", image);
        const response = await fetch("https://ewzktoq6ec5htbnfcvpfmulmnq0abrhp.lambda-url.ca-central-1.on.aws/",{
          method: "POST",
          headers: Header,
          body: formdata//JSON.stringify(body)
        });
        console.log(response);
        setBirthDate("");
        setDeathDate("");
        setImage();
        setDedName("");
        await getObituaries();
        setLoading(false);
        handleClose();
      }
    return (
        <>
      <Modal show={show} onHide={handleClose}  fullscreen={true} style={{opacity: 0.8}}  centered>
        <Modal.Header className='border-0' closeButton>
        </Modal.Header>
        <Modal.Body className=" mx-auto vstack">
            <div className='my-auto'>
            <Modal.Title >Create New Obituary</Modal.Title>
                <Form.Group controlId="formFile" className="mb-3 d-flex flex-column">
                    <Form.Label>Upload photo of Deceased</Form.Label>
                    <input className='custom-file-input' onChange={(e) => setImage(e.target.files[0])} type="file" accept="image/*"></input>
                </Form.Group>


                <Form.Group className="mb-3" >
                    <Form.Label>Deceased Name &nbsp;</Form.Label>
                    <input className='rounded' type="text" placeholder="Enter Deceased Name" onChange={(e) => setDedName(e.target.value)}></input>
                </Form.Group>

                <div className="d-flex justify-content-between">
                    <div className='d-flex flex-column'>
                        <Form.Label>Birth Date</Form.Label>
                        <input className='rounded' type='date' onChange={(date) => setBirthDate(date.target.value)}></input>
                    </div>
                    <div className='d-flex flex-column'>
                        <Form.Label>Death Date</Form.Label>
                        <input className='rounded' type='date' onChange={(date) => setDeathDate(date.target.value)}></input>
                    </div>
                </div>
                {!Loading ?<button type="button" className="btn btn-primary my-3" onClick={() => createObituaries(Image, DedName, BirthDate, DeathDate)}>Create Obituary</button>:<button type="button" className="btn btn-secondary my-3" onClick={() => createObituaries(Image, DedName, BirthDate, DeathDate)} disabled>Loading...</button>}
            </div>
        </Modal.Body>

       

      </Modal>
    </>
  );
}

export default Create;