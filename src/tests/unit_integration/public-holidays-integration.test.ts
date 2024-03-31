import axios from 'axios';
import { PUBLIC_HOLIDAYS_API_URL, SUPPORTED_COUNTRIES } from '../../models/test_models/config';
import { COUNTRIES } from '../../models/test_models/countries';
import { ANDORRA_HOLIDAYS, GB_NEXT_HOLIDAYS } from '../../models/test_models/public-holidays';

describe('public holidays API integration tests', () => {
    it('should return list of public holidays', async () => {
        const country = COUNTRIES[0].countryCode;
        const year: number = 2024;

        const result = await axios.get(`${PUBLIC_HOLIDAYS_API_URL}/PublicHolidays/${year}/${country}`);

        expect(result.status).toEqual(200);
        expect(result.config.method).toEqual('get');
        expect(result.data).toEqual(ANDORRA_HOLIDAYS);
    });

    it('should return no data', async () => {
        const country = 'TT';
        const year: number = 2023;

        const result = await axios.get(`${PUBLIC_HOLIDAYS_API_URL}/PublicHolidays/${year}/${country}`);

        expect(result.status).toEqual(204);
        expect(result.statusText).toEqual('No Content');
        expect(result.config.method).toEqual('get');
        expect(result.data).toEqual('');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});

describe('today is public holiday API integration tests', () => {
    it('should return holidays or emtry state', async () => {
        const country = SUPPORTED_COUNTRIES[0];

        const result = await axios.get(`${PUBLIC_HOLIDAYS_API_URL}/IsTodayPublicHoliday/${country}`);
        
        expect([200, 204]).toContain(result.status);
        expect(result.config.method).toEqual('get');
    });

    it('should return no data', async () => {
        const country = 'TT';

        const result = await axios.get(`${PUBLIC_HOLIDAYS_API_URL}/IsTodayPublicHoliday/${country}`);
        
        expect(result.status).toEqual(204);
        expect(result.statusText).toEqual('No Content');
        expect(result.config.method).toEqual('get');
        expect(result.data).toEqual('');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});

describe('next public holidays API integration tests', () => {
    it('should return list of next public holidays', async () => {
        const country = SUPPORTED_COUNTRIES[0];

        const result = await axios.get(`${PUBLIC_HOLIDAYS_API_URL}/NextPublicHolidays/${country}`);
        
        expect(result.status).toEqual(200);
        expect(result.config.method).toEqual('get');
        expect(result.data).toEqual(GB_NEXT_HOLIDAYS);
    });

    it('should return no data', async () => {
        const country = 'TT';

        const result = await axios.get(`${PUBLIC_HOLIDAYS_API_URL}/NextPublicHolidays/${country}`);
        
        expect(result.status).toEqual(204);
        expect(result.statusText).toEqual('No Content');
        expect(result.config.method).toEqual('get');
        expect(result.data).toEqual('');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});