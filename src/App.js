import Obituaries from "./Obituaries";

function App({obituaries}) {
  return obituaries.length > 0 ? (
    <div className="d-flex align-items-center flex-wrap">
      {obituaries.map((data, index) => (
        <Obituaries data={data} key={`obituary-item-${index}`}/>
      ))}
    </div>
  ) : (
    <div style={{width:"100%", height:"100%", textAlign: "center"}}>
    <p id="no-note-yet" className="mx-auto my-auto font-weight-bold display-5 text-muted">No Obituaries Yet</p>
    </div>
  );
}

export default App;
