import { Request, Response } from "express";
import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanage';

export default {
    async show(request: Request, response: Response){

        const { id } = request.params
    const orphanagesRepository = getRepository(Orphanage);
        const orphanage = await orphanagesRepository.findOneOrFail(id);
        return response.json(orphanage);
    },
    async index(request: Request, response: Response){
        const orphanagesRepository = getRepository(Orphanage);
        const orphanages = await orphanagesRepository.find();
        return response.json(orphanages);
    },
    async create(request: Request, response: Response){
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends
        } = request.body;
    
        const orphangesRepository = getRepository(Orphanage);
    
        const orphanage = orphangesRepository.create({
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends 
        });
    
        await orphangesRepository.save(orphanage)
        return response.status(201).json({
            message:'Orfanato criado',
            data: orphanage
        });
    }
}