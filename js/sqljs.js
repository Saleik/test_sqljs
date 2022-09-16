const displayCard = (data)=>{
  return `<div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0 pl-0">
              <div class="col-md-4">
                <img src="${data.img_url}" class="img-fluid rounded-start h-100" alt="image placeholder">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">${data.name}</h5>
                  <div class="card-subtitle">
                    <span><b>${data.address}</b></span>
                    /
                    <span><b>${data.phone}</b></span>
                  </div>
                  <p class="card-text">${data.description}</p>
                </div>
              </div>
            </div>
          </div>`
}

let config = {
  locateFile: () => "/dist/sql-wasm.wasm",
};
initSqlJs(config).then(function (SQL) {
  const cards = document.querySelector('#cards');
  const db = new SQL.Database();
  db.run("CREATE TABLE users (id, name, phone, address, img_url, description);");
  db.run(
    `INSERT INTO users (id, name, phone, address, img_url, description)
    VALUES (1,'Rébecca Armand','0556279012','Saint-Didier-des-Bois', 'http://placeimg.com/250/300/any', "I can't do that as Bruce Wayne... as a man. I'm flesh and blood. I can be ignored, destroyed. But as a symbol, I can be incorruptible, I can be everlasting."),
    (2, 'Aimée Hebert', '0626288021', 'Marigny-le-Châtel', 'http://placeimg.com/250/300/any', "I'll be standing where l belong. Between you and the people of Gotham. I will go back to Gotham and I will fight men like this but I will not become an executioner."),
    (3, 'Marielle Ribeiro','0755214379', 'Maillères', 'http://placeimg.com/200/250/any', "I'm not wearing hockey pads. I'll be standing where l belong. Between you and the people of Gotham. It's not who I am underneath but what I do that defines me."),
    (4, 'Hilaire Savary', '0133146210','Conie-Molitard', 'http://placeimg.com/200/250/any', "Hero can be anyone. Even a man knowing something as simple and reassuring as putting a coat around a young boy shoulders to let him know the world hadn't ended.");`
    );
  const new_id = () =>{
    return db.exec('SELECT * FROM users')[0].values.length + 1
  }

  db.run(
    'INSERT INTO users (id, name, phone, address, img_url, description) VALUES ($id, $name, $phone, $address, $img_url, $description)',
    {
      $id: new_id(),
      $name:'Jonathan Serafini',
      $phone:'0755438912',
      $address: '10 rue des bois',
      $img_url:'http://placeimg.com/200/250/any',
      $description:'The first time I stole so that I wouldn\'t starve, yes. I lost many assumptions about the simple nature of right and wrong. And when I traveled I learned the fear before a crime and the thrill of success. But I never became one of them.'
    });

  let getAll = db.prepare("SELECT * FROM users");

  while (getAll.step()) {
    const row = getAll.getAsObject();
    cards.insertAdjacentHTML('beforeend', displayCard(row));
  }
  //avoid memory leak
  getAll.free();
});
