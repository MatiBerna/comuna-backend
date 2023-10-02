import { randomUUID } from "crypto";

export class Event{
  constructor(
    public nro: number,
    public descripcion: string,
    public fecha_hora_ini: Date,
    public fecha_hora_fin: Date,
    public id = randomUUID()
  ) {}
}