import React, { useState } from 'react';
function Obituaries({data}) {
    const [extend, setextend] = useState(false);
    const[audio] = React.useState(new Audio(data.PollyURL))
    const [playing, setplaying] = useState(false)

    const obituaryExtend = () => {
      setextend((current) => !current);
    }

    const playAudio = () => {
      audio.load();
      audio.play();
      setplaying(true);
    }

    const pauseAudio = () => {
      audio.pause();
      setplaying(false);
    }
    return (<div className="card mx-auto mt-4" style={{width: 300}} >
      <img className="card-img-top" src={`${data.ImageURL}`} alt={data.Name} onClick={obituaryExtend}></img>
      <div className="card-body">
        <div onClick={obituaryExtend}>
          <div className="card-title text-center">{data.Name}</div>
          <div className="card-subtitle mb-2 text-muted text-center">{data.Birth}&nbsp;-&nbsp;{data.Death}</div>
        </div>
        {extend &&(<>
          <div className="card-text">{data.Obituary}</div>
          {!playing ? <button type="button" class="btn btn-outline-primary text-center" onClick={playAudio}>Play Audio</button>:<button type="button" class="btn btn-outline-danger text-center" onClick={pauseAudio}>Pause Audio</button>}
        </>
        )}
      </div>
    </div>)
  }
  
  export default Obituaries;