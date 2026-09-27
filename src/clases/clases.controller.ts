import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ClasesService } from './clases.service';
import type { clase } from './clases.service';

@Controller('clases')
export class ClasesController {
    constructor(private readonly clasesService: ClasesService) {}
    
    @Get()
    @HttpCode(200)
    async listar(): Promise<clase[]> {
        return this.clasesService.listarClases();
    }
    @Post()
    @HttpCode(201)
    async crearClase(@Body() cuerpo: { nombre: string }): Promise<clase> {
        return this.clasesService.crearClase(cuerpo.nombre);
    }
    
}
