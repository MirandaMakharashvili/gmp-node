import request from 'supertest';
import { ANDORRA, COUNTRIES } from '../../models/countries';

describe('Nager.Date API - V3', () => {
    const countries = COUNTRIES;
    const COUNTRY_API = 'https://date.nager.at';
    describe('/api/v3/AvailableCountries', () => {
        it('should return 200 and country info for the given country code', async () => {
            const countryCode = countries[0].countryCode;
            const Andorra = ANDORRA;
            const { status, body } = await request(COUNTRY_API).get(`/api/v3/CountryInfo/${countryCode}`);
            console.log(status);
            console.log(body);
            expect(status).toEqual(200);
            expect(body).toEqual(Andorra);
        });

        it('should return 404 for the empty county code', async () => {
            const countryCode = '';
            const { status, body } = await request(COUNTRY_API).get(`/api/v3/CountryInfo/${countryCode}`);
            console.log(status);
            console.log(body);
            expect(status).toEqual(404);
            expect(body).toEqual({});
        });
    });
});
