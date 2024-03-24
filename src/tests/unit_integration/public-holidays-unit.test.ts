import axios from 'axios';
import { checkIfTodayIsPublicHoliday, getListOfPublicHolidays, getNextPublicHolidays } from '../../services/task4/public-holidays.service';
import { ANDORRA_HOLIDAYS, ANDORRA_SHORTEN_HOLIDAYS, GB_NEXT_HOLIDAYS, GB_NEXT_HOLIDAYS_RESULT } from '../../models/test_models/public-holidays';
import { PUBLIC_HOLIDAYS_API_URL, SUPPORTED_COUNTRIES } from '../../models/test_models/config';

describe('get list of public holidays', () => {
    it('should return list of public holidays', async () => {
        const country = SUPPORTED_COUNTRIES[0];
        const year: number = 2024;

        jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: ANDORRA_HOLIDAYS }));

        const result = await getListOfPublicHolidays(year, country);

        expect(result).toEqual(ANDORRA_SHORTEN_HOLIDAYS);
    });

    it('should return empty array', async () => {
        const country = '';
        const year: number = 0;

        jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({code: 404}));

        const result = await getListOfPublicHolidays(year, country);

        expect(result).toEqual([]);
    });

    test('should call API with proper arguments', async () => {
        const country = SUPPORTED_COUNTRIES[0];
        const year: number = 2024;
        const axiosGetSpy = jest
            .spyOn(axios, 'get')
            .mockImplementation(() => Promise.resolve({ data: ANDORRA_HOLIDAYS }));

        await getListOfPublicHolidays(year, country);

        expect(axiosGetSpy).toHaveBeenCalledWith(`${PUBLIC_HOLIDAYS_API_URL}/PublicHolidays/${year}/${country}`);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});

describe('check if today is public holiday', () => {
    it('should return true while status is 200', async () => {
        const country = SUPPORTED_COUNTRIES[0];

        jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ status: 200 }));

        const result = await checkIfTodayIsPublicHoliday(country);

        expect(result).toEqual(true);
    });

    it('should return false while error', async () => {
        const country = SUPPORTED_COUNTRIES[0];

        jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ status: 404 }));

        const result = await checkIfTodayIsPublicHoliday(country);
        console.log(result);

        expect(result).toEqual(false);
    });

    test('should call today is public holiday API with proper arguments', async () => {
        const country = SUPPORTED_COUNTRIES[0];        
        const axiosGetSpy = jest
            .spyOn(axios, 'get')
            .mockImplementation(() => Promise.resolve({ status: 200 }));

        await checkIfTodayIsPublicHoliday(country);

        expect(axiosGetSpy).toHaveBeenCalledWith(`${PUBLIC_HOLIDAYS_API_URL}/IsTodayPublicHoliday/${country}`);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});

describe('get next public holidays', () => {
    it('should return next public holidays', async () => {
        const country = SUPPORTED_COUNTRIES[0];

        jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: GB_NEXT_HOLIDAYS }));

        const result = await getNextPublicHolidays(country);
       
        expect(result).toEqual(GB_NEXT_HOLIDAYS_RESULT);
    });

    it('should return empty array while error', async () => {
        const country = SUPPORTED_COUNTRIES[0];

        jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ code: 404 }));

        const result = await getNextPublicHolidays(country);
        console.log(result);

        expect(result).toEqual([]);
    });

    test('should call next public holidays API with proper arguments', async () => {
        const country = SUPPORTED_COUNTRIES[0];        
        const axiosGetSpy = jest
            .spyOn(axios, 'get')
            .mockImplementation(() => Promise.resolve({ status: 200 }));

        await getNextPublicHolidays(country);

        expect(axiosGetSpy).toHaveBeenCalledWith(`${PUBLIC_HOLIDAYS_API_URL}/NextPublicHolidays/${country}`);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
