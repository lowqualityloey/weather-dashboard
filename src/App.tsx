function App() {
  return (
    <div>
      <div className="bg-violet-200 h-10 w-full border-2 border-violet-600 rounded-md my-4 p-2 flex justify-center items-center">
        <h1 className="text-center font-mono font-extrabold text-[30px]">Weather Dashboard</h1>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2 mx-2">
        <div className="h-16 rounded-full bg-blue-500"></div>
        <div className="h-16 rounded-full bg-orange-500"></div>
        <div className="h-16 rounded-full bg-green-500"></div>
      </div>
      <div className="sm:bg-amber-500 md:bg-amber-700">show up please</div>
    </div>
  );
}

export default App;
