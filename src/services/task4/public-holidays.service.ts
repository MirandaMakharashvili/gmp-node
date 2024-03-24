import axios from 'axios';
import { PUBLIC_HOLIDAYS_API_URL } from '../../models/test_models/config';
import { validateInput, shortenPublicHoliday } from '../../moduls/task4/helpers';
import { PublicHoliday, PublicHolidayShort } from '../../models/test_models/types';

// Swagger https://date.nager.at/swagger/index.html

export const getListOfPublicHolidays = async (year: number, country: string): Promise<PublicHolidayShort[]> => {
    validateInput({ year, country });

    try {
        const { data: publicHolidays } = await axios.get<PublicHoliday[]>(
            `${PUBLIC_HOLIDAYS_API_URL}/PublicHolidays/${year}/${country}`,
        );
        return publicHolidays.map((holiday:PublicHoliday) => shortenPublicHoliday(holiday));
    } catch (error) {
        return [];
    }
};

export const checkIfTodayIsPublicHoliday = async (country: string) => {
    validateInput({ country });

    try {
        const { status } = await axios.get<PublicHoliday[]>(
            `${PUBLIC_HOLIDAYS_API_URL}/IsTodayPublicHoliday/${country}`,
        );
        return status === 200;
    } catch (error) {
        return false;
    }
};

export const getNextPublicHolidays = async (country: string): Promise<PublicHolidayShort[]> => {
    validateInput({ country });

    try {
        const { data: publicHolidays } = await axios.get<PublicHoliday[]>(
            `${PUBLIC_HOLIDAYS_API_URL}/NextPublicHolidays/${country}`,
        );
        return publicHolidays.map((holiday:PublicHoliday) => shortenPublicHoliday(holiday));
    } catch (error) {
        return [];
    }
};
