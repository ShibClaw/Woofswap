// import { ApolloClient } from 'apollo-client'
// import { InMemoryCache } from 'apollo-cache-inmemory'
// import { HttpLink } from 'apollo-link-http'
//
// export const client = new ApolloClient({
//   link: new HttpLink({
//     uri: process.env.REACT_APP_GRAPH_V1_API,
//   }),
//   cache: new InMemoryCache(),
//   shouldBatch: true,
// })
//
// export const dibsClient = new ApolloClient({
//   link: new HttpLink({
//     uri: process.env.REACT_APP_GRAPH_DIBS_API_URL,
//   }),
//   cache: new InMemoryCache(),
//   shouldBatch: true,
// })
//
//
// export const clientV3 = new ApolloClient({
//   link: new HttpLink({
//     uri: process.env.REACT_APP_GRAPH_V3_API_URL,
//   }),
//   cache: new InMemoryCache(),
//   shouldBatch: true,
// })
//
// export const farmingClient = new ApolloClient({
//   link: new HttpLink({
//     uri: process.env.REACT_APP_V3_FARMING_API_URL,
//   }),
//   cache: new InMemoryCache(),
//   shouldBatch: true,
// })
//
// export default client
