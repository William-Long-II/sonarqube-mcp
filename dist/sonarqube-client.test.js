// src/sonarqube-client.test.ts
import { SonarQubeClient } from './sonarqube-client.js';
describe('SonarQubeClient', () => {
    describe('constructor', () => {
        it('should create client with valid config', () => {
            const client = new SonarQubeClient({
                baseUrl: 'https://sonar.example.com',
                token: 'test-token',
            });
            expect(client).toBeInstanceOf(SonarQubeClient);
        });
        it('should throw if baseUrl is missing', () => {
            expect(() => new SonarQubeClient({ baseUrl: '', token: 'test' }))
                .toThrow('SONARQUBE_URL is required');
        });
        it('should throw if token is missing', () => {
            expect(() => new SonarQubeClient({ baseUrl: 'https://sonar.example.com', token: '' }))
                .toThrow('SONARQUBE_TOKEN is required');
        });
        it('should normalize baseUrl by removing trailing slash', () => {
            const client = new SonarQubeClient({
                baseUrl: 'https://sonar.example.com/',
                token: 'test-token',
            });
            expect(client.baseUrl).toBe('https://sonar.example.com');
        });
    });
});
//# sourceMappingURL=sonarqube-client.test.js.map