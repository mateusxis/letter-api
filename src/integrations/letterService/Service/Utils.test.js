const usersData = require('./__fixtures__/usersData.json');
const postsData = require('./__fixtures__/postsData.json');
const { formatUsers, formatPosts } = require('./Utils');

describe('Utils()', () => {
  describe('formatUsers()', () => {
    it('should format data', async () => {
      const usersExpected = [
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

      expect(formatUsers(usersData)).toEqual(usersExpected);
    });
  });

  describe('formatPosts()', () => {
    it('should format data', async () => {
      const postsExpected = {
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

      expect(formatPosts(postsData)).toEqual(postsExpected);
    });
  });
});
