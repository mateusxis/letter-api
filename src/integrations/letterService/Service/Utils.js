const formatUsers = (users) => {
  const regex = /\)|\./g;

  const formatAddress = ({ street, suite, zipcode, city }) => `${street}, ${suite} - ${zipcode} ${city}`;

  return users.map(({ id, name, username, email, address, phone, website, company }) => ({
    id,
    name,
    username,
    email,
    address: formatAddress(address),
    phone: phone.replace('(', '').replace(regex, '-'),
    website,
    company: company.name
  }));
};

const formatPosts = (posts) => {
  const data = {};

  posts.forEach(({ userId, id, title, body }) => {
    if (!data[`${userId}`]) data[`${userId}`] = [];

    data[`${userId}`].push({ id, title, body });
  });

  return data;
};

module.exports = { formatUsers, formatPosts };
