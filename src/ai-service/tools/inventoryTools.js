// inventory_tools.ts
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import {findAvailableCarsAndSimilarCars} from "../../services/carSearch.service.js";


export const checkAvailabilityTool = tool(
    async ({ make, model,year, start_date, end_date, budget }) => {
        console.log(`🔍 MANAGER: Checking availability for ${make || 'any'} ${model || 'any'}`);
        console.log(`📅 Date range: ${start_date} to ${end_date}`);
        console.log(`💰 Max daily rate: ${budget || 'no limit'}`);

        try {
            console.log("🔍 TESTING - Building search query...");


            const searchResult = await findAvailableCarsAndSimilarCars(make,model,year,budget,start_date,end_date)
            console.log(searchResult)

            const result = {
                available: searchResult.availableCars?.length > 0,
                availableCars :searchResult.availableCars?.map(car => ({
                    id: car._id,
                    title: car.title,
                    description:car.description,
                    make: car.make || car.title[0],
                    model: car.model || car.title[1],
                    pricePerDay: car.pricePerDay,
                    location: car.location,
                    images: car.images,
                    availability: car.availability
                })),
                matchedCars: searchResult.matchedCars?.map(car => ({
                    id: car._id,
                    title: car.title,
                    description:car.description,
                    make: car.make || car.title[0],
                    model: car.model || car.title[1],
                    pricePerDay: car.pricePerDay,
                    location: car.location,
                    images: car.images,
                    availability: car.availability
                })),

            };

            console.log(`📊 Found ${searchResult.availableCars?.length} available cars`);
            return result;

        } catch (error) {
            console.error('Error checking availability:', error);
            return {
                available: false,
                availableCars: [],
                matched_cars: [],
                message: 'Error checking availability. Please try again.'
            };
        }
    },
    {
        name: 'check_availability',
        description: 'Check real-time car availability from inventory database for specific dates',
        schema: z.object({
            make: z.string().optional().describe('Car make e.g., Toyota, Honda'),
            model: z.string().optional().describe('Car model e.g., RAV4, CR-V, Corolla'),
            year:z.string().optional().describe("car model year e.g, 2023"),
            start_date: z.string().describe('Rental start date (YYYY-MM-DD)'),
            end_date: z.string().describe('Rental end date (YYYY-MM-DD)'),

            budget: z.number().optional().describe('Maximum daily rental budget in USD/EGP')
        })
    }
);
