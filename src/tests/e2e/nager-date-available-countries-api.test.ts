import request from 'supertest';
import { COUNTRIES } from '../../models/countries';



describe('Nager.Date API - V3', () => {
    const countries = COUNTRIES;
    const COUNTRY_API = 'https://date.nager.at';
    describe('/api/v3/AvailableCountries', () => {
        it('should return 200 and all available countries', async () => {
            const { status, body } = await request(COUNTRY_API).get('/api/v3/AvailableCountries');

            expect(status).toEqual(200);
            expect(body).toEqual(countries);
        });
    });
});
