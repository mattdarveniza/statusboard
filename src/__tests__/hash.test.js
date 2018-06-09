import { ptvHash } from '../hash';

describe('ptvHashFunction', () => {
  it('should produce the expected signature for a url and key', () => {
    const url = '/v3/departures/route_type/0/stop/1214?expand=stop&expand=route&expand=direction&expand=disruption&devid=3000318';
    const apiKey = process.env.REACT_APP_PTV_API_KEY;
    const signature = ptvHash(url, apiKey);
    expect(signature.toUpperCase()).toEqual('BCEA73D351B78FB03107E6B30B4BC3CF065914CF');
  });
});

