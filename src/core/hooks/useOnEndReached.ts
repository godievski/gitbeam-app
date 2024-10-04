import { useEffect, useState } from "react";

type AsyncCall = Function;
type ErrorHandler = <T>(e: T) => void;

const useOnEndReached = (asyncCall: AsyncCall, errorHandler: ErrorHandler = () => { }) => {
  const state = useState(false);
  const [endReached, setEndReached] = state;
  useEffect(() => {
    const execMe = async () => {
      try {
        await asyncCall();
      } catch (e) {
        errorHandler(e);
      }
      setEndReached(false);
    }
    if (endReached) {
      execMe();
    }
  }, [endReached]);

  return state;
}

export default useOnEndReached;