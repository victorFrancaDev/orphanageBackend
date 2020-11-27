import { Request, Response } from "express";
import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanage';
import Images from '../models/Images';
import orphanagesView from '../views/orphanages_view'
import 'express-async-errors';
import * as Yup from 'yup';

export default {
    async show(request: Request, response: Response){

        const { id } = request.params
        const orphanagesRepository = getRepository(Orphanage);
        try{
            const orphanage = await orphanagesRepository.findOneOrFail(id, {
                relations: ['images']
            });
            return response.json(orphanagesView.render(orphanage));
        }catch(error){
            return response.status(404).json([]);
        }
        
        
    },

    
    async index(request: Request, response: Response){
        const orphanagesRepository = getRepository(Orphanage);
        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        });
        return response.json(orphanages);
    },


    async create(request: Request, response: Response){
        let {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
        } = request.body;

        console.log(request.body, request.files)
    
        const orphangesRepository = getRepository(Orphanage);

        const requestImages = request.files as Express.Multer.File[];
        const images = requestImages.map(image =>{
            return { path: image.filename }
        })

        if (open_on_weekends == '1'){
            open_on_weekends = true
        }  else {
            open_on_weekends = false
        }

        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
            images
        }

        const schema = Yup.object().shape({
            name: Yup.string().required("None é obrigatório."),
            latitude: Yup.string().required("Latitude é obrigatório."),
            longitude: Yup.string().required("Longitude é obrigatório."),
            about: Yup.string().required("Sobre é obrigatório.").max(300),
            instructions: Yup.string().required("Instruções é obrigatório."),
            opening_hours: Yup.string().required("Hora de funcionamento é obrigatório."),
            open_on_weekends: Yup.boolean().required("Aberto fins de Semana é obrigatório."),
            images: Yup.array(
                Yup.object().shape({
                    path: Yup.string().required("Caminho é obrigatório.")
                })
            )
        })

        await schema.validate(data, {
            abortEarly: false,
        })

        const orphanage = orphangesRepository.create(data);
    
        await orphangesRepository.save(orphanage)
        return response.status(201).json({
            message:'Orfanato criado',
            data: orphanage
        });
    }
}