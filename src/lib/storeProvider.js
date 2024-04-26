import { initializeStore, Provider } from "./store";
import { useRef } from "react";

const StoreProvider = ({ children, ...props }) => {
  const storeRef = useRef();

  if (!storeRef.current) {
    storeRef.current = initializeStore(props);
  } else {
    const currentState = storeRef.current.getState();
    if (JSON.stringify(currentState) !== JSON.stringify(props)) {
      storeRef.current.setState({...currentState, ...props}, true);
    }
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
