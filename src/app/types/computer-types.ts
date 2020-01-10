import { SelectItem } from 'primeng/api';

interface Computer {
  name?: string;
  friendlyName?: string;
  desktops: string[] | SelectItem[];
  laptops: string[] | SelectItem[];
}

export interface ComputerTypes {
  [computerType: string]: Computer;
}
