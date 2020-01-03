interface State {
  abbreviation: string;
  name: string;
  display?: string;
}



interface Country {
  zipLabel: string;
  stateLabel: string;
  states: State[];
}



export interface Countries {
  [country: string]: Country;
}
