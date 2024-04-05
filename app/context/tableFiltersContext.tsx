import React, { Dispatch, SetStateAction } from "react";

interface IReverseFilterContext {
  reverse: boolean;
  setReverse: Dispatch<SetStateAction<boolean>>;
}

export const ReverseFilterContext = React.createContext<IReverseFilterContext>({
  reverse: false,
  setReverse: () => { }
});
