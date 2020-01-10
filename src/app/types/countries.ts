interface State {
  abbreviation: string;
  value: string;
  label: string;
}



interface Country {
  zipLabel: string;
  stateLabel: string;
  states: State[];
}



export interface Countries {
  [country: string]: Country;
}
