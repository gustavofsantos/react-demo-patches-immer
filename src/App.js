import React from "react";
import { produceWithPatches, enablePatches, applyPatches } from "immer";
import "./styles.css";
enablePatches();

function useUndoState(initialValue) {
  const [state, setReactState] = React.useState(initialValue);
  const [undoHistory, setUndoHistory] = React.useState([]);

  const setState = (newValue) => {
    const [newState, _, inversePatches] = produceWithPatches(
      { value: state },
      (draft) => {
        draft.value = newValue;
      }
    );

    setUndoHistory([...undoHistory, inversePatches]);
    setReactState(newState.value);
  };

  const undoState = () => {
    if (!undoHistory.length) return;
    const lastPatches = undoHistory.pop();
    const newState = applyPatches({ value: state }, lastPatches);

    setUndoHistory(undoHistory);
    setReactState(newState.value);
  };

  return [state, setState, undoState];
}

export default function App() {
  const [value, setValue, undoState] = useUndoState("");

  return (
    <div className="App">
      <input
        placeholder="type here"
        type="text"
        value={value}
        onChange={(ev) => setValue(ev.target.value)}
      />

      <button onClick={undoState}>undo</button>
    </div>
  );
}
