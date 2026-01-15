import { gql } from '@apollo/client';

// ============== PRODUCT QUERIES ==============
export const GET_PRODUCTS_QUERY = gql`
  query GetProducts(
    $page: Int
    $limit: Int
    $search: String
    $category: String
    $minPrice: Float
    $maxPrice: Float
    $sortBy: String
    $sortOrder: String
    $featured: Boolean
    $includeInactive: Boolean
  ) {
    products(
      page: $page
      limit: $limit
      search: $search
      category: $category
      minPrice: $minPrice
      maxPrice: $maxPrice
      sortBy: $sortBy
      sortOrder: $sortOrder
      featured: $featured
      includeInactive: $includeInactive
    ) {
      products {
        id
        name
        description
        price
        stock
        category
        sellerId
        isActive
        imageUrl
        tags
        rating
        reviewCount
        createdAt
        updatedAt
      }
      pagination {
        page
        limit
        total
        pages
      }
    }
  }
`;

export const GET_PRODUCT_QUERY = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      stock
      category
      sellerId
      seller {
        id
        name
        email
      }
      isActive
      imageUrl
      tags
      rating
      reviewCount
      createdAt
      updatedAt
    }
  }
`;

// ============== CATEGORY QUERIES ==============
export const GET_CATEGORIES_QUERY = gql`
  query GetCategories($filter: CategoryFilterInput) {
    categories(filter: $filter) {
      success
      message
      data {
        id
        name
        description
        icon
        slug
        isActive
        productCount
        createdAt
        updatedAt
      }
      count
    }
  }
`;

// ============== AUTH MUTATIONS ==============
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        name
        email
        role
        isActive
        emailVerified
        createdAt
      }
      accessToken
      refreshToken
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        name
        email
        role
        isActive
        emailVerified
        createdAt
      }
      accessToken
      refreshToken
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const GET_ME_QUERY = gql`
  query GetMe {
    me {
      id
      name
      email
      phone
      role
      isActive
      emailVerified
      createdAt
      lastLogin
    }
  }
`;

// ============== ORDER QUERIES/MUTATIONS ==============
export const GET_ORDERS_BY_CUSTOMER_QUERY = gql`
  query GetOrdersByCustomer($customerId: String!) {
    ordersByCustomer(customerId: $customerId) {
      id
      orderNumber
      customerId
      customerEmail
      items {
        productId
        productName
        quantity
        price
        subtotal
      }
      subtotal
      tax
      shipping
      total
      orderStatus
      paymentStatus
      paymentMethod
      shippingAddress {
        name
        mobile
        email
        street
        city
        state
        zip
        country
      }
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GET_ORDER_QUERY = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      orderNumber
      customerId
      customerEmail
      items {
        productId
        productName
        quantity
        price
        subtotal
      }
      subtotal
      tax
      shipping
      discount
      couponCode
      total
      orderStatus
      paymentStatus
      paymentMethod
      shippingAddress {
        name
        mobile
        email
        street
        city
        state
        zip
        country
      }
      notes
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      order {
        id
        orderNumber
        customerId
        customerEmail
        sellerId
        items {
          productId
          productName
          quantity
          price
          sellerId
          subtotal
        }
        subtotal
        tax
        shipping
        discount
        couponCode
        total
        orderStatus
        paymentStatus
        paymentMethod
        shippingAddress {
          street
          city
          state
          zip
          country
        }
        notes
        createdAt
        updatedAt
      }
      orders {
        id
        orderNumber
        customerId
        customerEmail
        sellerId
        items {
          productId
          productName
          quantity
          price
          sellerId
          subtotal
        }
        subtotal
        tax
        shipping
        discount
        total
        orderStatus
        paymentStatus
        createdAt
      }
      orderCount
    }
  }
`;

export const CANCEL_ORDER_MUTATION = gql`
  mutation CancelOrder($id: ID!) {
    cancelOrder(id: $id) {
      id
      orderNumber
      orderStatus
      updatedAt
    }
  }
`;

// ============== REVIEW QUERIES/MUTATIONS ==============
export const GET_PRODUCT_REVIEWS_QUERY = gql`
  query GetProductReviews($productId: ID!, $page: Int, $limit: Int) {
    productReviews(productId: $productId, page: $page, limit: $limit) {
      reviews {
        id
        productId
        userId
        userName
        rating
        comment
        helpful
        createdAt
      }
      pagination {
        page
        limit
        total
        pages
      }
    }
  }
`;

export const CREATE_REVIEW_MUTATION = gql`
  mutation CreateReview($productId: ID!, $input: CreateReviewInput!) {
    createReview(productId: $productId, input: $input) {
      success
      message
      review {
        id
        productId
        userId
        userName
        rating
        comment
        helpful
        createdAt
      }
    }
  }
`;

// ============== COUPON QUERIES ==============
export const VALIDATE_COUPON_QUERY = gql`
  query ValidateCoupon($code: String!, $orderTotal: Float!) {
    validateCoupon(code: $code, orderTotal: $orderTotal) {
      valid
      discount
      discountValue
      finalTotal
      discountType
      message
      code
    }
  }
`;

// ============== ADDRESS QUERIES/MUTATIONS ==============
export const GET_MY_ADDRESSES_QUERY = gql`
  query GetMyAddresses {
    myAddresses {
      addresses {
        id
        userId
        name
        mobile
        email
        street
        city
        state
        zip
        country
        isDefault
        label
        createdAt
        updatedAt
      }
    }
  }
`;

export const ADD_ADDRESS_MUTATION = gql`
  mutation AddAddress($input: AddAddressInput!) {
    addAddress(input: $input) {
      success
      message
      address {
        id
        userId
        name
        mobile
        email
        street
        city
        state
        zip
        country
        isDefault
        label
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_ADDRESS_MUTATION = gql`
  mutation UpdateAddress($id: ID!, $input: UpdateAddressInput!) {
    updateAddress(id: $id, input: $input) {
      success
      message
      address {
        id
        userId
        name
        mobile
        email
        street
        city
        state
        zip
        country
        isDefault
        label
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_ADDRESS_MUTATION = gql`
  mutation DeleteAddress($id: ID!) {
    deleteAddress(id: $id) {
      success
      message
    }
  }
`;

export const SET_DEFAULT_ADDRESS_MUTATION = gql`
  mutation SetDefaultAddress($id: ID!) {
    setDefaultAddress(id: $id) {
      success
      message
      address {
        id
        userId
        name
        mobile
        email
        street
        city
        state
        zip
        country
        isDefault
        label
        createdAt
        updatedAt
      }
    }
  }
`;

// ============== EMAIL VERIFICATION MUTATIONS ==============
export const SEND_VERIFICATION_EMAIL_MUTATION = gql`
  mutation SendVerificationEmail($source: String) {
    sendVerificationEmail(source: $source) {
      success
      message
    }
  }
`;

export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail {
    verifyEmail {
      success
      message
      user {
        id
        name
        email
        role
        isActive
        emailVerified
        createdAt
      }
    }
  }
`;

// ============== PASSWORD RESET MUTATIONS/QUERIES ==============
export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!, $domain: String!) {
    forgotPassword(email: $email, domain: $domain) {
      success
      message
      resetToken
      resetUrl
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(token: $token, password: $password, confirmPassword: $confirmPassword) {
      success
      message
    }
  }
`;

export const VALIDATE_RESET_TOKEN_QUERY = gql`
  query ValidateResetToken($token: String!) {
    validateResetToken(token: $token) {
      success
      message
      email
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      success
      message
      user {
        id
        name
        email
        phone
        role
        isActive
        emailVerified
        createdAt
      }
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      success
      message
    }
  }
`;

export const GQL_QUERIES = {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_QUERY,
  GET_CATEGORIES_QUERY,
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  LOGOUT_MUTATION,
  GET_ME_QUERY,
  GET_ORDERS_BY_CUSTOMER_QUERY,
  GET_ORDER_QUERY,
  CREATE_ORDER_MUTATION,
  CANCEL_ORDER_MUTATION,
  GET_PRODUCT_REVIEWS_QUERY,
  CREATE_REVIEW_MUTATION,
  VALIDATE_COUPON_QUERY,
  GET_MY_ADDRESSES_QUERY,
  ADD_ADDRESS_MUTATION,
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  SET_DEFAULT_ADDRESS_MUTATION,
  UPDATE_PROFILE_MUTATION,
  CHANGE_PASSWORD_MUTATION,
  SEND_VERIFICATION_EMAIL_MUTATION,
  VERIFY_EMAIL_MUTATION,
  FORGOT_PASSWORD_MUTATION,
  RESET_PASSWORD_MUTATION,
  VALIDATE_RESET_TOKEN_QUERY,
};
