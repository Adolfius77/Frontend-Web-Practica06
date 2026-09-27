import { Injectable, Inject } from '@nestjs/common';
import { InscripcionMemoriaRepository } from './infra/inscripcion-memoria.repository';
import type{ InscripcionRepository } from './dominio/inscripcion.repository';
import type { Inscripcion, Horario, Miembro } from './dominio/entidades';
import { INSCRIPCION_REPOSITORY } from './inscripciones.tokens';
import {HorarioNoEncontradoError, MiembroNoEncontradoError, CupoLlenoError, InscripcionDuplicadaError} from './dominio/errores';

@Injectable()
export class InscripcionesService {
  constructor(
    // inyectamos las dependencias mediante un token 
    @Inject(INSCRIPCION_REPOSITORY)
    private readonly repo: InscripcionRepository,
  ) {}

  //crearInscripcion
  async crearInscripcion(datos: { horarioId: number; miembroId: number }): Promise<Inscripcion> {
    const horario = await this.repo.buscarHorario(datos.horarioId);

    if(horario == null){
      throw new HorarioNoEncontradoError(datos.horarioId);
    }
    const miembro = await this.repo.buscarMiembro(datos.miembroId);
    if(miembro == null){
      throw new MiembroNoEncontradoError(datos.miembroId);
    }
    const confirmadas = (await this.repo.buscarPorHorario(datos.horarioId))
    .filter(i => i.estado === 'confirmada');

    if(confirmadas.some(i => i.miembroId === datos.miembroId)){
      throw new InscripcionDuplicadaError(datos.miembroId, datos.horarioId);
    }
    if(confirmadas.length >= horario.cupoMaximo){
      throw new CupoLlenoError(datos.horarioId, horario.cupoMaximo);
    }
     return await this.repo.guardar(datos);
  }
  

  //listar Inscripciones
  async listarInscripciones(): Promise<Inscripcion[]> {
    return await this.repo.listar();
  }


  //borra inscripcion
  async cancelarInscripcion(id: number): Promise<Inscripcion | null> {
    const inscripcion = await this.repo.buscarPorId(id);
    if(inscripcion == null){
      throw new Error(`No existe la inscripcion ${id}`);
    }
    return await this.repo.cancelar(id);
  }

  //buscar inscripcion por id
  async buscarIncripcionPorId(id: number): Promise<Inscripcion | null> {
    const inscripcion = await this.repo.buscarPorId(id);
    if(inscripcion == null){
      throw new Error(`No existe la inscripcion ${id}`);
    }
    return inscripcion;
  }

  //buscar inscripcion por horario
  async buscarIncripcionPorHorario(horarioId: number): Promise<Horario | null> {
    const inscripcion = await this.repo.buscarHorario(horarioId);
    if(inscripcion == null){
      throw new Error(`No existe la inscripcion para el horario ${horarioId}`);
    }
    return inscripcion;
  }

  //busacar por miembro
  async buscarIncripcionPorMiembro(miembroId: number): Promise<Miembro | null> {
    const inscripcion = await this.repo.buscarMiembro(miembroId);
    if(inscripcion == null){
      throw new Error(`No existe la inscripcion para el miembro ${miembroId}`);
    }
    return inscripcion;
  }
}
