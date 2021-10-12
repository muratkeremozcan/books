// [11.0] initial state file that will help you determine your state shape and structure for the store


/**
 * Initial state for the redux store
 * @type {Object}
 */
export default {
    error: null,
    loading: false,
    postIds: [],
    posts: {},
    commentIds: [],
    comments: {}, // comments and ids are stored separately from the actual data
    pagination: { // store info about pagination
        first: `${process.env
            .ENDPOINT}/posts?_page=1&_sort=date&_order=DESC&_embed=comments&_expand=user&_embed=likes`,
        next: null,
        prev: null,
        last: null
    },
    user: { // store info about user
        authenticated: false,
        profilePicture: null,
        id: null,
        name: null,
        token: null
    }
};
