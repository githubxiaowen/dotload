export const E_MKDIR = 100
export const E_MKDIR_MSG = '创建文件夹失败，请检查服务器权限'

export const I_SERVER_ACCEPTED = 200
export const I_SERVER_ACCEPTED_MSG = 'FILE ACCEPTED'


/**
 *
 * @param {*} fn
 * @param {*} context
 * @param {*} args
 * eg:
 */
export const c2p = (fn, context, ...args) => new Promise((resolve, reject) => {
    fn.apply(context, args, (e, res) => {
        if (e) {
            reject(e)
        }
        else {
            resolve(res)
        }
    })
})
