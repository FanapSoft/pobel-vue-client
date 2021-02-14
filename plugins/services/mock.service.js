import Vue from "vue";

var MockAdapter = require("axios-mock-adapter");

// mock testing user accounts
const users = [
  {
    id: 18,
    userName: 'f.naysee',
    emailAddress: "admin@demo.com",
    token: "mgfi5juf74j",
    name: 'فرحان',
    surname: 'نیسی',
    fullName: 'فرحان نیسی',
    creationTime: new Date(new Date().setFullYear('2017')),
    podContactId: '00110011',
    roleNames: ['Admin', 'Support']
  },
  {
    id: 19,
    email: "admin2@demo.com",
    token: "fgj8fjdfk43"
  }
];

const MockService = {
  init(context, inject) {
    // this sets the mock adapter on the default instance
    let mock = new MockAdapter(context.$axios);

    //inject('mockService', MockService);
    //context.$mockService = MockService;

    // mock login request
    mock.onPost("/login").reply(data => {
      const credential = JSON.parse(data.data);
      const found = users.find(user => {
        return (
          credential.email === user.email &&
          credential.password === user.password
        );
      });
      if (found) {
        return [200, found];
      }
      return [404, { errors: ["The login detail is incorrect"] }];
    });

    // mock.onGet(/\/verify\/?/).reply(data => {
    //   const token = data.headers.Authorization.replace("Token ", "");
    //   if (token !== "undefined") {
    //     const found = users.find(user => {
    //       return token === user.token;
    //     });
    //     return [200, found];
    //   }
    //   return [401, { errors: ["Invalid authentication"] }];
    // });
    mock.onGet(/\/api\/services\/app\/User\/GetAll\/?/).reply(data => {
      const token = data.headers.Authorization.replace("Bearer ", "");
      if (token !== "undefined") {
        let items = [];
        for(let i of Array(13).keys())
          items.push(users[0])

        return [200, {
          result: {
            items: items,
            totalCount: 500
          }
        }];
      }
      return [401, { errors: ["Invalid authentication"] }];
    });

    mock.onGet(/\/api\/services\/app\/User\/Get[?]?/).reply(data => {
      //console.log('mock got some data: ',data);
      const token = data.headers.Authorization.replace("Bearer ", "");
      if (token !== "undefined") {
        return [200, {
          result: users[0]
        }];
      }
      return [401, { errors: ["Invalid authentication"] }];
    });


    mock.onGet(/\/api\/services\/app\/Transactions\/GetAll\/?/).reply(data => {
      const token = data.headers.Authorization.replace("Bearer ", "");
      if (token !== "undefined") {
        let items = [];
        for(let i of Array(10).keys())
         items.push({
            id: i,
           creditAmount: Math.round(Math.random() * 10000),
           referenceDataSetId: '111111111111111111',
           creationTime: new Date(new Date().setDate(new Date().getDate() - i))
         })
        return [200, {
          result: {
            items,
            totalCount: 4578
          }
        }];
      }
      return [401, { errors: ["Invalid authentication"] }];
    });

    mock.onGet(/\/api\/services\/app\/Answers\/GetAll\/?/).reply(data => {
      const token = data.headers.Authorization.replace("Bearer ", "");
      if (token !== "undefined") {
        let items = [];
        for(let i of Array(13).keys())
          items.push({
            id: i,
            answer: i % 2,
            ignored: !!(i % 3),
            dataSetId: '1111111111111',
            creationTime: new Date(new Date().setDate(new Date().getDate() - i))
          })
        return [200, {
          result: {
            items,
            totalCount: 110
          }
        }];
      }
      return [401, { errors: ["Invalid authentication"] }];
    });

    mock.onPost(/\/api\/services\/app\/Answers\/Stats\/?/).reply(data => {
      const token = data.headers.Authorization.replace("Bearer ", "");
      if (token !== "undefined") {
        let items = [];
        // for(let i of Array(30).keys())
        //   items.push({
        //     id: i,
        //     date: new Date(new Date().setDate(new Date().getDate() - i)),
        //     count: Math.round(Math.random() * 100),
        //   })
        return [200, {
          result: {
            totalCount: 4502
          }

        }];
      }
      return [401, { errors: ["Invalid authentication"] }];
    });

    mock.onGet(/\/api\/services\/app\/Reports\/AnswersCountsTrend\/?/).reply(data => {
      const token = data.headers.Authorization.replace("Bearer ", "");
      if (token !== "undefined") {
        let items = [];
        for(let i of Array(30).keys())
          items.push({
            id: i,
            date: new Date(new Date().setDate(new Date().getDate() - i)),
            count: Math.round(Math.random() * 100),
          })
        return [200, {
          result: items

        }];
      }
      return [401, { errors: ["Invalid authentication"] }];
    });

    mock.onGet(/\/api\/services\/app\/Credit\/GetCredit\/?/).reply(data => {
      const token = data.headers.Authorization.replace("Bearer ", "");
      if (token !== "undefined") {

        return [200, {
          result: {
            credit: 2345.4598
          }

        }];
      }
      return [401, { errors: ["Invalid authentication"] }];
    });

    mock.onGet(/\/api\/services\/app\/Reports\/DataSets\/?/).reply(data => {
      const token = data.headers.Authorization.replace("Bearer ", "");
      if (token !== "undefined") {
        let items = [];
        for(let i of Array(3).keys())
          items.push({
            id: i,
            name: 'مشاهیر ایران',
            description: 'مجموعه تصاویر مشاهیر ایران',
            randomItemId: 3,
            labelingStatus: !!i%3,
            itemsCount: Math.floor(Math.random() * 1000)
          })
        return [200, {
          result: {
            items,
            totalCount: 3
          }

        }];
      }
      return [401, { errors: ["Invalid authentication"] }];
    });

    mock.onGet(/\/api\/services\/app\/DataSets\/GetAll\/?/).reply(data => {
      const token = data.headers.Authorization.replace("Bearer ", "");
      if (token !== "undefined") {
        let items = [];
        for(let i of Array(10).keys())
          items.push({
            id: i,
            name: 'مشاهیر ایران',
            description: 'مجموعه تصاویر از مشاهیر ایران',
            labelingStatus: !!i%2
          })
        return [200, {
          result: {
            items,
            totalCount: 10
          }

        }];
      }
      return [401, { errors: ["Invalid authentication"] }];
    });
    mock.onGet(/\/api\/services\/app\/Datasets\/Get\/?/).reply(data => {
      const token = data.headers.Authorization.replace("Bearer ", "");
      if (token !== "undefined") {

        return [200, {
          result: {
            id: 111,
            name: 'مشاهیر ایران',
            description: 'مجموعه تصاویر از مشاهیر ایران',
          }

        }];
      }
      return [401, { errors: ["Invalid authentication"] }];
    });
    mock.onGet(/\/api\/services\/app\/TargetDefinitions\/GetAll\/?/).reply(data => {
      const token = data.headers.Authorization.replace("Bearer ", "");
      if (token !== "undefined") {
        let items = [];
        for(let i of Array(Math.round(Math.random() * 10)).keys())
          items.push({
            id: i,
            answerCount: Math.round(Math.random() * 1000),
            uMin: 10,
            uMax: 10,
            t: 10,
            bonusFalse: 10,
          })
        return [200, {
          result: {
            items,
            totalCount: 10
          }
        }];
      }
      return [401, { errors: ["Invalid authentication"] }];
    });
    mock.onGet(/\/api\/services\/app\/DataSetItems\/GetAll\/?/).reply(data => {
      const token = data.headers.Authorization.replace("Bearer ", "");
      if (token !== "undefined") {
        let items = [];
        for(let i of Array( 10).keys())
          items.push({
            id: i,
            label: {
              name: 'jjj'
            },
            datasetID: '1111111111111'
          })
        return [200, {
          result: {
            items,
            totalCount: 100
          }
        }];
      }
      return [401, { errors: ["Invalid authentication"] }];
    });
    mock.onGet(/\/file\/dataset\/item\/?/).reply(data => {
      console.log('??')
      const token = data.headers.Authorization.replace("Bearer ", "");
      if (token !== "undefined") {
        let items = [];

        return [302, null, {
          location: "/assets/images/techworld.png"
        }];
      }
      return [401, { errors: ["Invalid authentication"] }];
    });

  }
};

export default MockService.init
