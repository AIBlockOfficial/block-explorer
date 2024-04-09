import React, { Dispatch, SetStateAction } from "react";

interface IReverseFilterContext {
  reversed: boolean;
  setReversed: Dispatch<SetStateAction<boolean>>;
}

export const ReverseFilterContext = React.createContext<IReverseFilterContext>({
  reversed: false,
  setReversed: () => { }
});
