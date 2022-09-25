const Service = require('./Service');
const request = require('../../../infrastructure/request')();
const RequestError = require('../../../infrastructure/request/RequestError');
const usersData = require('./__fixtures__/usersData.json');
const postsData = require('./__fixtures__/postsData.json');
const nock = require('nock');

describe('Service()', () => {
  describe('construct()', () => {
    it('should instantiate correctly', () => {
      const url = 'https://0.0.0.0';
      const timeout = 5000;
      const identifier = 'Letter Service';
      const service = new Service({ identifier, url, timeout });

      expect(service.url).toBe('https://0.0.0.0');
      expect(service.timeout).toBe(5000);
      expect(service.identifier).toBe('Letter Service');
      expect(service.data).toEqual([]);
    });
  });

  describe('getIdentifier()', () => {
    it('should return identifier', () => {
      const url = 'https://0.0.0.0';
      const timeout = 5000;
      const identifier = 'Letter Service';
      const service = new Service({ identifier, url, timeout });

      expect(service.getIdentifier()).toBe('Letter Service');
    });
  });

  describe('isFulfilled()', () => {
    it('should be fulfilled when there are data', () => {
      const url = 'https://0.0.0.0';
      const timeout = 5000;
      const identifier = 'Letter Service';
      const service = new Service({ identifier, url, timeout });

      expect(service.isFulfilled()).toBeFalsy();
      service.data = [
        {
          id: 1,
          name: 'Leanne Graham',
          username: 'Bret',
          email: 'Sincere@april.biz',
          address: 'Kulas Light, Apt. 556 - 92998-3874 Gwenborough',
          phone: '1-770-736-8031 x56442',
          website: 'hildegard.org',
          company: 'Romaguera-Crona',
          posts: [
            {
              id: 9,
              title: 'nesciunt iure omnis dolorem tempora et accusantium',
              body: 'consectetur animi nesciunt iure dolore\nenim quia ad\nveniam autem ut quam aut nobis\net est aut quod aut provident voluptas autem voluptas'
            },
            {
              id: 10,
              title: 'optio molestias id quia eum',
              body: 'quo et expedita modi cum officia vel magni\ndoloribus qui repudiandae\nvero nisi sit\nquos veniam quod sed accusamus veritatis error'
            }
          ]
        }
      ];
      expect(service.isFulfilled()).toBeTruthy();
    });
  });

  describe('clear()', () => {
    it('should clear data', async () => {
      const url = 'https://0.0.0.0';
      const timeout = 5000;
      const identifier = 'Letter Service';
      const service = new Service({ identifier, url, timeout, request });

      nock(url).get(`/users`).reply(200, usersData);
      nock(url).get(`/posts`).reply(200, postsData);

      await service.refresh();

      expect(service.getLetters()).toEqual([
        {
          id: 1,
          name: 'Leanne Graham',
          username: 'Bret',
          email: 'Sincere@april.biz',
          address: 'Kulas Light, Apt. 556 - 92998-3874 Gwenborough',
          phone: '1-770-736-8031 x56442',
          website: 'hildegard.org',
          company: 'Romaguera-Crona',
          posts: [
            {
              id: 9,
              title: 'nesciunt iure omnis dolorem tempora et accusantium',
              body: 'consectetur animi nesciunt iure dolore\nenim quia ad\nveniam autem ut quam aut nobis\net est aut quod aut provident voluptas autem voluptas'
            },
            {
              id: 10,
              title: 'optio molestias id quia eum',
              body: 'quo et expedita modi cum officia vel magni\ndoloribus qui repudiandae\nvero nisi sit\nquos veniam quod sed accusamus veritatis error'
            }
          ]
        }
      ]);

      service.clear();

      expect(service.getLetters()).toEqual([]);
    });
  });

  describe('refresh()', () => {
    it('should refresh data', async () => {
      const url = 'https://0.0.0.0';
      const timeout = 5000;
      const identifier = 'Letter Service';
      const service = new Service({ identifier, url, timeout, request });
      const spyProcess = jest.spyOn(service, 'process');

      nock(url).get(`/users`).reply(200, usersData);
      nock(url).get(`/posts`).reply(200, postsData);

      await service.refresh();

      const users = [
        {
          id: 1,
          name: 'Leanne Graham',
          username: 'Bret',
          email: 'Sincere@april.biz',
          address: 'Kulas Light, Apt. 556 - 92998-3874 Gwenborough',
          phone: '1-770-736-8031 x56442',
          website: 'hildegard.org',
          company: 'Romaguera-Crona'
        }
      ];

      const posts = {
        1: [
          {
            id: 9,
            title: 'nesciunt iure omnis dolorem tempora et accusantium',
            body: 'consectetur animi nesciunt iure dolore\nenim quia ad\nveniam autem ut quam aut nobis\net est aut quod aut provident voluptas autem voluptas'
          },
          {
            id: 10,
            title: 'optio molestias id quia eum',
            body: 'quo et expedita modi cum officia vel magni\ndoloribus qui repudiandae\nvero nisi sit\nquos veniam quod sed accusamus veritatis error'
          }
        ],
        2: [
          {
            id: 11,
            title: 'et ea vero quia laudantium autem',
            body: 'delectus reiciendis molestiae occaecati non minima eveniet qui voluptatibus\naccusamus in eum beatae sit\nvel qui neque voluptates ut commodi qui incidunt\nut animi commodi'
          },
          {
            id: 12,
            title: 'in quibusdam tempore odit est dolorem',
            body: 'itaque id aut magnam\npraesentium quia et ea odit et ea voluptas et\nsapiente quia nihil amet occaecati quia id voluptatem\nincidunt ea est distinctio odio'
          }
        ]
      };

      expect(spyProcess).toHaveBeenCalledWith(users, posts);
      expect(service.getLetters()).toEqual([
        {
          id: 1,
          name: 'Leanne Graham',
          username: 'Bret',
          email: 'Sincere@april.biz',
          address: 'Kulas Light, Apt. 556 - 92998-3874 Gwenborough',
          phone: '1-770-736-8031 x56442',
          website: 'hildegard.org',
          company: 'Romaguera-Crona',
          posts: [
            {
              id: 9,
              title: 'nesciunt iure omnis dolorem tempora et accusantium',
              body: 'consectetur animi nesciunt iure dolore\nenim quia ad\nveniam autem ut quam aut nobis\net est aut quod aut provident voluptas autem voluptas'
            },
            {
              id: 10,
              title: 'optio molestias id quia eum',
              body: 'quo et expedita modi cum officia vel magni\ndoloribus qui repudiandae\nvero nisi sit\nquos veniam quod sed accusamus veritatis error'
            }
          ]
        }
      ]);
    });

    it('should refresh data when return empty array by API', async () => {
      const url = 'https://0.0.0.0';
      const timeout = 5000;
      const identifier = 'Letter Service';
      const service = new Service({ identifier, url, timeout, request });
      const spyProcess = jest.spyOn(service, 'process');

      nock(url).get(`/users`).reply(200, []);
      nock(url).get(`/posts`).reply(200, []);

      await service.refresh();

      const users = [];
      const posts = {};

      expect(spyProcess).toHaveBeenCalledWith(users, posts);
      expect(service.getLetters()).toEqual([]);
    });

    it('should throw exception when failed to connect to API', async () => {
      const url = 'https://0.0.0.0';
      const timeout = 5000;
      const identifier = 'Letter Service';
      const service = new Service({ identifier, url, timeout, request });

      nock(url).get('/users').delay(500).reply(500, 'Error');

      try {
        await service.refresh();
      } catch (e) {
        responseError = e.response;
      }

      await expect(responseError).toStrictEqual({
        config: {
          credentials: false,
          headers: { 'user-agent': 'request/0.5.0/no-facility' },
          method: 'GET',
          retry: { condition: expect.any(Function), retries: 0 },
          timeout: 5000,
          url: 'https://0.0.0.0/posts'
        },
        data: undefined,
        headers: undefined,
        status: undefined,
        statusText: undefined
      });
    });
  });

  describe('getLetters()', () => {
    it('should return a list letter', async () => {
      const url = 'https://0.0.0.0';
      const timeout = 5000;
      const identifier = 'Letter Service';
      const service = new Service({ identifier, url, timeout, request });

      nock(url).get(`/users`).reply(200, usersData);
      nock(url).get(`/posts`).reply(200, postsData);

      await service.refresh();

      expect(service.getLetters()).toEqual([
        {
          id: 1,
          name: 'Leanne Graham',
          username: 'Bret',
          email: 'Sincere@april.biz',
          address: 'Kulas Light, Apt. 556 - 92998-3874 Gwenborough',
          phone: '1-770-736-8031 x56442',
          website: 'hildegard.org',
          company: 'Romaguera-Crona',
          posts: [
            {
              id: 9,
              title: 'nesciunt iure omnis dolorem tempora et accusantium',
              body: 'consectetur animi nesciunt iure dolore\nenim quia ad\nveniam autem ut quam aut nobis\net est aut quod aut provident voluptas autem voluptas'
            },
            {
              id: 10,
              title: 'optio molestias id quia eum',
              body: 'quo et expedita modi cum officia vel magni\ndoloribus qui repudiandae\nvero nisi sit\nquos veniam quod sed accusamus veritatis error'
            }
          ]
        }
      ]);

      service.clear();

      expect(service.getLetters()).toEqual([]);
    });
  });
});
