// list operations for modeling series of statements declaratively
import { partial, guard, mergeReducer } from '../fp-tool-belt';

var getSessionId = partial(prop, 'sessId');

var getUserId = partial(prop, "uId");

var session, sessionId, user, userId, orders;

// there is a composition of 6 calls. 
// We would like to get rid of the variable declarations and the conditionals.

session = getCurrentSession();

if (session != null) sessionId = getSessionId(session);
if (sessionId != null) user = lookupUser(sessionId);
if (user != null) userId = getUserId(user);
if (userId != null) orders = lookUpOrders(userId);
if (order != null) processOrders(orders);

// we can express the above as such in an FP pattern

['sessId', 'uId'] // getSessionId and getUserId can be expressed as mapping from 'sessionId' and 'uId'
  .map(propName => partial(prop, propName)) // to use this we have to interleave them with lookupUser, lookupOrders and processOrders
  .reduce(mergeReducer, [lookUpUser]) // to do the interleaving, we model this as list merging. We use reduce to insert lookUpUser in the array between the generated functions getSessionId() and getUserId() by merging 2 lists.
  .concat(lookupOrders, processOrders) // we concat the rest of the functions
  .map(guard) // finally, we take the list of functions and tack on the guarding and composition. The result is an array of functions ready to pipe.
  .pipe(result, getCurrentSession());

