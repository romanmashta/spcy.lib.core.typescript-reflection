export interface Config {
  [name: string]: Section;
}

export interface Section {
  id: string;
  secret: string;
}
