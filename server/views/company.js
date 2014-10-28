var IVA = 1.23

module.exports = function render(content) {
  if(typeof(content) == 'array' || content.length) {
    return content.map(renderObject);
  }

  return renderObject(content);  
}

function renderObject(model) {
  return {
    id: model.id,
    name: model.name,
    area: model.area,
    description: model.description,
    img: model.img,
    url: model.url,
    contacts: model.contacts,
    history: model.history,
    participations: model.participations && model.participations.map(function(participation) {
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
          price: participation.payment.price,
          status: participation.payment.status,
          via: participation.payment.via,
        },
        items: participation.items && participation.items.map(function(item) {
          return { 
            id: item.id,
            amount: item.amount,
            kind: item.kind
          };
        })
      };
    }),
    accesses: model.accesses && model.accesses.map(function(access) {
      return {
        date: access.date,
        where: access.where,
      };
    }),
    updated: model.updated,
  }
}