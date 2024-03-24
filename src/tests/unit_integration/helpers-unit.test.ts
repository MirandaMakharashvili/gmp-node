import { SUPPORTED_COUNTRIES } from '../../models/test_models/config';
import { COUNTRIES } from '../../models/test_models/countries';
import { shortenPublicHoliday, validateInput } from '../../moduls/task4/helpers';

describe('validate provided country', () => {
    it('should return true', async () => {
        const country = SUPPORTED_COUNTRIES[0];
        const year: number = 2024;

        const result = validateInput({ year, country });
        console.log(result);

        expect(result).toEqual(true);
    });

    it('should return Country provided is not supported', async () => {
        const country = COUNTRIES[0].countryCode;
        const year: number = 2024;
        expect(() => {
            validateInput({ year, country });
        }).toThrow(`Country provided is not supported, received: AD`);
    });

    it('should return Year provided not the current', async () => {
        const country = SUPPORTED_COUNTRIES[0];
        const year: number = 2023;
        expect(() => {
            validateInput({ year, country });
        }).toThrow(`Year provided not the current, received: 2023`);
    });
});

describe('shorten public holiday', () => {
    it('should return true shorten public holiday object', async () => {
        const holiday = {
            date: '2024-01-01',
            localName: "New Year's Day",
            name: "New Year's Day",
            countryCode: 'GB',
            fixed: false,
            global: false,
            counties: ['GB-NIR'],
            launchYear: null,
            types: ['Public'],
        };

        const holidayShorten = {
            name: "New Year's Day",
            localName: "New Year's Day",
            date: '2024-01-01',
        };

        const result = shortenPublicHoliday(holiday);
        expect(result).toEqual(holidayShorten);
    });
});
