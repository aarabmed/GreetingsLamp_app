exports.getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? (page-1) * limit : 0;
    // tt = 100
    /// 40 = 5-1 * 10
    return { limit, offset };
};

exports.queryBy = (string) => {
    const input = string?string.toLowerCase().trim():''
    let myQuery = {}
    switch (input) {
        case 'cards':
            myQuery = {
                collectionName:input
            }
            break;
        case 'invitations':
            myQuery = {
                collectionName:input
            }
            break;

        default:
            myQuery
            break;
    }
    // tt = 100
    /// 40 = 5-1 * 10
    return {myQuery};
};
  