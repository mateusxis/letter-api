const { formatUsers, formatPosts } = require('./Utils');

class Service {
  constructor({ identifier, url, timeout, request }) {
    this.data = [];
    this.identifier = identifier;
    this.url = url;
    this.timeout = timeout;
    this.request = request;
    this.clear();
  }

  isFulfilled() {
    return this.data.length > 0;
  }

  getIdentifier() {
    return this.identifier;
  }

  async getUsers() {
    const url = `${this.url}/users`;
    const timeout = this.timeout;

    const response = await this.request(url, { method: 'GET', timeout });

    return formatUsers(response.data);
  }

  async getPosts() {
    const url = `${this.url}/posts`;
    const timeout = this.timeout;

    const response = await this.request(url, { method: 'GET', timeout });

    return formatPosts(response.data);
  }

  async refresh() {
    const usersPromise = this.getUsers();
    const postsPromise = this.getPosts();

    await Promise.all([usersPromise, postsPromise]).then(([users, posts]) => {
      this.process(users, posts);
    });
  }

  process(users, posts) {
    let data = [];
    users.forEach((user) =>
      data.push({
        ...user,
        posts: posts[`${user.id}`]
      })
    );
    this.data = data;
  }

  clear() {
    this.data = [];
  }

  getLetters() {
    return this.data;
  }
}

module.exports = Service;
