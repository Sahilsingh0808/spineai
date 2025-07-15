export interface CursorMove {
  x: number;
  y: number;
  inCard: boolean;
}

export interface RemoteUser extends CursorMove {
  clientId: string;
  name: string;
  color: string;
}