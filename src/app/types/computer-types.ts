interface Computer {
  name: string;
  friendlyName: string;
  desktops?: string[];
  laptops?: string[];
}

export interface ComputerTypes {
  [computerType: string]: Computer;
}
