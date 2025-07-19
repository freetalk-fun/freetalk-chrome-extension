import axios from "axios";

import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="container max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
        <div className="text-center space-y-4">
          <h1 className="font-Nor text-3xl font-bold text-gray-800 leading-tight">
            FreeTalk Dictionary
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed px-2">
            Double-click any word on a webpage to get its definition!
          </p>
          {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              💡 <strong>Tip:</strong> Select text and double-click to see definitions appear in a tooltip
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;