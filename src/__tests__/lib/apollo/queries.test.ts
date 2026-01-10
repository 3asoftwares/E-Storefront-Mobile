import { 
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_QUERY,
  GET_CATEGORIES_QUERY,
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  LOGOUT_MUTATION,
  GET_ME_QUERY,
  GET_ORDERS_BY_CUSTOMER_QUERY,
  GET_ORDER_QUERY,
} from '../../../lib/apollo/queries';

describe('GraphQL Queries', () => {
  describe('Product Queries', () => {
    it('GET_PRODUCTS_QUERY should be defined', () => {
      expect(GET_PRODUCTS_QUERY).toBeDefined();
    });

    it('GET_PRODUCTS_QUERY should have correct structure', () => {
      expect(GET_PRODUCTS_QUERY.definitions).toBeDefined();
      expect(GET_PRODUCTS_QUERY.definitions.length).toBeGreaterThan(0);
      
      const operation = GET_PRODUCTS_QUERY.definitions[0] as any;
      expect(operation.kind).toBe('OperationDefinition');
      expect(operation.operation).toBe('query');
      expect(operation.name.value).toBe('GetProducts');
    });

    it('GET_PRODUCTS_QUERY should have pagination variables', () => {
      const operation = GET_PRODUCTS_QUERY.definitions[0] as any;
      const variableNames = operation.variableDefinitions.map(
        (v: any) => v.variable.name.value
      );
      
      expect(variableNames).toContain('page');
      expect(variableNames).toContain('limit');
    });

    it('GET_PRODUCTS_QUERY should have filter variables', () => {
      const operation = GET_PRODUCTS_QUERY.definitions[0] as any;
      const variableNames = operation.variableDefinitions.map(
        (v: any) => v.variable.name.value
      );
      
      expect(variableNames).toContain('search');
      expect(variableNames).toContain('category');
      expect(variableNames).toContain('minPrice');
      expect(variableNames).toContain('maxPrice');
    });

    it('GET_PRODUCT_QUERY should be defined', () => {
      expect(GET_PRODUCT_QUERY).toBeDefined();
    });

    it('GET_PRODUCT_QUERY should have id variable', () => {
      const operation = GET_PRODUCT_QUERY.definitions[0] as any;
      expect(operation.kind).toBe('OperationDefinition');
      expect(operation.operation).toBe('query');
      expect(operation.name.value).toBe('GetProduct');
      
      const variableNames = operation.variableDefinitions.map(
        (v: any) => v.variable.name.value
      );
      expect(variableNames).toContain('id');
    });
  });

  describe('Category Queries', () => {
    it('GET_CATEGORIES_QUERY should be defined', () => {
      expect(GET_CATEGORIES_QUERY).toBeDefined();
    });

    it('GET_CATEGORIES_QUERY should have correct structure', () => {
      const operation = GET_CATEGORIES_QUERY.definitions[0] as any;
      expect(operation.kind).toBe('OperationDefinition');
      expect(operation.operation).toBe('query');
      expect(operation.name.value).toBe('GetCategories');
    });
  });

  describe('Auth Mutations', () => {
    it('LOGIN_MUTATION should be defined', () => {
      expect(LOGIN_MUTATION).toBeDefined();
    });

    it('LOGIN_MUTATION should be a mutation', () => {
      const operation = LOGIN_MUTATION.definitions[0] as any;
      expect(operation.operation).toBe('mutation');
      expect(operation.name.value).toBe('Login');
    });

    it('LOGIN_MUTATION should have input variable', () => {
      const operation = LOGIN_MUTATION.definitions[0] as any;
      const variableNames = operation.variableDefinitions.map(
        (v: any) => v.variable.name.value
      );
      expect(variableNames).toContain('input');
    });

    it('REGISTER_MUTATION should be defined', () => {
      expect(REGISTER_MUTATION).toBeDefined();
    });

    it('REGISTER_MUTATION should be a mutation', () => {
      const operation = REGISTER_MUTATION.definitions[0] as any;
      expect(operation.operation).toBe('mutation');
      expect(operation.name.value).toBe('Register');
    });

    it('LOGOUT_MUTATION should be defined', () => {
      expect(LOGOUT_MUTATION).toBeDefined();
    });

    it('LOGOUT_MUTATION should be a mutation', () => {
      const operation = LOGOUT_MUTATION.definitions[0] as any;
      expect(operation.operation).toBe('mutation');
      expect(operation.name.value).toBe('Logout');
    });

    it('GET_ME_QUERY should be defined', () => {
      expect(GET_ME_QUERY).toBeDefined();
    });

    it('GET_ME_QUERY should be a query', () => {
      const operation = GET_ME_QUERY.definitions[0] as any;
      expect(operation.operation).toBe('query');
      expect(operation.name.value).toBe('GetMe');
    });
  });

  describe('Order Queries', () => {
    it('GET_ORDERS_BY_CUSTOMER_QUERY should be defined', () => {
      expect(GET_ORDERS_BY_CUSTOMER_QUERY).toBeDefined();
    });

    it('GET_ORDERS_BY_CUSTOMER_QUERY should have customerId variable', () => {
      const operation = GET_ORDERS_BY_CUSTOMER_QUERY.definitions[0] as any;
      const variableNames = operation.variableDefinitions.map(
        (v: any) => v.variable.name.value
      );
      expect(variableNames).toContain('customerId');
    });

    it('GET_ORDER_QUERY should be defined', () => {
      expect(GET_ORDER_QUERY).toBeDefined();
    });

    it('GET_ORDER_QUERY should have id variable', () => {
      const operation = GET_ORDER_QUERY.definitions[0] as any;
      const variableNames = operation.variableDefinitions.map(
        (v: any) => v.variable.name.value
      );
      expect(variableNames).toContain('id');
    });
  });

  describe('Query document structure', () => {
    const queries = [
      { name: 'GET_PRODUCTS_QUERY', query: GET_PRODUCTS_QUERY },
      { name: 'GET_PRODUCT_QUERY', query: GET_PRODUCT_QUERY },
      { name: 'GET_CATEGORIES_QUERY', query: GET_CATEGORIES_QUERY },
      { name: 'LOGIN_MUTATION', query: LOGIN_MUTATION },
      { name: 'REGISTER_MUTATION', query: REGISTER_MUTATION },
      { name: 'GET_ME_QUERY', query: GET_ME_QUERY },
    ];

    queries.forEach(({ name, query }) => {
      it(`${name} should have kind "Document"`, () => {
        expect(query.kind).toBe('Document');
      });

      it(`${name} should have at least one definition`, () => {
        expect(query.definitions.length).toBeGreaterThan(0);
      });
    });
  });
});
