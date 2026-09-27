import { Controller, HttpCode, Post, Res, Body, Get, Delete, Param, ParseIntPipe } from '@nestjs/common';
import type { CrearInscripcionDto } from './dto/crear-inscripcion.dto';
import type { Response } from 'express';
import { InscripcionesService } from './inscripciones.service';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { HorarioNoEncontradoError, MiembroNoEncontradoError, CupoLlenoError, InscripcionDuplicadaError } from './dominio/errores';
import e from 'express';

@Controller('inscripciones')
export class InscripcionesController {
    constructor(private readonly servicioInscripciones: InscripcionesService) {}

    //crear inscripcion
    @Post()
    @HttpCode(201)
    async crear(
        @Body() dto: CrearInscripcionDto,
        @Res({passthrough: true}) res: Response
    ) 
    {   
        //cuerpo mal formado -> 400
        if(!Number.isInteger(dto?.horarioId) || !Number.isInteger(dto?.miembroId)){
            throw new BadRequestException('Cuerpo mal formado');
        }

        try {
            const inscripcion = await this.servicioInscripciones.crearInscripcion(dto);
            res.location(`/inscripciones/${inscripcion.id}`);
            return inscripcion;
        }catch (error) {
            // horario o miembro que no existe -> 404
            if (error instanceof HorarioNoEncontradoError || error instanceof MiembroNoEncontradoError) {
                throw new NotFoundException(error.message);
            }
            // cupo lleno o inscripcion duplicada -> 409
            if (error instanceof CupoLlenoError || error instanceof InscripcionDuplicadaError) {
                throw new ConflictException(error.message);
            }
            
            // cualquier otro error se relanza 
            throw error;
        }
        
    }
    //listar inscripciones
    @Get()
    @HttpCode(200)
    async listar() {
        return await this.servicioInscripciones.listarInscripciones();
    }
    //borrar por id
    @Delete(':id')
    @HttpCode(200)
    async cancelar(@Param('id', ParseIntPipe) id: number) {
        return await this.servicioInscripciones.cancelarInscripcion(id);
    }

    //buscar inscripcion por id
    @Get(":id")
    @HttpCode(200)
    async buscarPorId(@Body("id") id: number) {
        return await this.servicioInscripciones.buscarIncripcionPorId(id);
    }
    //buscar inscripcion por horario
    @Get("horario/:horarioId")
    @HttpCode(200)
    async buscarPorHorario(@Body("horarioId") horarioId: number) {
        return await this.servicioInscripciones.buscarIncripcionPorHorario(horarioId);

    }
    //buscar por miembro
    @Get("miembro/:miembroId")
    @HttpCode(200)
    async buscarPorMiembro(@Body("miembroId") miembroId: number) {
        if (await this.servicioInscripciones.buscarIncripcionPorMiembro(miembroId)) {
            throw new MiembroNoEncontradoError(miembroId);
        }
        return await this.servicioInscripciones.buscarIncripcionPorMiembro(miembroId);
        
        

    }

}
