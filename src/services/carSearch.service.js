import Car from '../models/car.model.js'

const findCarsByCriteria = async (make, model, year, budget) => {
    let searchQuery = {};

    if (make || model || year) {
        if (make) {
            searchQuery.title = { $regex: make, $options: 'i' };

            const additionalConditions = [];
            if (model) {
                additionalConditions.push({ title: { $regex: model, $options: 'i' } });
            }
            if (year) {
                additionalConditions.push({ title: { $regex: year.toString(), $options: 'i' } });
            }
            if (additionalConditions.length > 0) {
                searchQuery.$and = [
                    { title: { $regex: make, $options: 'i' } },
                    { $or: additionalConditions }
                ];
            }
        }
    }

    if (budget) {
        searchQuery.pricePerDay = { $lte: budget };
    }

    const cars = await Car.find(searchQuery).lean();
    console.log(`Found ${cars.length} cars by matching criteria`);

    return cars;
};
const filterAvailableCars = (cars, start_date, end_date) => {
    const availableCars = cars.filter(car => {
        if (!car.availability) return false;

        let availabilityPeriods = [];

        if (typeof car.availability === 'string') {
            const parts = car.availability.split('|');
            for (const part of parts) {
                const [startStr, endStr] = part.split(',');
                if (startStr && endStr) {
                    availabilityPeriods.push({
                        fromDate: new Date(startStr),
                        toDate: new Date(endStr)
                    });
                }
            }
        } else {
            availabilityPeriods = car.availability;
        }

        const requestedStart = new Date(start_date);
        const requestedEnd = new Date(end_date);

        const isAvailable = availabilityPeriods.some(period => {
            const periodStart = new Date(period.fromDate);
            const periodEnd = new Date(period.toDate);

            periodStart.setHours(0, 0, 0, 0);
            periodEnd.setHours(0, 0, 0, 0);
            requestedStart.setHours(0, 0, 0, 0);
            requestedEnd.setHours(0, 0, 0, 0);

            return requestedStart >= periodStart && requestedEnd <= periodEnd;
        });

        return isAvailable;
    });

    return availableCars;
};

export const findAvailableCarsAndSimilarCars = async (make, model, year, budget, start_date, end_date) => {
    const matchedCars = await findCarsByCriteria(make, model, year, budget);

    const availableCars = filterAvailableCars(matchedCars, start_date, end_date);

    return {
        availableCars: availableCars,
        matchedCars: matchedCars,
    };
};

