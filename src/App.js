import Obituaries from "./Obituaries";

function App({obituaries}) {
  return obituaries.length > 0 ? (
    <div className="d-flex justify-content-start flex-wrap">
      {obituaries.map((data, index) => (
        <Obituaries data={data} key={`obituary-item-${index}`}/>
      ))}
    </div>
  ) : (
    <p id="no-note-yet">No Obituaries Yet</p>
  );
}

export default App;
