module.exports = {
  id: {
    type: 'integer',
    example: 7
  },
  firstName: {
    type: 'string',
    example: 'John'
  },
  lastName: {
    type: 'string',
    example: 'Doe'
  },
  email: {
    type: 'string',
    example: 'john.doe@wolox.com.ar'
  },
  password: {
    type: 'string',
    example: 'Sherman33'
  },
  User: {
    type: 'object',
    properties: {
      id: {
        $ref: '#/components/schemas/id'
      },
      firstName: {
        $ref: '#/components/schemas/firstName'
      },
      lastName: {
        $ref: '#/components/schemas/lastName'
      },
      email: {
        $ref: '#/components/schemas/email'
      },
      password: {
        $ref: '#/components/schemas/password'
      }
    }
  },
  Users: {
    type: 'object',
    properties: {
      users: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/User'
        }
      }
    }
  }
};
