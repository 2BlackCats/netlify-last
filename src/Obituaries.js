function Obituaries({data}) {
  
    return <div className="card w-25 p-3 mx-2">
      <img className="card-img-top" src={`${data.ImageURL}`} ></img>
      <div className="card-body">
        <div className="card-title">{data.Name}</div>
        <div className="card-subtitle mb-2 text-muted">{data.Birth}-{data.Death}</div>
        <div className="card-text">{data.Obituary}</div>
      </div>
    </div>
  }
  
  export default Obituaries;