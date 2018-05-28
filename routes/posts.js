const PostModel = require('../models/post')

module.exports = {
  async create (ctx, next) {
    if (ctx.method === 'GET') {
      await ctx.render('create', {
        title: '新建文章'
      })
      return
    }
    const post = Object.assign(ctx.request.body, {
      author: ctx.session.user._id
    })
    const res = await PostModel.create(post)
    ctx.body = res
  },
  async show (ctx, next) {
    const post = await PostModel.findById(ctx.params.id)
      .populate({ path: 'author', select: 'name' })
    await ctx.render('post', {
      title: post.title,
      post
    })
  },
  async edit () {

  },
  async destroy (ctx, next) {
    const post = await PostModel.findById(ctx.params.id)
    if (!post) {
      throw new Error('文章不存在')
    }
    console.log(post.author, ctx.session.user._id)
    if (post.author.toString() !== ctx.session.user._id.toString()) {
      throw new Error('没有权限')
    }
    await PostModel.findByIdAndRemove(ctx.params.id)
    ctx.flash = { success: '删除文章成功' }
    ctx.redirect('/')
  }
}
