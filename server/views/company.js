var Boom = require('boom')
var IVA = 1.23
var PUBLIC_STATUS = 'announced'

module.exports = function render (content, isAuthenticated, event) {
  if (content instanceof Array) {
    if (isAuthenticated === false) {
      content = content && content.filter(function (model) {
        return model.participations && model.participations.filter(function (p) {
          if (event) return p.advertisementLvl && p.event === event && p.status === PUBLIC_STATUS
          return p.advertisementLvl && p.status === PUBLIC_STATUS
        }).length > 0
      })
    }

    return content.map(function (model) { return renderObject(model, isAuthenticated) })
  } else {
    // Hack, this shouldn't probably be done here, but as all the related logic is here, let's keep on...
    if (isAuthenticated === false) {
      if (!content.participations || content.participations.filter(function (p) {
        if (event) return p.event === event && p.status && p.status.toLowerCase() === PUBLIC_STATUS
        return p.status && p.status.toLowerCase() === PUBLIC_STATUS
      }).length < 1) {
        return Boom.notFound()
      }
    }
  }

  return renderObject(content, isAuthenticated)
}

function renderObject (model, isAuthenticated) {
  if (model.toObject) {
    model = model.toObject({ getters: true })
  }

  if (isAuthenticated === false) {
    return {
      id: model.id || '',
      thread: model.thread || '',
      name: model.name || '',
      area: model.area || '',
      description: model.description || '',
      img: model.img || '',
      updated: model.updated || '',
      advertisementLvl: model.participations.filter(function (p) { return p.advertisementLvl && p.status === PUBLIC_STATUS })[0].advertisementLvl
    }
  }

  return {
    id: model.id,
    unread: model.unread,
    thread: model.thread,
    name: model.name,
    area: model.area,
    description: model.description,
    img: model.img,
    storedImg: model.img && '/api/images/' + new Buffer(model.img || '').toString('base64'),
    url: model.url,
    contacts: model.contacts,
    history: model.history,
    participations: model.participations && model.participations.map(function (participation) {
      return {
        event: participation.event,
        member: participation.member,
        status: participation.status,
        kind: participation.kind,
        payment: participation.payment && {
          price: participation.payment.price,
          iva: IVA,
          total: participation.payment.price * IVA,
          date: participation.payment.date,
          invoice: participation.payment.invoice,
          status: participation.payment.status,
          via: participation.payment.via
        },
        advertisementLvl: participation.advertisementLvl,
        items: participation.items && participation.items.map(function (item) {
          return {
            id: item.id,
            amount: item.amount,
            kind: item.kind
          }
        })
      }
    }),
    accesses: model.accesses && model.accesses.map(function (access) {
      return {
        date: access.date,
        where: access.where
      }
    }),
    updated: model.updated
  }
}
