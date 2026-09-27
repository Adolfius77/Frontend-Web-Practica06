import { Controller, Get, Injectable, Post } from '@nestjs/common';


export interface clase{
  id: number;
  nombre: string;
}
const clases: clase[] = [
  { id: 1, nombre: 'Yoga' },
  { id: 2, nombre: 'Spinning' },
  { id: 3, nombre: 'Zumba' }
];
@Injectable()
export class ClasesService {
    listarClases(): clase[] { 
        return clases;
    } 
    crearClase(nombre: string): clase {
        const nuevaClase: clase = {
            id: clases.length + 1,
            nombre: nombre    
        };
        clases.push(nuevaClase);
        return nuevaClase;
    }
}

  